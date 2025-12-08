export interface QuizAttemptAnswer {
  _id: string;
  questionId: string;
  question: Question;
  answer: string;
  isCorrect: boolean;
}

export interface QuestionOption {
  text: string;
  isCorrect: boolean;
  _id: string;
}

export interface Question {
  _id: string;
  title: string;
  type: "TRUE_FALSE" | "MCQ" | "FILL_BLANKS";
  questionText: string;
  options: QuestionOption[];
}

export interface QuizAttempt {
  _id: string;
  user: string;
  quiz: string;
  attemptNumber: number;
  score: number;
  answers: QuizAttemptAnswer[];
  submittedAt: string;
  __v: number;
}
