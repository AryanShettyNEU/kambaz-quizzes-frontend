import { BsRocketTakeoff } from "react-icons/bs";
import { Button, ListGroupItem, OverlayTrigger, Popover } from "react-bootstrap";
import React, { useState } from "react";
import Link from "next/link";
import GreenCheckmark from "../Modules/GreenCheckmark";
import { IoEllipsisVertical } from "react-icons/io5";
import { FaBan } from "react-icons/fa";
import { useDispatch } from "react-redux";

import { deleteQuiz, togglePublish } from "./reducer"; 

interface QuizItemProps {
  quiz: any;
  cid: string;
  isFaculty: boolean;
}

const QuizItem: React.FC<QuizItemProps> = ({ quiz, cid, isFaculty }) => {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch<any>(); 

  const handlePublish = async () => {
  
      await dispatch(togglePublish({ quizId: quiz._id, published: !quiz.published }));
      setShow(false);
  };

  const handleDelete = async () => {
      await dispatch(deleteQuiz(quiz._id));
      setShow(false);
  };

  const popover = (
    <Popover id="popover-basic">
      <Popover.Header as="h3">Actions</Popover.Header>
      <Popover.Body>
        <div className="d-flex flex-column gap-2">
          <Link href={`/Courses/${cid}/Quizzes/${quiz._id}/Edit`}>
            <Button variant="warning" className="w-100">Edit</Button>
          </Link>
          
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
          
          <Button variant={quiz.published ? "secondary" : "success"} onClick={handlePublish}>
            {quiz.published ? "Unpublish" : "Publish"}
          </Button>
        </div>
      </Popover.Body>
    </Popover>
  );

  const getAvailabilityMsg = () => {
    const now = new Date();
    const start = new Date(quiz.availableDate);
    const end = new Date(quiz.dueDate);
    if (now > end) return "Closed";
    if (now < start) return `Not available until ${start.toLocaleDateString()}`;
    return "Available";
  };

  return (
    <ListGroupItem className="wd-quiz p-3 ps-1 d-flex align-items-center">
      <div className="d-flex flex-row">
        <BsRocketTakeoff className={`me-3 ms-3 mt-1 fs-5 ${quiz.published ? "text-success" : "text-secondary"}`} />
      </div>

      <div className="flex-grow-1 d-flex align-items-start">
        <div>
          <Link href={`/Courses/${cid}/Quizzes/${quiz._id}`} className="text-decoration-none text-dark">
            <h5 className="mb-1 fw-bold">{quiz.title}</h5>
          </Link>

          <p className="mb-0 text-muted small">
            <span className="fw-bold">{getAvailabilityMsg()} </span> |&nbsp;
            <span className="fw-bold">Due </span>
            {new Date(quiz.dueDate).toLocaleDateString()} | {quiz.points} pts | 
            {quiz.questions ? quiz.questions.length : 0} Questions
          </p>
        </div>
      </div>
      {isFaculty && (
        <div>
            <div className="float-end d-flex align-items-center">
            <div onClick={handlePublish} style={{cursor: "pointer"}}>
                {quiz.published ? <GreenCheckmark /> : <FaBan className="text-danger fs-5 me-2" />}
            </div>

            <OverlayTrigger trigger="click" placement="bottom" overlay={popover} show={show} onToggle={(isOpen) => setShow(isOpen)} rootClose>
                <div style={{cursor: "pointer"}}>
                <IoEllipsisVertical className="fs-4" />
                </div>
            </OverlayTrigger>
            </div>
        </div>
      )}
    </ListGroupItem>
  );
};

export default QuizItem;