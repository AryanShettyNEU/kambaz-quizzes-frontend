"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Container, Alert, ListGroup } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { FaExclamationCircle, FaPencilAlt, FaRegQuestionCircle } from "react-icons/fa";
import QuizQuestion from "./QuizQuestion";
// FIX 1: Import the correct Async Thunk
import { submitQuizAttempt } from "../../reducer"; 

export default function QuizPreview() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch<any>(); // FIX 2: Type dispatch for Thunks

  const { quizzes, questions, attempts } = useSelector((state: any) => state.quizzesReducer);
  const quiz = quizzes.find((q: any) => q._id === qid);
  
  // TOGGLE THIS for Student vs Faculty view
  const isStudent = false; 

  // Logic State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState<Date>(new Date());

  // Load existing attempt if student
  useEffect(() => {
    if (isStudent) {
        const existingAttempt = attempts.find((a:any) => a.quizId === qid);
        if (existingAttempt) {
            setAnswers(existingAttempt.answers);
            setScore(existingAttempt.score);
            setIsSubmitted(true);
            setStartTime(new Date(existingAttempt.timestamp));
        }
    }
  }, [qid, isStudent, attempts]);

  if (!quiz) return <div>Loading...</div>;

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleSubmit = async () => {
    // FIX 3: Update Grading Logic to match Backend Structure (options array)
    let earnedPoints = 0;
    
    questions.forEach((q: any) => {
        const studentAns = answers[q._id];
        
        // Logic for MCQ and True/False (Backend uses options array)
        if (q.type === "MCQ" || q.type === "TRUE_FALSE") {
            // Find the option in the backend data that is marked correct
            const correctOption = q.options?.find((opt: any) => opt.isCorrect);
            // Compare text
            if (correctOption && correctOption.text === studentAns) {
                earnedPoints += q.points;
            }
        } 
        // Logic for Fill in Blanks
        else if (q.type === "FILL_BLANKS") {
            // Assuming backend sends multiple correct options for blanks
            const correctOptions = q.options?.filter((opt:any) => opt.isCorrect).map((o:any) => o.text);
            if (correctOptions?.some((ans:string) => ans.toLowerCase() === (studentAns||"").toLowerCase())) {
                earnedPoints += q.points;
            }
        }
    });

    setScore(earnedPoints);
    setIsSubmitted(true);

    if(isStudent) {
        const attemptData = {
            quizId: qid,
            answers: answers,
            score: earnedPoints,
            timestamp: new Date().toISOString(),
            studentId: "CURRENT_USER" // Replace with actual user ID if available
        };

        // FIX 4: Dispatch with correct Thunk payload structure
        await dispatch(submitQuizAttempt({ 
            quizId: qid as string, 
            attempt: attemptData 
        }));
    }
  };

  return (
    <Container className="py-4" style={{maxWidth: "900px"}}>
      
      {/* 1. Header Area */}
      <h3>{quiz.title}</h3>
      
      {!isStudent && (
        <Alert variant="danger" className="d-flex align-items-center border-danger text-danger bg-danger bg-opacity-10">
            <FaExclamationCircle className="me-2"/>
            This is a preview of the published version of the quiz
        </Alert>
      )}

      <p>Started: {startTime.toLocaleString()}</p>
      
      <h4 className="mb-3">Quiz Instructions</h4>
      <hr />

      {/* 2. Main Question Area */}
      {questions.length > 0 ? (
        <>
            <QuizQuestion 
                question={questions[currentQuestionIndex]}
                index={currentQuestionIndex}
                answer={answers[questions[currentQuestionIndex]._id]}
                onChange={(val: any) => handleAnswerChange(questions[currentQuestionIndex]._id, val)}
                isSubmitted={isSubmitted}
            />

            {/* Navigation Buttons */}
            <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-light border rounded">
                <div className="small text-muted">
                    {isSubmitted ? `Quiz Score: ${score}` : `Quiz saved at ${new Date().toLocaleTimeString()}`}
                </div>
                <div>
                    <Button 
                        variant="secondary" 
                        size="sm"
                        className="me-2"
                        disabled={currentQuestionIndex === 0}
                        onClick={() => setCurrentQuestionIndex(curr => curr - 1)}
                    >
                        Previous
                    </Button>

                    {currentQuestionIndex < questions.length - 1 ? (
                        <Button 
                            variant="light" 
                            className="border"
                            onClick={() => setCurrentQuestionIndex(curr => curr + 1)}
                        >
                            Next &rsaquo;
                        </Button>
                    ) : (
                        !isSubmitted && (
                            <Button variant="light" className="border" onClick={handleSubmit}>
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

      {/* 3. Faculty Edit Bar */}
      {!isStudent && (
          <div 
            className="bg-light border p-2 mb-4 d-flex align-items-center text-muted" 
            style={{cursor: 'pointer'}}
            onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/Edit`)}
          >
             <FaPencilAlt className="me-2" /> Keep Editing This Quiz
          </div>
      )}

      {/* 4. Question List Sidebar/Bottom */}
      <div className="mb-5">
        <h4>Questions</h4>
        <ListGroup variant="flush">
            {questions.map((q: any, idx: number) => (
                <ListGroup.Item 
                    key={q._id} 
                    action 
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className="border-0 px-0 py-1 text-danger"
                    style={{backgroundColor: 'transparent'}}
                >
                    <FaRegQuestionCircle className="me-2 text-muted" />
                    <span className={currentQuestionIndex === idx ? "fw-bold text-dark" : "text-danger"}>
                        Question {idx + 1}
                    </span>
                    {answers[q._id] && <span className="ms-2 text-muted small">&#10003;</span>}
                </ListGroup.Item>
            ))}
        </ListGroup>
      </div>

    </Container>
  );
}