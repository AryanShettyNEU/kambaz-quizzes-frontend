import {
  BsGripVertical,
  BsPencilSquare,
  BsRocket,
  BsRocketTakeoff,
} from "react-icons/bs";
import {
  Button,
  ListGroupItem,
  Overlay,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import React, { useRef, useState } from "react";
import LessonControlButtons from "../Modules/LessonControlButtons";
import Link from "next/link";
import GreenCheckmark from "../Modules/GreenCheckmark";
import { IoEllipsisVertical } from "react-icons/io5";

interface QuizItemProps {
  title: string;
  availableDate: string;
  dueDate: string;
  points: string | number;
  cid: string;
  isFaculty: boolean;
  qid: string;
  questions: number;
}

const QuizItem: React.FC<QuizItemProps> = ({
  title,
  availableDate,
  dueDate,
  points,
  cid,
  qid,
  isFaculty,
  questions,
}) => {
  const [show, setShow] = useState(false);
  const target = useRef(null);

  const popover = (
    <Popover id="popover-basic">
      <Popover.Header as="h3">Actions</Popover.Header>
      <Popover.Body>
        <div className="d-flex flex-column gap-2">
          <Button variant="warning">Edit</Button>
          <Button variant="danger">Delete</Button>
          <Button variant="success">Publish</Button>
        </div>
      </Popover.Body>
    </Popover>
  );
  const getAvailabilityMsg = () => {
    const now = new Date();
    const start = new Date(availableDate);
    const end = new Date(dueDate);

    if (now > end) {
      return "Closed";
    }

    if (now < start) {
      return `Not available until ${start.toLocaleDateString()}`;
    }

    return "Available";
  };
  return (
    <ListGroupItem className="wd-quiz p-3 ps-1 d-flex align-items-center">
      <div className="d-flex flex-row">
        <BsRocketTakeoff className="me-3 ms-3 mt-1 fs-5 text-success" />
      </div>

      <div className="flex-grow-1 d-flex align-items-start">
        <div>
          <Link
            href={`/Courses/${cid}/Quizzes/${qid}`}
            className="text-decoration-none text-dark"
          >
            <h5 className="mb-1 fw-bold">{title}</h5>
          </Link>

          <p className="mb-0 text-muted small">
            <span className="fw-bold">{getAvailabilityMsg()} </span> |&nbsp;
            <span className="fw-bold">Due </span>
            {new Date(dueDate).toUTCString()} | {points} pts | {questions}{" "}
            Questions
          </p>
        </div>
      </div>
      <div>
        <div className="float-end">
          <GreenCheckmark />
          <OverlayTrigger
            trigger="click"
            placement="right"
            overlay={popover}
            show={show}
          >
            <IoEllipsisVertical
              className="fs-4"
              onClick={() => setShow((prev) => !prev)}
            />
          </OverlayTrigger>
        </div>
      </div>
    </ListGroupItem>
  );
};

export default QuizItem;
