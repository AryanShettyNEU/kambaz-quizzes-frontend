// "use client";
// import Link from "next/link";
// import { useParams } from "next/navigation";
// import React from "react";
// import { Button, Col, Container, Row, Table } from "react-bootstrap";
// import { BsPencil } from "react-icons/bs";
// import { PiPencil } from "react-icons/pi";

// const quizSettings = [
//   { label: "Quiz Type", value: "Graded Quiz" },
//   { label: "Points", value: "29" },
//   { label: "Assignment Group", value: "QUIZZES" },
//   { label: "Shuffle Answers", value: "No" },
//   { label: "Time Limit", value: "30 Minutes" },
//   { label: "Multiple Attempts", value: "No" },
//   { label: "View Responses", value: "Always" },
//   { label: "Show Correct Answers", value: "Immediately" },
//   { label: "One Question at a Time", value: "Yes" },
//   { label: "Require Respondus LockDown Browser", value: "No" },
//   { label: "Required to View Quiz Results", value: "No" },
//   { label: "Webcam Required", value: "No" },
//   { label: "Lock Questions After Answering", value: "No" },
// ];
// const page = () => {
//   const { cid, qid } = useParams();

//   return (
//     <Container className="py-5" style={{ maxWidth: "800px" }}>
//       <div className="d-flex justify-content-center gap-2">
//         <Button>Preview</Button>
//         <Link
//           href={`/Courses/${cid}/Quizzes/${qid}/Edit`}
//           className="text-decoration-none text-dark"
//         >
//           <Button variant="warning">
//             <BsPencil /> Edit
//           </Button>
//         </Link>
//       </div>
//       <h2
//         className="mb-4 text-dark fw-bold"
//         style={{ borderBottom: "1px solid #dee2e6", paddingBottom: "10px" }}
//       >
//         Q1 - HTML
//       </h2>

//       <div className="mb-5">
//         {quizSettings.map((setting, index) => (
//           <Row key={index} className="mb-2">
//             <Col xs={6} sm={5} className="text-end fw-bold">
//               {setting.label}
//             </Col>

//             <Col xs={6} sm={7} className="text-start text-dark">
//               {setting.value}
//             </Col>
//           </Row>
//         ))}
//       </div>

//       <div className="border-top pt-3">
//         <Table responsive>
//           <thead>
//             <tr className="border-bottom">
//               <th className="fw-bold">Due</th>
//               <th className="fw-bold">For</th>
//               <th className="fw-bold">Available from</th>
//               <th className="fw-bold">Until</th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <td className="py-3">Sep 21 at 1pm</td>
//               <td className="py-3">Everyone</td>
//               <td className="py-3">Sep 21 at 11:40am</td>
//               <td className="py-3">Sep 21 at 1pm</td>
//             </tr>
//           </tbody>
//         </Table>
//       </div>
//     </Container>
//   );
// };

// export default page;



// "use client";
// import Link from "next/link";
// import { useParams, useRouter } from "next/navigation";
// import React from "react";
// import { Button, Col, Container, Row, Table } from "react-bootstrap";
// import { BsPencil } from "react-icons/bs";
// import { useSelector } from "react-redux";

// export default function QuizDetails() {
//   const { cid, qid } = useParams();
//   const { quizzes } = useSelector((state: any) => state.quizzesReducer);
//   const router = useRouter();

//   // 1. Find the specific quiz from the store
//   const quiz = quizzes.find((q: any) => q._id === qid);

//   // 2. Handle edge case (refreshing on a temp ID or invalid ID)
//   if (!quiz) {
//     return (
//       <Container className="py-5 text-center">
//         <h3>Quiz not found</h3>
//         <Button variant="primary" onClick={() => router.push(`/Courses/${cid}/Quizzes`)}>
//           Back to Quizzes
//         </Button>
//       </Container>
//     );
//   }

//   // 3. Helper to format Boolean to "Yes" / "No"
//   const yn = (bool: boolean) => (bool ? "Yes" : "No");

