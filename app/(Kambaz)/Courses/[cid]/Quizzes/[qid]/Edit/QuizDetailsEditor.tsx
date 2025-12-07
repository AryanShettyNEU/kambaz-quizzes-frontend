// import {
//   Button,
//   Col,
//   FormCheck,
//   FormControl,
//   FormLabel,
//   FormSelect,
//   Row,
//   Tab,
//   Tabs,
// } from "react-bootstrap";
// import { ASSIGNMENT_GROUP, QUIZ_TYPES } from "../../constants";
// import { formatToReadable } from "../../utils";
// export default function QuizDetailsEditor() {
//   return (
//     <>
//       <FormLabel htmlFor="wd-title">Quiz Title</FormLabel>
//       <FormControl id="wd-title" placeholder="Assignment" />

//       <FormControl
//         className="mt-4"
//         as="textarea"
//         id="wd-description"
//         rows={12}
//         cols={42}
//       />

//       <Row className="my-3">
//         <Col sm={3} className="text-end">
//           <FormLabel htmlFor="wd-points">Points</FormLabel>
//         </Col>
//         <Col sm={6}>
//           <FormControl id="wd-points" type="number" />
//         </Col>
//       </Row>

//       <Row className="mb-3">
//         <Col sm={3} className="text-end">
//           <FormLabel htmlFor="wd-quiz-type">Quiz Type</FormLabel>
//         </Col>
//         <Col sm={6}>
//           <FormSelect id="wd-quiz-type">
//             {QUIZ_TYPES.map((value) => (
//               <option value={value}>{formatToReadable(value)}</option>
//             ))}
//           </FormSelect>
//         </Col>
//       </Row>
//       <Row className="mb-3">
//         <Col sm={3} className="text-end">
//           <FormLabel htmlFor="wd-assignment-group">Assignment Group</FormLabel>
//         </Col>
//         <Col sm={6}>
//           <FormSelect id="wd-assignment-group">
//             {ASSIGNMENT_GROUP.map((value) => (
//               <option value={value}>{formatToReadable(value)}</option>
//             ))}
//           </FormSelect>
//         </Col>
//       </Row>
//       <Row className="mb-3">
//         <Col sm={3}></Col>
//         <Col sm={6}>
//           <h6 className="fw-bold">Options</h6>
//           <FormCheck
//             type="checkbox"
//             name="shuffleAnswers"
//             label="Shuffle Answers"
//             defaultChecked
//           />
//           <div className="d-flex align-items-center">
//             <FormCheck
//               type="checkbox"
//               name="timeLimitChecked"
//               label="Time Limit"
//               className="me-4"
//             />
//             <FormControl
//               id="wd-time-limit"
//               type="number"
//               defaultValue={20}
//               style={{
//                 width: "60px",
//               }}
//             />
//             <div className="ms-2">Minutes</div>
//           </div>
//           <div className="border p-2 mt-2 rounded">
//             <FormCheck
//               type="checkbox"
//               name="allowMultipleAttempts"
//               label="Allow Multiple Attempts"
//             />
//           </div>
//           <div className="my-2">
//             <FormLabel htmlFor="wd-access-code">Access Code</FormLabel>

//             <FormControl id="wd-access-code" type="input" />
//           </div>
//           <FormCheck
//             type="checkbox"
//             name="oneQuestionAtATime"
//             label="One Question At a Time"
//             defaultChecked
//           />
//           <FormCheck
//             type="checkbox"
//             name="webcamRequired"
//             label="Webcam Required"
//           />
//           <FormCheck
//             type="checkbox"
//             name="lockQuestionsAfterAnswering"
//             label="Lock Questions After Answering"
//           />
//         </Col>
//       </Row>
//       <Row className="mb-3">
//         <Col sm={3} className="text-end">
//           <p>Assign</p>
//         </Col>
//         <Col sm={6}>
//           <div className="border p-3 rounded">
//             <div>
//               <FormLabel htmlFor="wd-assign-to" className="fw-bold">
//                 Assign to
//               </FormLabel>
//               <br />
//               <div>Everyone</div>
//             </div>
//             <br />
//             <div>
//               <FormLabel htmlFor="wd-due-date" className="fw-bold">
//                 Due
//               </FormLabel>
//               <br />
//               <FormControl type="date" id="wd-due-date" />
//             </div>
//             <br />
//             <Row>
//               <Col>
//                 <FormLabel htmlFor="wd-available-from" className="fw-bold">
//                   Available from
//                 </FormLabel>
//                 <FormControl type="date" id="wd-available-from" />
//               </Col>
//               <Col>
//                 <FormLabel htmlFor="wd-available-until" className="fw-bold">
//                   Until
//                 </FormLabel>
//                 <FormControl type="date" id="wd-available-until" />
//               </Col>
//             </Row>
//           </div>
//         </Col>
//       </Row>
//       <hr />
//       <div className="d-flex justify-content-end">
//         <Button variant="secondary" id="wd-quiz-edit-cancel">
//           Cancel
//         </Button>
//         <Button id="wd-quiz-edit-save" href=".." className="mx-1">
//           Save
//         </Button>
//         <Button variant="danger" id="wd-quiz-edit-save" href="..">
//           Save And Publish
//         </Button>
//       </div>
//     </>
//   );
// }

