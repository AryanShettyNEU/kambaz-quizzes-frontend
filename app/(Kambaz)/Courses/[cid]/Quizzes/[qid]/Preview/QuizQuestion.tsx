import React from "react";
import { Form, Card } from "react-bootstrap";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function QuizQuestion({
  question,
  index,
  answer,
  onChange,
  isSubmitted,
  isCorrect,
}: any) {
  const questionBody = question.questionText || question.question || "";

  let optionsToDisplay = question.options
    ? question.options.map((o: any) => o.text)
    : question.choices || [];

  if (
    (question.type as string).toUpperCase() === "TRUE_FALSE" &&
    optionsToDisplay.length === 0
  ) {
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
    if (question.options)
      return question.options
        .filter((o: any) => o.isCorrect)
        .map((o: any) => o.text);
    return question.correctAnswers || [];
  };

  const getOptionStyle = (choice: string) => {
    if (!isSubmitted) return {};

    const isChoiceTruth = isOptionCorrect(choice);
    const isSelected = answer === choice;

    if (isChoiceTruth) {
      return {
        backgroundColor: "#d4edda",
        border: "1px solid #c3e6cb",
        color: "#155724",
      };
    }

    if (isSelected) {
      if (isCorrect !== undefined) {
        return isCorrect
          ? {
              backgroundColor: "#d4edda",
              border: "1px solid #c3e6cb",
              color: "#155724",
            }
          : {
              backgroundColor: "#f8d7da",
              border: "1px solid #f5c6cb",
              color: "#721c24",
            };
      }

      if (!isChoiceTruth) {
        return {
          backgroundColor: "#f8d7da",
          border: "1px solid #f5c6cb",
          color: "#721c24",
        };
      }
    }
    return {};
  };

  const isBlanksCorrect = () => {
    if (isCorrect !== undefined) return isCorrect;

    return getCorrectBlanks().some((a: string) => a === (answer || ""));
  };

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Header className="d-flex justify-content-between align-items-center bg-light">
        <h5 className="m-0 fw-bold text-dark">Question {index + 1}</h5>
        <span className="text-muted">{question.points} pts</span>
      </Card.Header>

      <Card.Body>
        <div className="mb-4">{questionBody}</div>

        {(question.type === "MULTIPLE_CHOICE" ||
          question.type === "MCQ" ||
          question.type === "TRUE_FALSE") && (
          <div className="d-flex flex-column gap-2">
            {optionsToDisplay.map((choice: string, idx: number) => {
              const isSelected = answer === choice;
              const isActuallyCorrect = isOptionCorrect(choice);

              const showCheck =
                isSubmitted &&
                (isActuallyCorrect || (isSelected && isCorrect === true));
              const showTimes =
                isSubmitted &&
                isSelected &&
                (isCorrect === false ||
                  (!isActuallyCorrect && isCorrect === undefined));

              return (
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

                  {showCheck && <FaCheck className="text-success ms-2" />}
                  {showTimes && <FaTimes className="text-danger ms-2" />}
                </div>
              );
            })}
          </div>
        )}

        {question.type === "FILL_BLANKS" && (
          <div>
            <Form.Control
              value={answer || ""}
              onChange={(e) => onChange(e.target.value)}
              disabled={isSubmitted}
              placeholder="Type your answer"
              isInvalid={isSubmitted && !isBlanksCorrect()}
              isValid={isSubmitted && isBlanksCorrect()}
            />
            {isSubmitted &&
              !isBlanksCorrect() &&
              !!getCorrectBlanks().join(", ") && (
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
