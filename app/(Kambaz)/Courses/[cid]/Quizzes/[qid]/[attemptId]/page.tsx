"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import { getAttemptById } from "../../client";
import { QuizAttempt } from "./types";
import QuizQuestion from "../Preview/QuizQuestion";

const page = () => {
  const { attemptId } = useParams();

  const [attemptData, setAttemptData] = useState<QuizAttempt>();
  async function getAttemptData() {
    const data = await getAttemptById(attemptId as string);
    setAttemptData(data);
  }
  useEffect(() => {
    getAttemptData();
  }, [attemptId]);

  if (!attemptData) return <div>Loading...</div>;
  return (
    <div>
      <div className="fw-bold fs-4 mb-4">Score: {attemptData.score}</div>
      {attemptData.answers.map((userAnswer, idx) => (
        <QuizQuestion
          key={userAnswer._id}
          question={userAnswer.question}
          answer={userAnswer.answer}
          index={idx}
          isSubmitted={true}
          onChange={() => {}}
          isCorrect={userAnswer.isCorrect}
        />
      ))}
    </div>
  );
};

export default page;
