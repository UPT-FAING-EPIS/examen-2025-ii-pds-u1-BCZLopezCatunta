using Microsoft.EntityFrameworkCore;
using ExamSystem.API.Data;
using ExamSystem.API.Models;
using ExamSystem.API.Models.DTOs;

namespace ExamSystem.API.Services
{
    public class ExamService : IExamService
    {
        private readonly ExamSystemDbContext _context;

        public ExamService(ExamSystemDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ExamDto>> GetAllExamsAsync()
        {
            var exams = await _context.Exams
                .Include(e => e.CreatedByUser)
                .Include(e => e.Questions)
                    .ThenInclude(q => q.Options)
                .Where(e => e.IsActive)
                .OrderByDescending(e => e.CreatedAt)
                .ToListAsync();

            return exams.Select(MapToExamDto);
        }

        public async Task<ExamDto?> GetExamByIdAsync(int id)
        {
            var exam = await _context.Exams
                .Include(e => e.CreatedByUser)
                .Include(e => e.Questions)
                    .ThenInclude(q => q.Options)
                .FirstOrDefaultAsync(e => e.Id == id);

            return exam != null ? MapToExamDto(exam) : null;
        }

        public async Task<ExamDto> CreateExamAsync(CreateExamDto createExamDto, int createdByUserId)
        {
            var exam = new Exam
            {
                Title = createExamDto.Title,
                Description = createExamDto.Description,
                DurationMinutes = createExamDto.DurationMinutes,
                StartTime = createExamDto.StartTime,
                EndTime = createExamDto.EndTime,
                CreatedByUserId = createdByUserId,
                CreatedAt = DateTime.UtcNow
            };

            _context.Exams.Add(exam);
            await _context.SaveChangesAsync();

            // Add questions
            foreach (var questionDto in createExamDto.Questions)
            {
                var question = new Question
                {
                    Text = questionDto.Text,
                    Type = questionDto.Type,
                    Points = questionDto.Points,
                    Order = questionDto.Order,
                    ExamId = exam.Id,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Questions.Add(question);
                await _context.SaveChangesAsync();

                // Add options
                foreach (var optionDto in questionDto.Options)
                {
                    var option = new QuestionOption
                    {
                        Text = optionDto.Text,
                        IsCorrect = optionDto.IsCorrect,
                        Order = optionDto.Order,
                        QuestionId = question.Id
                    };

                    _context.QuestionOptions.Add(option);
                }
            }

            await _context.SaveChangesAsync();

            return await GetExamByIdAsync(exam.Id) ?? throw new InvalidOperationException("Failed to create exam");
        }

        public async Task<ExamDto?> UpdateExamAsync(int id, UpdateExamDto updateExamDto, int userId)
        {
            var exam = await _context.Exams.FirstOrDefaultAsync(e => e.Id == id && e.CreatedByUserId == userId);
            if (exam == null) return null;

            exam.Title = updateExamDto.Title;
            exam.Description = updateExamDto.Description;
            exam.DurationMinutes = updateExamDto.DurationMinutes;
            exam.StartTime = updateExamDto.StartTime;
            exam.EndTime = updateExamDto.EndTime;
            exam.IsActive = updateExamDto.IsActive;
            exam.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return await GetExamByIdAsync(id);
        }

        public async Task<bool> DeleteExamAsync(int id, int userId)
        {
            var exam = await _context.Exams.FirstOrDefaultAsync(e => e.Id == id && e.CreatedByUserId == userId);
            if (exam == null) return false;

            exam.IsActive = false;
            exam.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<ExamDto>> GetExamsByUserAsync(int userId)
        {
            var exams = await _context.Exams
                .Include(e => e.CreatedByUser)
                .Include(e => e.Questions)
                    .ThenInclude(q => q.Options)
                .Where(e => e.CreatedByUserId == userId)
                .OrderByDescending(e => e.CreatedAt)
                .ToListAsync();

            return exams.Select(MapToExamDto);
        }

        public async Task<ExamDto?> GetExamForStudentAsync(int examId, int userId)
        {
            var exam = await _context.Exams
                .Include(e => e.CreatedByUser)
                .Include(e => e.Questions)
                    .ThenInclude(q => q.Options)
                .FirstOrDefaultAsync(e => e.Id == examId && e.IsActive);

            if (exam == null) return null;

            // Check if exam is available for the student
            var now = DateTime.UtcNow;
            if (now < exam.StartTime || now > exam.EndTime)
                return null;

            return MapToExamDto(exam);
        }

        private static ExamDto MapToExamDto(Exam exam)
        {
            return new ExamDto
            {
                Id = exam.Id,
                Title = exam.Title,
                Description = exam.Description,
                DurationMinutes = exam.DurationMinutes,
                StartTime = exam.StartTime,
                EndTime = exam.EndTime,
                IsActive = exam.IsActive,
                CreatedAt = exam.CreatedAt,
                CreatedByUserId = exam.CreatedByUserId,
                CreatedByUserName = $"{exam.CreatedByUser.FirstName} {exam.CreatedByUser.LastName}",
                Questions = exam.Questions
                    .OrderBy(q => q.Order)
                    .Select(q => new QuestionDto
                    {
                        Id = q.Id,
                        Text = q.Text,
                        Type = q.Type,
                        Points = q.Points,
                        Order = q.Order,
                        Options = q.Options
                            .OrderBy(o => o.Order)
                            .Select(o => new QuestionOptionDto
                            {
                                Id = o.Id,
                                Text = o.Text,
                                IsCorrect = o.IsCorrect,
                                Order = o.Order
                            }).ToList()
                    }).ToList()
            };
        }
    }
}
