"use client";
import React, { useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  InputGroup,
  Form,
  ListGroup,
  ListGroupItem,
} from "react-bootstrap";
import { FaMagnifyingGlass, FaCaretDown } from "react-icons/fa6";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { BsGripVertical } from "react-icons/bs";
import QuizItem from "./QuizItem";
import { fetchQuizzesForCourse } from "./reducer";
import "./index.css";

export default function Quizzes() {
  const { cid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch<any>();

  const { quizzes } = useSelector((state: any) => state.quizzesReducer);

  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const isFaculty = currentUser?.role === "FACULTY"; // ===================

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


      <div className="d-flex align-items-center justify-content-between mb-4">
        <InputGroup className="w-50">
          <InputGroup.Text className="bg-white border-end-0">
            <FaMagnifyingGlass />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="Search for Quiz"
            className="border-start-0"
          />
        </InputGroup>
        <div>
          {isFaculty && (
            <Button variant="danger" onClick={handleAddQuiz}>
              + Quiz
            </Button>
          )}
        </div>
      </div>


      <ListGroup className="rounded-0">

        {/* 🎯 HEADER SECTION (Styled exactly like Assignments.tsx) */}
        <ListGroupItem className="p-0 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-secondary d-flex justify-content-between align-items-center">
            <div>
              <BsGripVertical className="me-2 fs-3" />
              <FaCaretDown className="me-2" />
              <span className="fw-bold">Assignment Quizzes</span>
            </div>
          </div>
        </ListGroupItem>


        {quizzes.length === 0 && (
          <div className="text-center p-5 border-start border-end border-bottom bg-white">
            <h4 className="text-muted">No Quizzes Available</h4>
            <p className="mb-0">
              Click the <strong>+ Quiz</strong> button above to add your first quiz.
            </p>
          </div>
        )}


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
