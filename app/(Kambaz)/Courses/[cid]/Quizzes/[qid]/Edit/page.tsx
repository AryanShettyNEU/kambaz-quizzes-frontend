"use client";
import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import QuizDetailsEditor from "./QuizDetailsEditor";
import QuizQuestionsEditor from "./QuizQuestionEditor";
import "./index.css";

const page = () => {
  return (
    <div className="w-100">
      <Tabs
        defaultActiveKey="details"
        id="edit-quiz-tab"
        className="custom-tabs"
      >
        <Tab eventKey={"details"} title="Details">
          <QuizDetailsEditor />
        </Tab>
        <Tab eventKey={"questions"} title="Questions">
          <QuizQuestionsEditor />
        </Tab>
      </Tabs>
    </div>
  );
};

export default page;
