import React from "react";
import { Form, Card } from "react-bootstrap";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function QuizQuestion({ question, index, answer, onChange, isSubmitted }: any) {

 
  const questionBody = question.questionText || question.question || "";


  let optionsToDisplay = question.options 
    ? question.options.map((o: any) => o.text) 
    : (question.choices || []);

  
  if ((question.type === "TRUE_FALSE" || question.type === "true_false") && optionsToDisplay.length === 0) {
    optionsToDisplay = ["True", "False"];
  }

 
  const isOptionCorrect = (choiceText: string) => {
    if (question.options) {
        const match = question.options.find((o: any) => o.text === choiceText);
        return match ? match.isCorrect : false;
    }
    return question.correctAnswers?.includes(choiceText);
  };

  
  const getCorrectBlanks = () => {
      if (question.options) return question.options.filter((o:any) => o.isCorrect).map((o:any) => o.text);
      return question.correctAnswers || [];
  };
  
 
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

        {(question.type === "MULTIPLE_CHOICE" || question.type === "MCQ" || question.type === "TRUE_FALSE") && (
          <div className="d-flex flex-column gap-2">
            
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
                
                 {isSubmitted && isOptionCorrect(choice) && <FaCheck className="text-success ms-2"/>}
                 {isSubmitted && answer === choice && !isOptionCorrect(choice) && <FaTimes className="text-danger ms-2"/>}
              </div>
            ))}
          </div>
        )}


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