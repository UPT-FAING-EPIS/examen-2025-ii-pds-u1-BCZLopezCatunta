import axios from 'axios';
import { Exam, ExamAttempt, CreateExamRequest, StartExamAttemptRequest, SubmitAnswerRequest } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://localhost:7000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Exam endpoints
export const examService = {
  getAllExams: async (): Promise<Exam[]> => {
    const response = await api.get('/exams');
    return response.data;
  },

  getExamById: async (id: number): Promise<Exam> => {
    const response = await api.get(`/exams/${id}`);
    return response.data;
  },

  createExam: async (exam: CreateExamRequest): Promise<Exam> => {
    const response = await api.post('/exams', exam);
    return response.data;
  },

  updateExam: async (id: number, exam: Partial<CreateExamRequest>): Promise<Exam> => {
    const response = await api.put(`/exams/${id}`, exam);
    return response.data;
  },

  deleteExam: async (id: number): Promise<void> => {
    await api.delete(`/exams/${id}`);
  },

  getExamsByUser: async (userId: number): Promise<Exam[]> => {
    const response = await api.get(`/exams/user/${userId}`);
    return response.data;
  },

  getExamForStudent: async (id: number): Promise<Exam> => {
    const response = await api.get(`/exams/${id}/student`);
    return response.data;
  },
};

// Exam Attempt endpoints
export const examAttemptService = {
  startExamAttempt: async (request: StartExamAttemptRequest): Promise<ExamAttempt> => {
    const response = await api.post('/examattempts/start', request);
    return response.data;
  },

  getExamAttempt: async (attemptId: number): Promise<ExamAttempt> => {
    const response = await api.get(`/examattempts/${attemptId}`);
    return response.data;
  },

  submitAnswer: async (attemptId: number, answer: SubmitAnswerRequest): Promise<ExamAttempt> => {
    const response = await api.post(`/examattempts/${attemptId}/answer`, answer);
    return response.data;
  },

  completeExamAttempt: async (attemptId: number): Promise<ExamAttempt> => {
    const response = await api.post(`/examattempts/${attemptId}/complete`);
    return response.data;
  },

  getUserExamAttempts: async (userId: number): Promise<ExamAttempt[]> => {
    const response = await api.get(`/examattempts/user/${userId}`);
    return response.data;
  },

  getExamResults: async (examId: number): Promise<ExamAttempt[]> => {
    const response = await api.get(`/examattempts/exam/${examId}/results`);
    return response.data;
  },
};

export default api;
