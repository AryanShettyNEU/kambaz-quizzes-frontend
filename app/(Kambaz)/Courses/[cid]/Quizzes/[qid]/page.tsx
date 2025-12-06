"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import { BsPencil } from "react-icons/bs";
import { PiPencil } from "react-icons/pi";

const quizSettings = [
  { label: "Quiz Type", value: "Graded Quiz" },
  { label: "Points", value: "29" },
  { label: "Assignment Group", value: "QUIZZES" },
  { label: "Shuffle Answers", value: "No" },
  { label: "Time Limit", value: "30 Minutes" },
  { label: "Multiple Attempts", value: "No" },
  { label: "View Responses", value: "Always" },
  { label: "Show Correct Answers", value: "Immediately" },
  { label: "One Question at a Time", value: "Yes" },
  { label: "Require Respondus LockDown Browser", value: "No" },
  { label: "Required to View Quiz Results", value: "No" },
  { label: "Webcam Required", value: "No" },
  { label: "Lock Questions After Answering", value: "No" },
];
const page = () => {
  const { cid, qid } = useParams();

  return (
    <Container className="py-5" style={{ maxWidth: "800px" }}>
      <div className="d-flex justify-content-center gap-2">
        <Button>Preview</Button>
        <Link
          href={`/Courses/${cid}/Quizzes/${qid}/Edit`}
          className="text-decoration-none text-dark"
        >
          <Button variant="warning">
            <BsPencil /> Edit
          </Button>
        </Link>
      </div>
      <h2
        className="mb-4 text-dark fw-bold"
        style={{ borderBottom: "1px solid #dee2e6", paddingBottom: "10px" }}
      >
        Q1 - HTML
      </h2>

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
              <td className="py-3">Sep 21 at 1pm</td>
              <td className="py-3">Everyone</td>
              <td className="py-3">Sep 21 at 11:40am</td>
              <td className="py-3">Sep 21 at 1pm</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </Container>
  );
};

export default page;
