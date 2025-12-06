import { IAssignment, IAssignmentData } from "@/app/(Kambaz)/Database/types";
import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

const initialState: {
  assignments: IAssignment[];
} = {
  assignments: [],
};

const assignmentsSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    setAssignments: (state, action) => {
      state.assignments = action.payload;
    },
    addAssignment: (
      state,
      { payload: assignment }: { payload: IAssignmentData }
    ) => {
      const newAssignment: IAssignment = {
        _id: uuidv4(),
        modules: "Single module",
        ...assignment,
      };
      state.assignments = [...state.assignments, newAssignment];
    },
    deleteAssignment: (
      state,
      { payload: assignmentId }: { payload: string }
    ) => {
      state.assignments = state.assignments.filter(
        (m) => m._id !== assignmentId
      );
    },
    updateAssignment: (
      state,
      { payload: assignment }: { payload: IAssignment }
    ) => {
      state.assignments = state.assignments.map((m) =>
        m._id === assignment._id ? assignment : m
      );
    },
    editAssignment: (state, { payload: assignmentId }: { payload: string }) => {
      state.assignments = state.assignments.map((m) =>
        m._id === assignmentId ? { ...m, editing: true } : m
      );
    },
  },
});
export const {
  addAssignment,
  deleteAssignment,
  updateAssignment,
  editAssignment,
  setAssignments,
} = assignmentsSlice.actions;
export default assignmentsSlice.reducer;
