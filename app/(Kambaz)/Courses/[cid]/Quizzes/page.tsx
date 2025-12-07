"use client";
import React, { useEffect } from "react";
import { Container, Row, Col, Button, InputGroup, Form, ListGroup } from "react-bootstrap";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import QuizItem from "./QuizItem"; 
import { fetchQuizzesForCourse } from "./reducer";

export default function Quizzes() {
  const { cid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch<any>(); 
  
  const { quizzes } = useSelector((state: any) => state.quizzesReducer);

  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const isFaculty = currentUser?.role === "FACULTY";  // ===================

  useEffect(() => {
    if (cid) {
      console.log("Fetching quizzes for course:", cid); // Debugging Log
      dispatch(fetchQuizzesForCourse(cid as string));
    }
  }, [cid, dispatch]);
  

  const handleAddQuiz = () => {
    router.push(`/Courses/${cid}/Quizzes/new/Edit`);
  };

  return (
    <Container fluid className="p-4">
      <Row className="mb-4 align-items-center justify-content-between">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text className="bg-white border-end-0">
              <FaMagnifyingGlass />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search for Quiz"
              className="border-start-0"
            />
          </InputGroup>
        </Col>
        <Col md={6} className="text-end">
          
          {isFaculty && (
            <Button variant="danger" onClick={handleAddQuiz}>
              + Quiz
            </Button>
          )}
        </Col>
      </Row>

      <hr className="mb-4" />

        <div className="text-center mt-5 p-5 border rounded bg-light">
          <h4 className="text-muted">No Quizzes Available</h4>
          <p className="mb-3">
            Click the <strong>+ Quiz</strong> button above to add your first quiz.
          </p>
        </div>
      )}

      <ListGroup className="rounded-0">
        {quizzes.map((quiz: any) => (
          <QuizItem 
            key={quiz._id} 
            quiz={quiz} 
            cid={cid as string} 
            isFaculty={isFaculty}
          />
        ))}
      </ListGroup>
    </Container>
  );
}