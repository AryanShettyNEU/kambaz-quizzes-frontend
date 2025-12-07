// "use client";
// import {
//   Button,
//   Form,
//   InputGroup,
//   ListGroup,
//   ListGroupItem,
// } from "react-bootstrap";
// import { BsGripVertical, BsPlusLg } from "react-icons/bs";
// import { FaCaretDown } from "react-icons/fa6";
// import QuizItem from "./QuizItem";
// import "./index.css";
// import { FaSearch } from "react-icons/fa";
// import { useSelector } from "react-redux";

// const quizList = [
//   {
//     title: "Chapter 1: Introduction to React",
//     availableDate: "2026-10-01",
//     dueDate: "2026-10-07",
//     points: 10,
//     cid: "RS102",
//     isFaculty: false,
//     qid: "quiz_001",
//     questions: 10,
//   },
//   {
//     title: "Midterm Examination",
//     availableDate: "2023-11-15 09:00 AM",
//     dueDate: "2023-11-15 11:00 AM",
//     points: "100 pts",
//     cid: "RS102",
//     isFaculty: true,
//     qid: "quiz_midterm",
//     questions: 2,
//   },
//   {
//     title: "Pop Quiz: State Management",
//     availableDate: "2023-10-20",
//     dueDate: "2023-10-21",
//     points: 5,
//     cid: "RS102",
//     isFaculty: false,
//     qid: "quiz_005",
//     questions: 8,
//   },
//   {
//     title: "Final Project Submission",
//     availableDate: "2025-12-01",
//     dueDate: "2025-12-15",
//     points: 150,
//     cid: "RS101",
//     isFaculty: true,
//     qid: "quiz_final",
//     questions: 16,
//   },
//   {
//     title: "Safety Orientation",
//     availableDate: "Jan 1, 2024",
//     dueDate: "Jan 31, 2024",
//     points: "Pass/Fail",
//     cid: "RS103",
//     isFaculty: false,
//     qid: "quiz_safety",
//     questions: 3,
//   },
// ];
// const QuizzesPage = () => {
//   const { currentUser } = useSelector((state: any) => state.accountReducer);

//   const isFaculty = currentUser?.role === "FACULTY";
//   return (
//     <div>
//       <div className="d-flex flex-row justify-content-between mb-4">
//         <InputGroup style={{ maxWidth: "300px" }} id="wd-search-assignment">
//           <InputGroup.Text
//             className="bg"
//             style={{
//               background: "transparent",
//               borderRight: "none",
//               paddingRight: 0,
//             }}
//           >
//             <FaSearch color="gray" />
//           </InputGroup.Text>
//           <Form.Control
//             type="text"
//             placeholder="Search for Quiz"
//             aria-label="Search"
//             style={{
//               borderLeft: "none",
//             }}
//           />
//         </InputGroup>
//         <div className="float-end">
//           {isFaculty && (
//             <Button
//               variant="danger"
//               size="lg"
//               className="me-1 rounded-2"
//               id="wd-add-quiz"
//               onClick={() => {
//                 // redirect("./Assignments/New");
//               }}
//             >
//               <BsPlusLg />
//               <span className="fw-bold">Quiz</span>
//             </Button>
//           )}
//         </div>
//       </div>
//       <ListGroup id="wd-quizzes" className="rounded-0">
//         <ListGroupItem className="wd-module p-0 mb-5 fs-5 border-gray">
//           <div className="wd-title p-3 ps-2 bg-secondary d-flex flex-row justify-content-between align-middle ">
//             <span>
//               <FaCaretDown className="me-2" />
//               <span className="fw-bold">Assignment Quizzes</span>
//             </span>
//           </div>
//           {quizList.map((quiz) => (
//             <QuizItem {...quiz} key={quiz.qid} />
//           ))}
//         </ListGroupItem>
//       </ListGroup>
//     </div>
//   );
// };

// export default QuizzesPage;


"use client";
import React, { useEffect } from "react";
import { Container, Row, Col, Button, InputGroup, Form, ListGroup } from "react-bootstrap";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import QuizItem from "./QuizItem"; // Ensures we use the component from Step 2
import { fetchQuizzesForCourse } from "./reducer";

export default function Quizzes() {
  const { cid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch<any>(); // Type as any for Thunks
  
  // 1. Retrieve the quizzes from the Redux store
  const { quizzes } = useSelector((state: any) => state.quizzesReducer);

  useEffect(() => {
    if (cid) {
      console.log("Fetching quizzes for course:", cid); // Debugging Log
      dispatch(fetchQuizzesForCourse(cid as string));
    }
  }, [cid, dispatch]);
  
  // 2. Handle navigation to the "New Quiz" page
  // We use "new" as the ID placeholder, which the Editor will recognize
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
          {/* Rubric: Clicking Add Quiz button (+ Quiz) creates a new quiz */}
          <Button variant="danger" onClick={handleAddQuiz}>
            + Quiz
          </Button>
        </Col>
      </Row>

      <hr className="mb-4" />

      {/* Rubric: Quiz List - Empty by default. Provide message */}
      {quizzes.length === 0 && (
        <div className="text-center mt-5 p-5 border rounded bg-light">
          <h4 className="text-muted">No Quizzes Available</h4>
          <p className="mb-3">
            Click the <strong>+ Quiz</strong> button above to add your first quiz.
          </p>
        </div>
      )}

      {/* Rubric: Quiz List - Displays list of quizzes */}
      <ListGroup className="rounded-0">
        {quizzes.map((quiz: any) => (
          <QuizItem 
            key={quiz._id} 
            quiz={quiz} 
            cid={cid as string} 
          />
        ))}
      </ListGroup>
    </Container>
  );
}