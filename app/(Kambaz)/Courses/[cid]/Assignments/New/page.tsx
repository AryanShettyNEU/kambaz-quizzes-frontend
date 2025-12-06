"use client";
import { IAssignmentData } from "@/app/(Kambaz)/Database/types";
import { redirect, useParams } from "next/navigation";
import React, { SyntheticEvent, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addAssignment, setAssignments } from "../reducer";
import AssignmentEditor from "../AssignmentsEditor";
import * as client from "../../../client";
const New = () => {
  const dispatch = useDispatch();
  const { cid } = useParams();
  const { assignments } = useSelector((state: any) => state.assignmentsReducer);

  const [assignment, setAssignment] = useState<IAssignmentData>(() => {
    const today = new Date();
    const oneWeekLater = new Date();
    oneWeekLater.setDate(today.getDate() + 7);
    return {
      title: "New Assignment",
      description: "",
      points: 100,
      course: cid as string,
      availableDate: today.toISOString().slice(0, 10),
      dueDate: oneWeekLater.toISOString().slice(0, 10),
      untilDate: oneWeekLater.toISOString().slice(0, 10),
    };
  });

  const redirectBack = (e: SyntheticEvent) => {
    e.preventDefault();
    redirect("../Assignments");
  };

  const onSave = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!cid) return;
    const newAssignment = await client.createAssignmentForCourse(
      cid as string,
      assignment
    );

    dispatch(setAssignments([...assignments, newAssignment]));
    redirectBack(e);
  };
  return (
    <AssignmentEditor
      assignment={assignment}
      setAssignment={setAssignment}
      onClose={redirectBack}
      onSave={onSave}
    />
  );
};

export default New;
