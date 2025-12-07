import React from "react";
import { Form, Card } from "react-bootstrap";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function QuizQuestion({ question, index, answer, onChange, isSubmitted }: any) {

  // 1. Get the Question Text safely (Backend uses questionText)
  const questionBody = question.questionText || question.question || "";

  // 2. Get Options safely (Backend uses options array)
  // If we have 'options' (backend), map to strings. If we have 'choices' (frontend temp), use them.
  let optionsToDisplay = question.options 
    ? question.options.map((o: any) => o.text) 
    : (question.choices || []);

  // Safety Fallback: If it's True/False but has no options (rare edge case), default to T/F
  if ((question.type === "TRUE_FALSE" || question.type === "true_false") && optionsToDisplay.length === 0) {
    optionsToDisplay = ["True", "False"];
  }

  // 3. Helper to check if an option is correct (Handles both Backend & Frontend structures)
  const isOptionCorrect = (choiceText: string) => {
    if (question.options) {
        const match = question.options.find((o: any) => o.text === choiceText);
        return match ? match.isCorrect : false;
    }
    return question.correctAnswers?.includes(choiceText);
  };

  // 4. Helper for Fill-in-Blanks (Get list of all valid answers)
  const getCorrectBlanks = () => {
      if (question.options) return question.options.filter((o:any) => o.isCorrect).map((o:any) => o.text);
      return question.correctAnswers || [];
  };
  
  // Helper to determine styling for options during review
  const getOptionStyle = (choice: string) => {
    if (!isSubmitted) return {}; // Normal taking mode

    const isCorrect = isOptionCorrect(choice); 
    const isSelected = answer === choice;

    if (isCorrect) return { backgroundColor: "#d4edda", border: "1px solid #c3e6cb", color: "#155724" }; // Green success
    if (isSelected && !isCorrect) return { backgroundColor: "#f8d7da", border: "1px solid #f5c6cb", color: "#721c24" }; // Red error
    return {};
  };

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Header className="d-flex justify-content-between align-items-center bg-light">
        <h5 className="m-0 fw-bold text-dark">Question {index + 1}</h5>
        <span className="text-muted">{question.points} pts</span>
      </Card.Header>

      <Card.Body>
        <div className="mb-4" dangerouslySetInnerHTML={{ __html: questionBody }}></div>

        {/* --- MULTIPLE CHOICE & TRUE/FALSE --- */}
        {(question.type === "MULTIPLE_CHOICE" || question.type === "MCQ" || question.type === "TRUE_FALSE") && (
          <div className="d-flex flex-column gap-2">
            {/* FIX: Use optionsToDisplay for EVERYTHING. This ensures the UI matches the DB exactly. */}
            {optionsToDisplay.map((choice: string, idx: number) => (
              <div 
                key={idx} 
                className="p-2 rounded d-flex align-items-center"
                style={getOptionStyle(choice)}
              >
                 <Form.Check
                    type="radio"
                    name={question._id}
                    id={`${question._id}-${idx}`}
                    label={choice}
                    checked={answer === choice}
                    onChange={() => !isSubmitted && onChange(choice)}
                    disabled={isSubmitted} 
                    className="flex-grow-1"
                 />
                 {/* Icons for review mode */}
                 {isSubmitted && isOptionCorrect(choice) && <FaCheck className="text-success ms-2"/>}
                 {isSubmitted && answer === choice && !isOptionCorrect(choice) && <FaTimes className="text-danger ms-2"/>}
              </div>
            ))}
          </div>
        )}

        {/* --- FILL IN BLANK --- */}
        {question.type === "FILL_BLANKS" && (
          <div>
              <Form.Control 
                  value={answer || ""} 
                  onChange={(e) => onChange(e.target.value)} 
                  disabled={isSubmitted}
                  placeholder="Type your answer" 
                  isInvalid={isSubmitted && !getCorrectBlanks().some((a:string) => a.toLowerCase() === (answer||"").toLowerCase())}
                  isValid={isSubmitted && getCorrectBlanks().some((a:string) => a.toLowerCase() === (answer||"").toLowerCase())}
              />
              {isSubmitted && !getCorrectBlanks().some((a:string) => a.toLowerCase() === (answer||"").toLowerCase()) && (
                  <Form.Text className="text-danger">
                      Correct Answer: {getCorrectBlanks().join(", ")}
                  </Form.Text>
              )}
          </div>
        )}
      </Card.Body>
    </Card>
  );
}