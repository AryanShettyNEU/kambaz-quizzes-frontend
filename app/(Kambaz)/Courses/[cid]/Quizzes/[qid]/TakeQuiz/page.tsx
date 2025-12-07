"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Container, Alert, Card } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import QuizQuestion from "../Preview/QuizQuestion"; // Reuse the component!
import { submitQuizAttempt } from "../../reducer"; // The Async Thunk

export default function QuizTake() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch<any>();

  const { quizzes, questions } = useSelector((state: any) => state.quizzesReducer);
  const quiz = quizzes.find((q: any) => q._id === qid);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  
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
            const correctOptions = q.options?.filter((opt:any) => opt.isCorrect).map((o:any) => o.text);
            if (correctOptions?.some((ans:string) => ans.toLowerCase() === (studentAns||"").toLowerCase())) {
                earnedPoints += q.points;
            }
        }
    });

   
    const attemptData = {
        quizId: qid,
        answers: answers,
        score: earnedPoints,
        timestamp: new Date().toISOString(),
        studentId: "CURRENT_USER" 
    };

   
    try {
        await dispatch(submitQuizAttempt({ quizId: qid as string, attempt: attemptData }));
        
        router.push(`/Courses/${cid}/Quizzes/${qid}`);
    } catch (err) {
        alert("Failed to save attempt. Please try again.");
    }
  };

  return (
    <Container className="py-5" style={{maxWidth: "800px"}}>
      <h3>{quiz.title}</h3>
      <Alert variant="warning">
        Started: {new Date().toLocaleString()} <br/>
        <strong>Note:</strong> Once you submit, you cannot change your answers.
      </Alert>
      <hr />

      {questions.length > 0 ? (
        <>
            <QuizQuestion 
                question={questions[currentQuestionIndex]}
                index={currentQuestionIndex}
                answer={answers[questions[currentQuestionIndex]._id]}
                onChange={(val: any) => handleAnswerChange(questions[currentQuestionIndex]._id, val)}
                isSubmitted={false} 
            />

            <div className="d-flex justify-content-between mt-4">
                <Button 
                    variant="secondary" 
                    disabled={currentQuestionIndex === 0}
                    onClick={() => setCurrentQuestionIndex(c => c - 1)}
                >
                    Previous
                </Button>

                {currentQuestionIndex < questions.length - 1 ? (
                    <Button 
                        variant="primary" 
                        onClick={() => setCurrentQuestionIndex(c => c + 1)}
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