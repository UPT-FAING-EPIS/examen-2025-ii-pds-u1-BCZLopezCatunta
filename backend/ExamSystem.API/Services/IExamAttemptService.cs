using ExamSystem.API.Models.DTOs;

namespace ExamSystem.API.Services
{
    public interface IExamAttemptService
    {
        Task<ExamAttemptDto?> StartExamAttemptAsync(StartExamAttemptDto startExamAttemptDto, int userId);
        Task<ExamAttemptDto?> GetExamAttemptAsync(int attemptId, int userId);
        Task<ExamAttemptDto?> SubmitAnswerAsync(int attemptId, SubmitAnswerDto submitAnswerDto, int userId);
        Task<ExamAttemptDto?> CompleteExamAttemptAsync(int attemptId, int userId);
        Task<IEnumerable<ExamAttemptDto>> GetUserExamAttemptsAsync(int userId);
        Task<IEnumerable<ExamAttemptDto>> GetExamResultsAsync(int examId, int teacherUserId);
    }
}
