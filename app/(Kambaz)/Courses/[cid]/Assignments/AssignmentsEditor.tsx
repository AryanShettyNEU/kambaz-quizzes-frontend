"use client";
import { IAssignmentData } from "@/app/(Kambaz)/Database/types";
import { SyntheticEvent, useState } from "react";
import { Button, FormControl, FormLabel, Row, Col } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { addAssignment } from "./reducer";
import { redirect, useParams } from "next/navigation";

export default function AssignmentEditor({
  onSave,
  onClose,
  assignment,
  setAssignment,
}: {
  onSave: (e: SyntheticEvent) => void;
  onClose: (e: SyntheticEvent) => void;
  assignment: IAssignmentData;
  setAssignment: (value: IAssignmentData) => void;
}) {
  return (
    <div id="wd-assignments-editor">
      <FormLabel htmlFor="wd-name">Assignment Name</FormLabel>
      <FormControl
        id="wd-name"
        placeholder="Assignment"
        value={assignment.title}
        onChange={(e) =>
          setAssignment({ ...assignment, title: e.target.value })
        }
      />

      <FormControl
        className="mt-4"
        as="textarea"
        id="wd-description"
        rows={12}
        cols={42}
        value={assignment.description}
        onChange={(e) =>
          setAssignment({ ...assignment, description: e.target.value })
        }
      />

      <Row className="my-3">
        <Col sm={3} className="text-end">
          <FormLabel htmlFor="wd-points">Points</FormLabel>
        </Col>
        <Col sm={6}>
          <FormControl
            id="wd-points"
            type="number"
            value={assignment.points}
            onChange={(e) =>
              setAssignment({
                ...assignment,
                points: parseInt(e.target.value) || 0,
              })
            }
          />
        </Col>
      </Row>

      {/* 
      <Row className="mb-3">
        <Col sm={3} className="text-end">
          <FormLabel htmlFor="wd-group">Assignment Group</FormLabel>
        </Col>
        <Col sm={6}>
          <FormSelect id="wd-group">
            <option value="ASSIGNMENTS">ASSIGNMENTS</option>
            <option value="QUIZ">QUIZ</option>
          </FormSelect>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col sm={3} className="text-end">
          <FormLabel htmlFor="wd-display-grade-as">Display Grade as</FormLabel>
        </Col>
        <Col sm={6}>
          <FormSelect id="wd-display-grade-as">
            <option value="PERCENTAGE">Percentage</option>
            <option value="LETTER_GRADE">Letter Grade</option>
            <option value="ABSOLUTE">Absolute</option>
          </FormSelect>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col sm={3} className="text-end">
          <FormLabel htmlFor="wd-submission-type">Submission Type</FormLabel>
        </Col>
        <Col sm={6}>
          <div className="border p-3 rounded">
            <FormSelect id="wd-submission-type">
              <option value="ONLINE">Online</option>
              <option value="OFFLINE">Offline</option>
            </FormSelect>
          </div>
        </Col>
      </Row>
      */}

      <Row className="mb-3">
        <Col sm={3} className="text-end">
          <p>Assign</p>
        </Col>
        <Col sm={6}>
          <div className="border p-3 rounded">
            <div>
              <FormLabel htmlFor="wd-due-date" className="fw-bold">
                Due
              </FormLabel>
              <br />
              <FormControl
                type="date"
                id="wd-due-date"
                value={assignment.dueDate}
                onChange={(e) => {
                  setAssignment({ ...assignment, dueDate: e.target.value });
                  console.log(e.target.value);
                }}
              />
            </div>
            <br />
            <Row>
              <Col>
                <FormLabel htmlFor="wd-available-from" className="fw-bold">
                  Available from
                </FormLabel>
                <FormControl
                  type="date"
                  id="wd-available-from"
                  value={assignment.availableDate}
                  onChange={(e) =>
                    setAssignment({
                      ...assignment,
                      availableDate: e.target.value,
                    })
                  }
                />
              </Col>
              <Col>
                <FormLabel htmlFor="wd-available-until" className="fw-bold">
                  Until
                </FormLabel>
                <FormControl
                  type="date"
                  id="wd-available-until"
                  value={assignment.untilDate}
                  onChange={(e) =>
                    setAssignment({ ...assignment, untilDate: e.target.value })
                  }
                />
              </Col>
            </Row>
          </div>
        </Col>
      </Row>

      <hr />
      <div className="d-flex justify-content-end">
        <Button
          onClick={onClose}
          variant="secondary"
          className="me-1"
          id="wd-assignment-cancel"
        >
          Cancel
        </Button>
        <Button
          onClick={onSave}
          variant="danger"
          id="wd-assignment-save"
          href=".."
        >
          Save
        </Button>
      </div>
    </div>
  );
}
