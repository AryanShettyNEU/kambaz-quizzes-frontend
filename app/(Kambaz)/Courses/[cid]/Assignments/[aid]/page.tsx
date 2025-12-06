"use client";
import { redirect, useParams } from "next/navigation";

import AssignmentEditor from "../AssignmentsEditor";
import { SyntheticEvent, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IAssignment } from "@/app/(Kambaz)/Database/types";
import { setAssignments } from "../reducer";
import * as client from "../../../client";

export default function Edit() {
  const { aid, cid } = useParams();
  const dispatch = useDispatch();

  const { assignments } = useSelector((state: any) => state.assignmentsReducer);

  const [assignment, setAssignment] = useState(() =>
    assignments.find((assignment: IAssignment) => assignment._id == aid)
  );

  const redirectBack = (e: SyntheticEvent) => {
    e.preventDefault();
    redirect("../Assignments");
  };

  const onSave = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!cid) return;
    await client.updateAssignment(assignment);
    const newAssignments = assignments.map((a: any) =>
      a._id === assignment._id ? assignment : a
    );
    dispatch(setAssignments(newAssignments));
    redirectBack(e);
  };
  console.log(assignment);

  useEffect(() => {
    setAssignment(
      assignments.find((assignment: IAssignment) => assignment._id == aid)
    );
  }, [assignments]);

  return (
    <AssignmentEditor
      assignment={assignment as any}
      setAssignment={setAssignment as any}
      onClose={redirectBack}
      onSave={onSave}
    />
  );
}
