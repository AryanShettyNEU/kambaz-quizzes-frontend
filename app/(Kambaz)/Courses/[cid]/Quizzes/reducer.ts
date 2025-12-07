// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   quizzes: [], // Stores the list of quizzes
//   questions: [], // Stores questions for the currently selected quiz
//   attempts: [] as any[], // Stores student attempts: { quizId, answers, score, timestamp }
// };

// const quizzesSlice = createSlice({
//   name: "quizzes",
//   initialState,
//   reducers: {
//     setQuizzes: (state, action) => {
//       state.quizzes = action.payload;
//     },
//     addQuiz: (state, action) => {
//       state.quizzes = [action.payload, ...state.quizzes] as any;
//     },
//     deleteQuiz: (state, { payload: quizId }) => {
//       state.quizzes = state.quizzes.filter((q: any) => q._id !== quizId);
//     },
//     updateQuiz: (state, { payload: quiz }) => {
//       state.quizzes = state.quizzes.map((q: any) =>
//         q._id === quiz._id ? quiz : q
//       ) as any;
//     },
//     // --- Questions Reducers ---
//     setQuestions: (state, action) => {
//         state.questions = action.payload;
//     },
//     addQuestion: (state, { payload: question }) => {
//         state.questions = [...state.questions, question] as any;
//     },
//     updateQuestion: (state, { payload: question }) => {
//         state.questions = state.questions.map((q: any) => 
//             q._id === question._id ? question : q
//         ) as any;
//     },
//     deleteQuestion: (state, { payload: questionId }) => {
//         state.questions = state.questions.filter((q:any) => q._id !== questionId);
//     },
//     submitAttempt: (state, { payload: attempt }) => {
//         const existingIndex = state.attempts.findIndex((a:any) => a.quizId === attempt.quizId);
//         if(existingIndex !== -1) {
//             state.attempts[existingIndex] = attempt;
//         } else {
//             state.attempts = [...state.attempts, attempt] as any;
//         }
//     }
//   },
// });

// export const { setQuizzes, addQuiz, deleteQuiz, updateQuiz, setQuestions, addQuestion, updateQuestion, deleteQuestion, submitAttempt } = quizzesSlice.actions;
// export default quizzesSlice.reducer;


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
    return quizId; // Return ID so we can remove it from state
  }
);

export const togglePublish = createAsyncThunk(
  "quizzes/publish",
  async ({ quizId, published }: { quizId: string; published: boolean }) => {
    return await client.publishQuiz(quizId, published);
  }
);

// --- QUESTION THUNKS ---
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

export const submitQuizAttempt = createAsyncThunk(
  "quizzes/submitAttempt",
  async ({ quizId, attempt }: { quizId: string; attempt: any }) => {
    // This calls the backend to save the attempt
    // Make sure createAttempt exists in your client.ts!
    return await client.createAttempt(quizId, attempt); 
  }
);

export const fetchAttempts = createAsyncThunk(
  "quizzes/fetchAttempts",
  async (quizId: string) => {
    return await client.findAttemptsForQuiz(quizId);
  }
);

// --- SLICE ---

const initialState = {
  quizzes: [],
  questions: [], // We will load questions into here when editing a specific quiz
  currentQuiz: null, // Useful for the details/preview page
  loading: false,
  error: null as string | null,
  attempts: [] as any[], // Stores student attempts: { quizId, answers, score, timestamp }
};

const quizzesSlice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
    // Keep your sync reducers if you need manual overrides, 
    // but mostly rely on extraReducers now.
    setQuestions: (state, action) => {
        state.questions = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Quizzes
      .addCase(fetchQuizzesForCourse.pending, (state) => { state.loading = true; })
      .addCase(fetchQuizzesForCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.quizzes = action.payload;
      })
      
      // Fetch Single Quiz (Admin/Student)
      .addCase(fetchQuizDetails.fulfilled, (state, action) => {
        state.currentQuiz = action.payload;
        // If the backend sends questions INSIDE the quiz object, load them:
        state.questions = action.payload.questions || [];
      })

      // Create Quiz
      .addCase(createQuiz.fulfilled, (state, action) => {
        state.quizzes = [...state.quizzes, action.payload] as any;
      })

      // Update Quiz
      .addCase(updateQuiz.fulfilled, (state, action) => {
        state.quizzes = state.quizzes.map((q: any) =>
          q._id === action.payload._id ? action.payload : q
        ) as any;
      })

      // Delete Quiz
      .addCase(deleteQuiz.fulfilled, (state, action) => {
        state.quizzes = state.quizzes.filter(
          (q: any) => q._id !== action.payload
        );
      })
      
      // Publish Toggle
      .addCase(togglePublish.fulfilled, (state, action) => {
        state.quizzes = state.quizzes.map((q: any) =>
            q._id === action.payload._id ? action.payload : q
        ) as any;
      })

      // Questions
      .addCase(addQuestion.fulfilled, (state, action) => {
          // Add the new question (which comes from backend) to state
          state.questions = [...state.questions, action.payload] as any;
          const qIndex = state.quizzes.findIndex((q:any) => q._id === action.meta.arg.quizId);
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
          state.questions = state.questions.filter((q:any) => q._id !== action.payload);
      });
  },
});

export const { setQuestions } = quizzesSlice.actions;
export default quizzesSlice.reducer;
