"use client";
import { Button, Col, FormCheck, FormControl, FormLabel, FormSelect, Row } from "react-bootstrap";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { createQuiz, updateQuiz } from "../../reducer"; 
import { ASSIGNMENT_GROUP, QUIZ_TYPES } from "../../constants";


const formatToReadable = (str: string) => {
    return str ? str.toLowerCase().split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") : "";
};


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

 
  const existingQuiz = quizzes.find((q: any) => q._id === qid);
  
  const [quiz, setQuiz] = useState({
    title: existingQuiz?.title || "New Quiz",
    description: existingQuiz?.description || "",
    points: existingQuiz?.points || 100,
    
    type: existingQuiz?.quizType || "GRADED_QUIZ", 
    assignmentGroup: existingQuiz?.assignmentGroup || "QUIZZES",
    shuffleAnswers: existingQuiz?.shuffleAnswers ?? true,
    timeLimit: existingQuiz?.timeLimit ?? 20,
    multipleAttempts: existingQuiz?.multipleAttempts ?? false,
    howManyAttempts: existingQuiz?.howManyAttempts ?? 1,
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

  const handleSave = async () => {
    try {
      const payload = preparePayload(false);
      if (qid === "new") {
        const result = await dispatch(createQuiz(payload));
        router.push(`/Courses/${cid}/Quizzes/${result.payload._id}`);
      } else {
          await dispatch(updateQuiz({ ...payload, _id: qid }));
          router.push(`/Courses/${cid}/Quizzes/${qid}`);
      }
      
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
      let newState = { ...quiz, [field]: value };

    if (field === "multipleAttempts" && value === false) {
        newState.howManyAttempts = 1;
    }

    setQuiz(newState);
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
          <FormLabel htmlFor="wd-assignment-group">Quiz Group</FormLabel>
        </Col>
        <Col sm={6}>
          <FormSelect 
            id="wd-quiz-group"
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

          
          <FormCheck
            type="checkbox"
            label="Allow Multiple Attempts"
            checked={quiz.multipleAttempts}
            onChange={(e) => handleChange("multipleAttempts", e.target.checked)}
            className="mt-2"
          />

      
          {quiz.multipleAttempts && (
            <div className="d-flex align-items-center mt-2 ps-3">
              <FormLabel className="me-2 mb-0 small">Max Attempts:</FormLabel>
              <FormControl
                type="number"
                min="1"
                // Ensure a default of 1 if the input is somehow cleared
                value={quiz.howManyAttempts || 1} 
                onChange={(e) => handleChange("howManyAttempts", parseInt(e.target.value))}
                style={{ width: "60px" }}
              />
            </div>
          )}

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

          <FormCheck 
            type="checkbox"
            name="oneQuestionAtATime"
            label="One Question At a Time"
            checked={quiz.oneQuestionAtATime}
            onChange={(e) => handleChange("oneQuestionAtATime", e.target.checked)}
          />

          <FormCheck
            type="checkbox"
            name="webcamRequired"
            label="Webcam Required"
            checked={quiz.webcamRequired}
            onChange={(e) => handleChange("webcamRequired", e.target.checked)} 
          />

          <FormCheck
            type="checkbox"
            name="lockQuestionsAfterAnswering"
            label="Lock Questions After Answering"
            checked={quiz.lockQuestionsAfterAnswering} 
            onChange={(e) => handleChange("lockQuestionsAfterAnswering", e.target.checked)} 
          />
        
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