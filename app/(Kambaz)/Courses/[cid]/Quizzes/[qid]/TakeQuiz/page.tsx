"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Container, Alert } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import QuizQuestion from "../Preview/QuizQuestion";
import * as client from "../../client";
export default function QuizTake() {
  const { cid, qid } = useParams();
  const router = useRouter();

  const { quizzes, questions } = useSelector(
    (state: any) => state.quizzesReducer
  );

  const quiz = quizzes.find((q: any) => q._id === qid);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  if (!quiz) return <div>Loading...</div>;

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers({ ...answers, [questionId]: answer });
    if (submissionError) setSubmissionError(null);
  };

  const handleSubmit = async () => {
    const unansweredQuestions = questions.filter((q: any) => {
      const ans = answers[q._id];
      return (
        ans === undefined ||
        ans === null ||
        (typeof ans === "string" && ans.trim() === "")
      );
    });

    if (unansweredQuestions.length > 0) {
      setSubmissionError(
        `You cannot submit yet. You have ${unansweredQuestions.length} unanswered questions.`
      );
      return;
    }

    const formattedAnswers = questions.map((q: any) => ({
      questionId: q._id,
      answer: answers[q._id],
    }));

    const payload = {
      answers: formattedAnswers,
    };

    try {
      await client.createAttempt(qid as string, payload);

      router.push(`/Courses/${cid}/Quizzes/${qid}`);
    } catch (err) {
      setSubmissionError(
        (err as any)?.response?.data?.message ??
          "Failed to save attempt. Please check your connection."
      );
    }
  };

  return (
    <Container className="py-5" style={{ maxWidth: "800px" }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>{quiz.title}</h3>
        <span className="text-muted">
          Question {currentQuestionIndex + 1} of {questions.length}
        </span>
      </div>

      {submissionError && (
        <Alert
          variant="danger"
          onClose={() => setSubmissionError(null)}
          dismissible
        >
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {submissionError}
        </Alert>
      )}

      {questions.length > 0 ? (
        <>
          <QuizQuestion
            question={questions[currentQuestionIndex]}
            index={currentQuestionIndex}
            answer={answers[questions[currentQuestionIndex]._id] || ""}
            onChange={(val: any) =>
              handleAnswerChange(questions[currentQuestionIndex]._id, val)
            }
            isSubmitted={false}
          />

          <div className="d-flex justify-content-between mt-4">
            <Button
              variant="secondary"
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex((c) => c - 1)}
            >
              Previous
            </Button>

            {currentQuestionIndex < questions.length - 1 ? (
              <Button
                variant="primary"
                onClick={() => setCurrentQuestionIndex((c) => c + 1)}
              >
                Next
              </Button>
            ) : (
              <Button variant="success" size="lg" onClick={handleSubmit}>
                Submit Quiz
              </Button>
            )}
          </div>
        </>
      ) : (
        <Alert variant="danger">This quiz has no questions setup yet.</Alert>
      )}
    </Container>
  );
}
