using ExamSystem.API.Models.DTOs;

namespace ExamSystem.API.Services
{
    public interface IExamService
    {
        Task<IEnumerable<ExamDto>> GetAllExamsAsync();
        Task<ExamDto?> GetExamByIdAsync(int id);
        Task<ExamDto> CreateExamAsync(CreateExamDto createExamDto, int createdByUserId);
        Task<ExamDto?> UpdateExamAsync(int id, UpdateExamDto updateExamDto, int userId);
        Task<bool> DeleteExamAsync(int id, int userId);
        Task<IEnumerable<ExamDto>> GetExamsByUserAsync(int userId);
        Task<ExamDto?> GetExamForStudentAsync(int examId, int userId);
    }
}