//   // 4. Reconstruct the settings array dynamically using the quiz data
//   const quizSettings = [
//     { label: "Quiz Type", value: quiz.type || "Graded Quiz" },
//     { label: "Points", value: quiz.points || 0 },
//     { label: "Assignment Group", value: quiz.assignmentGroup || "QUIZZES" },
//     { label: "Shuffle Answers", value: yn(quiz.shuffleAnswers) },
//     { label: "Time Limit", value: `${quiz.timeLimit || 20} Minutes` },
//     { label: "Multiple Attempts", value: yn(quiz.multipleAttempts) },
//     { label: "View Responses", value: "Always" }, // Default (not in editor schema yet)
//     { label: "Show Correct Answers", value: yn(quiz.showCorrectAnswers) },
//     { label: "One Question at a Time", value: yn(quiz.oneQuestionAtATime) },
//     { label: "Require Respondus LockDown Browser", value: "No" }, // Default
//     { label: "Required to View Quiz Results", value: "No" }, // Default
//     { label: "Webcam Required", value: yn(quiz.webcamRequired) },
//     { label: "Lock Questions After Answering", value: yn(quiz.lockQuestionsAfterAnswering) },
//   ];

//   return (
//     <Container className="py-5" style={{ maxWidth: "800px" }}>
//       <div className="d-flex justify-content-center gap-2">
//         {/* Rubric: Preview button (can be linked to a preview route later) */}
//         <Button variant="secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/Preview`)}>
//           Preview
//         </Button>

//         {/* Rubric: Edit button navigates to Editor */}
//         <Link
//           href={`/Courses/${cid}/Quizzes/${qid}/Edit`}
//           className="text-decoration-none text-dark"
//         >
//           <Button variant="warning">
//             <BsPencil /> Edit
//           </Button>
//         </Link>
//       </div>

//       <h2
//         className="mb-4 text-dark fw-bold"
//         style={{ borderBottom: "1px solid #dee2e6", paddingBottom: "10px" }}
//       >
//         {quiz.title}
//       </h2>

//       {/* Render Dynamic Settings */}
//       <div className="mb-5">
//         {quizSettings.map((setting, index) => (
//           <Row key={index} className="mb-2">
//             <Col xs={6} sm={5} className="text-end fw-bold">
//               {setting.label}
//             </Col>

//             <Col xs={6} sm={7} className="text-start text-dark">
//               {setting.value}
//             </Col>
//           </Row>
//         ))}
//       </div>

//       {/* Render Dynamic Dates */}
//       <div className="border-top pt-3">
//         <Table responsive>
//           <thead>
//             <tr className="border-bottom">
//               <th className="fw-bold">Due</th>
//               <th className="fw-bold">For</th>
//               <th className="fw-bold">Available from</th>
//               <th className="fw-bold">Until</th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <td className="py-3">{quiz.dueDate}</td>
//               <td className="py-3">Everyone</td>
//               <td className="py-3">{quiz.availableDate}</td>
//               <td className="py-3">{quiz.untilDate}</td>
//             </tr>
//           </tbody>
//         </Table>
//       </div>
//     </Container>
//   );
// }





"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { Button, Col, Container, Row, Table, Alert } from "react-bootstrap";
import { BsPencil } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
// Import the fetchAttempts thunk to load student history
import { fetchAttempts, fetchQuizDetails } from "./../reducer"; 
import { fetchQuizzesForCourse } from "./../reducer";

