"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Container, Alert, ListGroup } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { FaRegQuestionCircle } from "react-icons/fa";
import QuizQuestion from "./QuizQuestion";

export default function QuizPreview() {
  const { cid, qid } = useParams();

  const { quizzes, questions } = useSelector(
    (state: any) => state.quizzesReducer
  );
  const quiz = quizzes.find((q: any) => q._id === qid);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState<Date>(new Date());

  if (!quiz) return <div>Loading...</div>;

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleSubmit = async () => {
    let earnedPoints = 0;

    questions.forEach((q: any) => {
      const studentAns = answers[q._id];

      if (q.type === "MCQ" || q.type === "TRUE_FALSE") {
        const correctOption = q.options?.find((opt: any) => opt.isCorrect);

        if (correctOption && correctOption.text === studentAns) {
          earnedPoints += q.points;
        }
      } else if (q.type === "FILL_BLANKS") {
        const correctOptions = q.options
          ?.filter((opt: any) => opt.isCorrect)
          .map((o: any) => o.text);
        if (correctOptions?.some((ans: string) => ans === (studentAns || ""))) {
          earnedPoints += q.points;
        }
      }
    });

    setScore(earnedPoints);
    setIsSubmitted(true);
  };

  return (
    <Container className="py-4" style={{ maxWidth: "900px" }}>
      <h3>{quiz.title}</h3>

      <p>Started: {startTime.toLocaleString()}</p>

      <h4 className="mb-3">Quiz Instructions</h4>
      <hr />

      {questions.length > 0 ? (
        <>
          <QuizQuestion
            question={questions[currentQuestionIndex]}
            index={currentQuestionIndex}
            answer={answers[questions[currentQuestionIndex]._id]}
            onChange={(val: any) =>
              handleAnswerChange(questions[currentQuestionIndex]._id, val)
            }
            isSubmitted={isSubmitted}
          />

          <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-light border rounded">
            <div className="small text-muted">
              {isSubmitted
                ? `Quiz Score: ${score}`
                : `Quiz saved at ${new Date().toLocaleTimeString()}`}
            </div>
            <div>
              <Button
                variant="secondary"
                size="sm"
                className="me-2"
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex((curr) => curr - 1)}
              >
                Previous
              </Button>

              {currentQuestionIndex < questions.length - 1 ? (
                <Button
                  variant="light"
                  className="border"
                  onClick={() => setCurrentQuestionIndex((curr) => curr + 1)}
                >
                  Next &rsaquo;
                </Button>
              ) : (
                !isSubmitted && (
                  <Button
                    variant="light"
                    className="border"
                    onClick={handleSubmit}
                  >
                    Submit Quiz
                  </Button>
                )
              )}
            </div>
          </div>
        </>
      ) : (
        <Alert variant="info">No questions in this quiz.</Alert>
      )}

      <div className="mb-5">
        <h4>Questions</h4>
        <ListGroup variant="flush">
          {questions.map((q: any, idx: number) => (
            <ListGroup.Item
              key={q._id}
              action
              onClick={() => setCurrentQuestionIndex(idx)}
              className="border-0 px-0 py-1 text-danger"
              style={{ backgroundColor: "transparent" }}
            >
              <FaRegQuestionCircle className="me-2 text-muted" />
              <span
                className={
                  currentQuestionIndex === idx
                    ? "fw-bold text-dark"
                    : "text-danger"
                }
              >
                Question {idx + 1}
              </span>
              {answers[q._id] && (
                <span className="ms-2 text-muted small">&#10003;</span>
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </Container>
  );
}
