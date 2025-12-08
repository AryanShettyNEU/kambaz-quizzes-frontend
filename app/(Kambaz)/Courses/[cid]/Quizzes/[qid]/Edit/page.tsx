"use client";
import React, { useState } from "react";
import { Tab, Tabs } from "react-bootstrap";
import QuizDetailsEditor from "./QuizDetailsEditor";
import QuizQuestionsEditor from "./QuizQuestionEditor";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { formatDate } from "../../utils";
import { createQuiz, updateQuiz } from "../../reducer";
import BottomActionBar from "./BottomActionBar";

const page = () => {
  const { quizzes } = useSelector((state: any) => state.quizzesReducer);
  const { cid, qid } = useParams();
  const dispatch = useDispatch<any>();
  const existingQuiz = quizzes.find((q: any) => q._id === qid);
  const router = useRouter();

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
    lockQuestionsAfterAnswering:
      existingQuiz?.lockQuestionsAfterAnswering ?? false,
    dueDate: formatDate(existingQuiz?.dueDate || new Date().toISOString()),
    availableDate: formatDate(
      existingQuiz?.availableDate || new Date().toISOString()
    ),
    untilDate: formatDate(existingQuiz?.untilDate || new Date().toISOString()),
    published: existingQuiz?.published ?? false,
  });

  const preparePayload = (isPublishing: boolean = false) => {
    return {
      ...quiz,
      course: cid,
      quizType: quiz.type,
      showCorrectAnswers: quiz.showCorrectAnswers ? "ALWAYS" : "NEVER",
      points: Number(quiz.points),
      timeLimit: Number(quiz.timeLimit),
      dueDate: quiz.dueDate
        ? new Date(quiz.dueDate).toISOString()
        : new Date().toISOString(),
      availableDate: quiz.availableDate
        ? new Date(quiz.availableDate).toISOString()
        : new Date().toISOString(),
      untilDate: quiz.untilDate
        ? new Date(quiz.untilDate).toISOString()
        : new Date().toISOString(),
      published: isPublishing ? true : quiz.published,
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

  return (
    <div className="w-100">
      <Tabs
        defaultActiveKey="details"
        id="edit-quiz-tab"
        className="custom-tabs"
      >
        <Tab eventKey={"details"} title="Details">
          <QuizDetailsEditor quiz={quiz} setQuiz={setQuiz} />
        </Tab>
        <Tab eventKey={"questions"} title="Questions">
          <QuizQuestionsEditor />
        </Tab>
      </Tabs>
      <BottomActionBar
        handleCancel={handleCancel}
        handleSave={handleSave}
        handleSaveAndPublish={handleSaveAndPublish}
      />
    </div>
  );
};

export default page;
