export interface Exam {
  id: number;
  title: string;
  description?: string;
  durationMinutes: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
  createdAt: string;
  createdByUserId: number;
  createdByUserName: string;
  questions: Question[];
}

export interface Question {
  id: number;
  text: string;
  type: string;
  points: number;
  order: number;
  options: QuestionOption[];
}

export interface QuestionOption {
  id: number;
  text: string;
  isCorrect: boolean;
  order: number;
}

export interface ExamAttempt {
  id: number;
  startedAt: string;
  completedAt?: string;
  score?: number;
  totalPoints?: number;
  status: string;
  userId: number;
  userName: string;
  examId: number;
  examTitle: string;
  answers: Answer[];
}

export interface Answer {
  id: number;
  textAnswer?: string;
  selectedOptionId?: number;
  booleanAnswer?: boolean;
  pointsEarned: number;
  answeredAt: string;
  questionId: number;
  questionText: string;
  selectedOptionText?: string;
}

export interface CreateExamRequest {
  title: string;
  description?: string;
  durationMinutes: number;
  startTime: string;
  endTime: string;
  questions: CreateQuestionRequest[];
}

export interface CreateQuestionRequest {
  text: string;
  type: string;
  points: number;
  order: number;
  options: CreateQuestionOptionRequest[];
}

export interface CreateQuestionOptionRequest {
  text: string;
  isCorrect: boolean;
  order: number;
}

export interface StartExamAttemptRequest {
  examId: number;
}

export interface SubmitAnswerRequest {
  questionId: number;
  textAnswer?: string;
  selectedOptionId?: number;
  booleanAnswer?: boolean;
}