export default function QuizDetails() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch<any>(); // Type as <any> for Thunks

  const { quizzes, attempts } = useSelector((state: any) => state.quizzesReducer);
  const quiz = quizzes.find((q: any) => q._id === qid);

  // === TOGGLE THIS TO TEST DIFFERENT VIEWS ===
  const isFaculty = true; // Set to TRUE for Edit/Preview, FALSE for Start Quiz
  // ===========================================

  // 1. Fetch attempts on load (needed for Student View)
  useEffect(() => {
    if (cid) {
      dispatch(fetchQuizzesForCourse(cid as string));
    }
    if (qid) {
      // FIX 1: Fetch Quiz Details (Admin mode if faculty)
      // This populates state.questions in the reducer
      dispatch(fetchQuizDetails({ quizId: qid as string, asAdmin: isFaculty }));
      // FIX 2: ONLY fetch attempts if NOT faculty
      if (!isFaculty) {
        dispatch(fetchAttempts(qid as string));
      }
    }
  }, [cid, qid, isFaculty, dispatch]);

  // 2. Handle edge case (loading or invalid ID)
  if (!quiz) {
    return (
      <Container className="py-5 text-center">
        <h3>Quiz not found</h3>
        <Button variant="primary" onClick={() => router.push(`/Courses/${cid}/Quizzes`)}>
          Back to Quizzes
        </Button>
      </Container>
    );
  }

  // 3. Logic: Calculate Student Permissions
  // In a real app, you would filter 'attempts' by the current user's ID
  const myAttempts = (attempts || []).filter((a: any) => a.quizId === qid);
  const latestAttempt = myAttempts.length > 0 ? myAttempts[myAttempts.length - 1] : null;
  
  // Default to 1 attempt if 'howManyAttempts' is missing/undefined
  const allowedAttempts = quiz.multipleAttempts ? (quiz.howManyAttempts || 1) : 1;
  const remainingAttempts = allowedAttempts - myAttempts.length;

  // 4. Helper to format Boolean to "Yes" / "No"
  const yn = (bool: boolean) => (bool ? "Yes" : "No");

  // 5. Settings Configuration
  const quizSettings = [
    { label: "Quiz Type", value: quiz.type || "Graded Quiz" },
    { label: "Points", value: quiz.points || 0 },
    { label: "Assignment Group", value: quiz.assignmentGroup || "QUIZZES" },
    { label: "Shuffle Answers", value: yn(quiz.shuffleAnswers) },
    { label: "Time Limit", value: `${quiz.timeLimit || 20} Minutes` },
    { label: "Multiple Attempts", value: yn(quiz.multipleAttempts) },
    { label: "View Responses", value: "Always" }, 
    { label: "Show Correct Answers", value: yn(quiz.showCorrectAnswers) },
    { label: "One Question at a Time", value: yn(quiz.oneQuestionAtATime) },
    { label: "Require Respondus LockDown Browser", value: "No" }, 
    { label: "Required to View Quiz Results", value: "No" }, 
    { label: "Webcam Required", value: yn(quiz.webcamRequired) },
    { label: "Lock Questions After Answering", value: yn(quiz.lockQuestionsAfterAnswering) },
  ];

  return (
    <Container className="py-5" style={{ maxWidth: "800px" }}>
      
      {/* === ACTION BUTTONS AREA === */}
      <div className="d-flex justify-content-center gap-2 mb-4">
        
        {/* A. FACULTY VIEW: Edit & Preview */}
        {isFaculty && (
          <>
            <Button variant="secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/Preview`)}>
              Preview
            </Button>
            <Button variant="warning" onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/Edit`)}>
              <BsPencil /> Edit
            </Button>
          </>
        )}

        {/* B. STUDENT VIEW: Start Quiz */}
        {!isFaculty && (
           <div className="text-center w-100">
              {remainingAttempts > 0 ? (
                  <Button 
                      size="lg" 
                      variant="danger" 
                      onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/TakeQuiz`)}
                  >
                      Start Quiz
                  </Button>
              ) : (
                  <Alert variant="secondary">You have used all your attempts.</Alert>
              )}
              <div className="text-muted mt-2 small">
                  Remaining Attempts: {remainingAttempts < 0 ? 0 : remainingAttempts}
              </div>
           </div>
        )}
      </div>

      <hr />

      <h2
        className="mb-4 text-dark fw-bold"
        style={{ borderBottom: "1px solid #dee2e6", paddingBottom: "10px" }}
      >
        {quiz.title}
      </h2>

      {/* === LATEST SCORE ALERT (Student Only) === */}
      {!isFaculty && latestAttempt && (
          <Alert variant="info" className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <strong>Last Attempt:</strong> {new Date(latestAttempt.timestamp).toLocaleString()}
              </div>
              <div className="fs-4 fw-bold">
                {latestAttempt.score} / {quiz.points}
              </div>
          </Alert>
      )}

      {/* Render Dynamic Settings */}
      <div className="mb-5">
        {quizSettings.map((setting, index) => (
          <Row key={index} className="mb-2">
            <Col xs={6} sm={5} className="text-end fw-bold">
              {setting.label}
            </Col>

            <Col xs={6} sm={7} className="text-start text-dark">
              {setting.value}
            </Col>
          </Row>
        ))}
      </div>

      {/* Render Dynamic Dates */}
      <div className="border-top pt-3">
        <Table responsive>
          <thead>
            <tr className="border-bottom">
              <th className="fw-bold">Due</th>
              <th className="fw-bold">For</th>
              <th className="fw-bold">Available from</th>
              <th className="fw-bold">Until</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-3">{new Date(quiz.dueDate).toLocaleDateString()}</td>
              <td className="py-3">Everyone</td>
              <td className="py-3">{new Date(quiz.availableDate).toLocaleDateString()}</td>
              <td className="py-3">{new Date(quiz.untilDate).toLocaleDateString()}</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </Container>
  );
}