"use client";
import { Button, Col, FormCheck, FormControl, FormLabel, FormSelect, Row } from "react-bootstrap";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { createQuiz, updateQuiz } from "../../reducer"; 
import { ASSIGNMENT_GROUP, QUIZ_TYPES } from "../../constants";

// Helper to format text (e.g. "GRADED_QUIZ" -> "Graded Quiz")
const formatToReadable = (str: string) => {
    return str ? str.toLowerCase().split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") : "";
};

// Helper: Convert ISO Date (from DB) to YYYY-MM-DD (for Input)
const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    try {
        return new Date(dateString).toISOString().split("T")[0];
    } catch (e) {
        return "";
    }
};

export default function QuizDetailsEditor() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch<any>(); 
  const { quizzes } = useSelector((state: any) => state.quizzesReducer);

  // 1. Initialize State
  const existingQuiz = quizzes.find((q: any) => q._id === qid);
  
  const [quiz, setQuiz] = useState({
    title: existingQuiz?.title || "New Quiz",
    description: existingQuiz?.description || "",
    points: existingQuiz?.points || 100,
    // FIX 1: Read 'quizType' from backend, not 'type'
    type: existingQuiz?.quizType || "GRADED_QUIZ", 
    assignmentGroup: existingQuiz?.assignmentGroup || "QUIZZES",
    shuffleAnswers: existingQuiz?.shuffleAnswers ?? true,
    timeLimit: existingQuiz?.timeLimit ?? 20,
    multipleAttempts: existingQuiz?.multipleAttempts ?? false,
    // FIX 2: Convert Backend String "ALWAYS" -> Boolean true
    showCorrectAnswers: existingQuiz?.showCorrectAnswers === "ALWAYS", 
    accessCode: existingQuiz?.accessCode || "",
    oneQuestionAtATime: existingQuiz?.oneQuestionAtATime ?? true,
    webcamRequired: existingQuiz?.webcamRequired ?? false,
    lockQuestionsAfterAnswering: existingQuiz?.lockQuestionsAfterAnswering ?? false,
    dueDate: formatDate(existingQuiz?.dueDate || new Date().toISOString()),
    availableDate: formatDate(existingQuiz?.availableDate || new Date().toISOString()),
    untilDate: formatDate(existingQuiz?.untilDate || new Date().toISOString()),
    published: existingQuiz?.published ?? false
  });

  // === HELPER: Prepare Payload to match Postman ===
  const preparePayload = (isPublishing: boolean = false) => {
    return {
      ...quiz,
      course: cid,
      quizType: quiz.type,
      showCorrectAnswers: quiz.showCorrectAnswers ? "ALWAYS" : "NEVER",
      points: Number(quiz.points),
      timeLimit: Number(quiz.timeLimit),
      dueDate: quiz.dueDate ? new Date(quiz.dueDate).toISOString() : new Date().toISOString(),
      availableDate: quiz.availableDate ? new Date(quiz.availableDate).toISOString() : new Date().toISOString(),
      untilDate: quiz.untilDate ? new Date(quiz.untilDate).toISOString() : new Date().toISOString(),
      questions: existingQuiz?.questions || [],
      published: isPublishing ? true : quiz.published
    };
  };

  // 2. Handle Save Logic
  const handleSave = async () => {
    try {
      const payload = preparePayload(false);
      if (qid === "new") {
          await dispatch(createQuiz(payload));
      } else {
          await dispatch(updateQuiz({ ...payload, _id: qid }));
      }
      router.push(`/Courses/${cid}/Quizzes`); 
    } catch (err) {
      alert("Failed to save quiz. Please try again.");
    }
  };

  const handleSaveAndPublish = async () => {
    try {
      const payload = preparePayload(true);
      if (qid === "new") {
          await dispatch(createQuiz(payload));
      } else {
          await dispatch(updateQuiz({ ...payload, _id: qid }));
      }
      router.push(`/Courses/${cid}/Quizzes`);
    } catch (err) {
      alert("Failed to publish quiz. Please try again.");
    }
  };

  const handleCancel = () => {
    router.push(`/Courses/${cid}/Quizzes`);
  };

  const handleChange = (field: string, value: any) => {
      setQuiz({ ...quiz, [field]: value });
  };

  return (
    <div className="p-3">
      <FormLabel htmlFor="wd-title">Quiz Title</FormLabel>
      <FormControl 
        id="wd-title" 
        value={quiz.title} 
        onChange={(e) => handleChange("title", e.target.value)} 
      />

      <FormControl
        className="mt-4"
        as="textarea"
        id="wd-description"
        rows={3}
        value={quiz.description}
        onChange={(e) => handleChange("description", e.target.value)}
      />

      <Row className="my-3">
        <Col sm={3} className="text-end">
          <FormLabel htmlFor="wd-points">Points</FormLabel>
        </Col>
        <Col sm={6}>
          <FormControl 
            id="wd-points" 
            type="number" 
            value={quiz.points}
            onChange={(e) => handleChange("points", parseInt(e.target.value))}
          />
        </Col>
      </Row>

      <Row className="mb-3">
        <Col sm={3} className="text-end">
          <FormLabel htmlFor="wd-quiz-type">Quiz Type</FormLabel>
        </Col>
        <Col sm={6}>
          <FormSelect 
            id="wd-quiz-type"
            value={quiz.type}
            onChange={(e) => handleChange("type", e.target.value)}
          >
            {QUIZ_TYPES.map((value) => (
              <option key={value} value={value}>{formatToReadable(value)}</option>
            ))}
          </FormSelect>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col sm={3} className="text-end">
          <FormLabel htmlFor="wd-assignment-group">Assignment Group</FormLabel>
        </Col>
        <Col sm={6}>
          <FormSelect 
            id="wd-assignment-group"
            value={quiz.assignmentGroup}
            onChange={(e) => handleChange("assignmentGroup", e.target.value)}
          >
            {ASSIGNMENT_GROUP.map((value) => (
              <option key={value} value={value}>{formatToReadable(value)}</option>
            ))}
          </FormSelect>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col sm={3}></Col>
        <Col sm={6}>
          <h6 className="fw-bold">Options</h6>
          <FormCheck
            type="checkbox"
            label="Shuffle Answers"
            checked={quiz.shuffleAnswers}
            onChange={(e) => handleChange("shuffleAnswers", e.target.checked)}
          />
          <div className="d-flex align-items-center mt-2">
            <FormCheck
              type="checkbox"
              label="Time Limit"
              className="me-4"
            />
            <FormControl
              type="number"
              value={quiz.timeLimit}
              onChange={(e) => handleChange("timeLimit", parseInt(e.target.value))}
              style={{ width: "60px" }}
            />
            <div className="ms-2">Minutes</div>
          </div>
          
          <div className="my-2">
            <FormLabel htmlFor="wd-access-code">Access Code</FormLabel>
            <FormControl 
                id="wd-access-code" 
                value={quiz.accessCode}
                onChange={(e) => handleChange("accessCode", e.target.value)}
            />
          </div>

          {/* FIX 3: Added the missing Show Correct Answers Checkbox */}
          <FormCheck 
            type="checkbox" 
            label="Show Correct Answers" 
            checked={quiz.showCorrectAnswers} 
            onChange={(e) => handleChange("showCorrectAnswers", e.target.checked)} 
          />
        </Col>
      </Row>

      <Row className="mb-3">
        <Col sm={3} className="text-end"><p>Assign</p></Col>
        <Col sm={6}>
          <div className="border p-3 rounded">
            <FormLabel className="fw-bold">Due</FormLabel>
            <FormControl 
                type="date" 
                value={quiz.dueDate}
                onChange={(e) => handleChange("dueDate", e.target.value)}
            />
            <br />
            <Row>
              <Col>
                <FormLabel className="fw-bold">Available from</FormLabel>
                <FormControl 
                    type="date" 
                    value={quiz.availableDate}
                    onChange={(e) => handleChange("availableDate", e.target.value)}
                />
              </Col>
              <Col>
                <FormLabel className="fw-bold">Until</FormLabel>
                <FormControl 
                    type="date" 
                    value={quiz.untilDate}
                    onChange={(e) => handleChange("untilDate", e.target.value)}
                />
              </Col>
            </Row>
          </div>
        </Col>
      </Row>

      <hr />
      
      <div className="d-flex justify-content-end gap-2">
        <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
        <Button variant="primary" onClick={handleSave}>Save</Button>
        <Button variant="danger" onClick={handleSaveAndPublish}>Save And Publish</Button>
      </div>
    </div>
  );
}