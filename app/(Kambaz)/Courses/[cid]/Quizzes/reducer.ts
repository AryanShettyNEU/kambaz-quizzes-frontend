import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as client from "./client";

// --- THUNKS (Async Actions) ---

export const fetchQuizzesForCourse = createAsyncThunk(
  "quizzes/fetchForCourse",
  async (courseId: string) => {
    return await client.findQuizzesForCourse(courseId);
  }
);

export const fetchQuizDetails = createAsyncThunk(
  "quizzes/fetchDetails",
  async ({ quizId, asAdmin }: { quizId: string; asAdmin: boolean }) => {
    return await client.findQuiz(quizId, asAdmin);
  }
);

export const createQuiz = createAsyncThunk(
  "quizzes/create",
  async (quiz: any) => {
    return await client.createQuiz(quiz);
  }
);

export const updateQuiz = createAsyncThunk(
  "quizzes/update",
  async (quiz: any) => {
    return await client.updateQuiz(quiz);
  }
);

export const deleteQuiz = createAsyncThunk(
  "quizzes/delete",
  async (quizId: string) => {
    await client.deleteQuiz(quizId);
    return quizId;
  }
);

export const togglePublish = createAsyncThunk(
  "quizzes/publish",
  async ({ quizId, published }: { quizId: string; published: boolean }) => {
    return await client.publishQuiz(quizId, published);
  }
);

export const addQuestion = createAsyncThunk(
  "quizzes/addQuestion",
  async ({ quizId, question }: { quizId: string; question: any }) => {
    return await client.createQuestion(quizId, question);
  }
);

export const updateQuestion = createAsyncThunk(
  "quizzes/updateQuestion",
  async ({ quizId, question }: { quizId: string; question: any }) => {
    return await client.updateQuestion(quizId, question._id, question);
  }
);

export const deleteQuestion = createAsyncThunk(
  "quizzes/deleteQuestion",
  async ({ quizId, questionId }: { quizId: string; questionId: string }) => {
    await client.deleteQuestion(quizId, questionId);
    return questionId;
  }
);

// --- SLICE ---

const initialState = {
  quizzes: [],
  questions: [],
  currentQuiz: null,
  loading: false,
  error: null as string | null,
  attempts: [] as any[],
};

const quizzesSlice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
    setQuestions: (state, action) => {
      state.questions = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchQuizzesForCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuizzesForCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.quizzes = action.payload;
      })

      .addCase(fetchQuizDetails.fulfilled, (state, action) => {
        state.currentQuiz = action.payload;

        state.questions = action.payload.questions || [];
      })

      .addCase(createQuiz.fulfilled, (state, action) => {
        state.quizzes = [...state.quizzes, action.payload] as any;
      })

      .addCase(updateQuiz.fulfilled, (state, action) => {
        state.quizzes = state.quizzes.map((q: any) =>
          q._id === action.payload._id ? action.payload : q
        ) as any;
      })

      .addCase(deleteQuiz.fulfilled, (state, action) => {
        state.quizzes = state.quizzes.filter(
          (q: any) => q._id !== action.payload
        );
      })

      .addCase(togglePublish.fulfilled, (state, action) => {
        state.quizzes = state.quizzes.map((q: any) =>
          q._id === action.payload._id ? action.payload : q
        ) as any;
      })

      .addCase(addQuestion.fulfilled, (state, action) => {
        state.questions = [...state.questions, action.payload] as any;
        const qIndex = state.quizzes.findIndex(
          (q: any) => q._id === action.meta.arg.quizId
        );
        if (qIndex !== -1) {
          state.quizzes[qIndex].questions = state.questions;
        }
      })
      .addCase(updateQuestion.fulfilled, (state, action) => {
        state.questions = state.questions.map((q: any) =>
          q._id === action.payload._id ? action.payload : q
        ) as any;
      })
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        state.questions = state.questions.filter(
          (q: any) => q._id !== action.payload
        );
      });
  },
});

export const { setQuestions } = quizzesSlice.actions;
export default quizzesSlice.reducer;
