import { BsGripVertical, BsPencilSquare } from "react-icons/bs";
import { ListGroupItem } from "react-bootstrap";
import React from "react";
import LessonControlButtons from "../Modules/LessonControlButtons";
import Link from "next/link";

interface AssignmentListItemProps {
  title: string;
  modules: string;
  availableDate: string;
  dueDate: string;
  points: string | number;
  aid: string;
  cid: string;
  onDeleteAssignment: (id: string) => void;
  onUpdateAssignment: (id: string) => void;
  isFaculty: boolean;
}

const AssignmentListItem: React.FC<AssignmentListItemProps> = ({
  title,
  modules,
  availableDate,
  dueDate,
  points,
  aid,
  cid,
  onDeleteAssignment,
  onUpdateAssignment,
  isFaculty,
}) => {
  return (
    <ListGroupItem className="wd-assignment p-3 ps-1 d-flex align-items-center">
      <div className="d-flex flex-row">
        <BsGripVertical className="me-3 fs-3 text-secondary" />
        {isFaculty && (
          <BsPencilSquare
            className="me-3 mt-1 fs-5 text-success"
            onClick={() => {
              onUpdateAssignment(aid);
            }}
          />
        )}
      </div>

      <div className="flex-grow-1 d-flex align-items-start">
        <div>
          <Link
            href={`/Courses/${cid}/Assignments/${aid}`}
            className="text-decoration-none text-dark"
          >
            <h5 className="mb-1 fw-bold">{title}</h5>
          </Link>

          <p className="mb-0 text-muted small">
            <span className="text-danger">{modules}</span> |&nbsp;
            <span className="fw-bold">Not available until </span>
            {new Date(availableDate).toUTCString()} |&nbsp;
            <span className="fw-bold">Due </span>
            {new Date(dueDate).toUTCString()} | {points} pts
          </p>
        </div>
      </div>
      {isFaculty && (
        <LessonControlButtons
          onDeleteAssignment={() => {
            onDeleteAssignment(aid);
          }}
        />
      )}
    </ListGroupItem>
  );
};

export default AssignmentListItem;
