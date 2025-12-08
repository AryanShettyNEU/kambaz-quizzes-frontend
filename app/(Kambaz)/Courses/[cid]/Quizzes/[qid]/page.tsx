"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table, Alert } from "react-bootstrap";
import { BsPencil } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import { fetchQuizDetails } from "./../reducer";
import { fetchQuizzesForCourse, togglePublish } from "./../reducer";
import * as client from "../client";
import AttemptRow from "./AttemptRow";
import { formatToReadable, getAvailabilityMsg } from "../utils";

export default function QuizDetails() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch<any>();

  const [attempts, setAttempts] = useState([]);
  const { quizzes } = useSelector((state: any) => state.quizzesReducer);
  const quiz = quizzes.find((q: any) => q._id === qid);

  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const isFaculty = currentUser?.role === "FACULTY";

  async function fetchAttempts() {
    const fetchedAttempts = await client.findAttemptsForQuiz(qid as string);
    if (fetchedAttempts) {
      setAttempts(fetchedAttempts);
    }
  }

  useEffect(() => {
    if (cid) {
      dispatch(fetchQuizzesForCourse(cid as string));
    }
    if (qid) {
      dispatch(fetchQuizDetails({ quizId: qid as string, asAdmin: isFaculty }));
      if (!isFaculty) {
        fetchAttempts();
      }
    }
  }, [cid, qid, isFaculty, dispatch]);

  if (!quiz) {
    return (
      <Container className="py-5 text-center">
        <h3>Quiz not found</h3>
        <Button
          variant="primary"
          onClick={() => router.push(`/Courses/${cid}/Quizzes`)}
        >
          Back to Quizzes
        </Button>
      </Container>
    );
  }

  const myAttempts: any[] = attempts || [];
  const latestAttempt =
    myAttempts.length > 0 ? myAttempts[myAttempts.length - 1] : null;

  const allowedAttempts = quiz.multipleAttempts ? quiz.howManyAttempts || 1 : 1;
  const remainingAttempts = allowedAttempts - myAttempts.length;

  const getAvailability = () => {
    const now = new Date();
    const start = new Date(quiz.availableDate);
    const end = new Date(quiz.dueDate);
    return !(now > end || now < start);
  };

  const isAvailable = getAvailability();

  const yn = (bool: boolean) => (bool ? "Yes" : "No");

  const quizSettings = [
    {
      label: "Quiz Type",
      value: formatToReadable(quiz.quizType) || "Graded Quiz",
    },
    { label: "Points", value: quiz.points || 0 },
    { label: "Assignment Group", value: quiz.assignmentGroup || "QUIZZES" },
    { label: "Shuffle Answers", value: yn(quiz.shuffleAnswers) },
    { label: "Time Limit", value: `${quiz.timeLimit || 20} Minutes` },
    { label: "Multiple Attempts", value: yn(quiz.multipleAttempts) },
    { label: "Show Correct Answers", value: quiz.showCorrectAnswers },
    { label: "One Question at a Time", value: yn(quiz.oneQuestionAtATime) },
    { label: "Can View Quiz Results", value: "No" },
    { label: "Webcam Required", value: yn(quiz.webcamRequired) },
    { label: "Access Code", value: quiz.accessCode },

    {
      label: "Lock Questions After Answering",
      value: yn(quiz.lockQuestionsAfterAnswering),
    },
    { label: "Maximum Number of Attempts", value: quiz.howManyAttempts },
  ];

  const handlePublishToggle = async () => {
    await dispatch(
      togglePublish({ quizId: qid as string, published: !quiz.published })
    );

    dispatch(fetchQuizzesForCourse(cid as string));
  };

  return (
    <Container className="py-5" style={{ maxWidth: "800px" }}>
      <div className="d-flex justify-content-center gap-2 mb-4">
        {isFaculty && (
          <>
            <Button
              variant={quiz.published ? "danger" : "success"}
              onClick={handlePublishToggle}
            >
              {quiz.published ? "Unpublish" : "Publish"}
            </Button>

            <Button
              variant="secondary"
              onClick={() =>
                router.push(`/Courses/${cid}/Quizzes/${qid}/Preview`)
              }
            >
              Preview
            </Button>
            <Button
              variant="warning"
              onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/Edit`)}
            >
              <BsPencil /> Edit
            </Button>
          </>
        )}

        {!isFaculty && (
          <div className="text-center w-100">
            {remainingAttempts > 0 ? (
              <>
                <Button
                  size="lg"
                  variant="danger"
                  onClick={() =>
                    router.push(`/Courses/${cid}/Quizzes/${qid}/TakeQuiz`)
                  }
                  disabled={!isAvailable}
                >
                  Start Quiz
                </Button>
                {!isAvailable && (
                  <div className="fw-bold mt-2">
                    Quiz Status: {getAvailabilityMsg(quiz)}
                  </div>
                )}
              </>
            ) : (
              <Alert variant="secondary">
                You have used all your attempts.
              </Alert>
            )}
            <div className="text-muted mt-2 small">
              Remaining Attempts:{" "}
              {remainingAttempts < 0 ? 0 : remainingAttempts}
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

      {!isFaculty && attempts.length > 0 && (
        <>
          <Alert
            variant="info"
            className="d-flex justify-content-between align-items-center mb-4"
          >
            <div>
              <strong>Last Attempt:</strong>{" "}
              {new Date(latestAttempt.submittedAt).toLocaleString()}
            </div>
            <div className="fs-4 fw-bold">
              {latestAttempt.score} / {quiz.points}
            </div>
          </Alert>
          <p className="fw-bold fs-4">Attempts:</p>
          <Table responsive className="mb-4">
            <thead>
              <tr className="border-bottom">
                <th className="fw-bold">Attempt</th>
                <th className="fw-bold">Score</th>
              </tr>
            </thead>
            <tbody>
              {attempts.map((attempt: any) => (
                <AttemptRow
                  {...attempt}
                  total={quiz.points}
                  cid={cid}
                  qid={qid}
                  attemptId={attempt._id}
                />
              ))}
            </tbody>
          </Table>
        </>
      )}

      <p className="fw-bold fs-4">Quiz Details:</p>
      <div className="mb-5">
        {quizSettings
          .filter((setting) => {
            if (isFaculty) {
              return true;
            } else {
              return [
                "Quiz Type",
                "Points",
                "Time Limit",
                "Multiple Attempts",
                "Maximum Number of Attempts",
              ].includes(setting.label);
            }
          })
          .map((setting, index) => (
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
              <td className="py-3">
                {new Date(quiz.dueDate).toLocaleDateString()}
              </td>
              <td className="py-3">Everyone</td>
              <td className="py-3">
                {new Date(quiz.availableDate).toLocaleDateString()}
              </td>
              <td className="py-3">
                {new Date(quiz.untilDate).toLocaleDateString()}
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    </Container>
  );
}
