import { createSlice } from "@reduxjs/toolkit";
import { enrollments } from "../Database";
import { v4 as uuidv4 } from "uuid";
const initialState: {
  enrollments: { _id: string; user: string; course: string }[];
} = {
  enrollments: [],
};
const enrollmentsSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {
    setEnrollments: (state, action) => {
      state.enrollments = action.payload;
    },
    enrollInCourse: (state, { payload: { userId, courseId } }) => {
      const newEnrollment = {
        _id: uuidv4(),
        course: courseId,
        user: userId,
      };
      if (
        !state.enrollments.some(
          (e) =>
            e.course === newEnrollment.course && e.user === newEnrollment.user
        )
      ) {
        state.enrollments = [...state.enrollments, newEnrollment];
      }
    },
    unEnrollInCourse: (state, { payload: { userId, courseId } }) => {
      state.enrollments = state.enrollments.filter(
        (e) => !(e.course === courseId && e.user === userId)
      );
    },
  },
});
export const { enrollInCourse, unEnrollInCourse, setEnrollments } =
  enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;
