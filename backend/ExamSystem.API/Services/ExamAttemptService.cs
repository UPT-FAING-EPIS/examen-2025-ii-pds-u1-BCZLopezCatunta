using Microsoft.EntityFrameworkCore;
using ExamSystem.API.Data;
using ExamSystem.API.Models;
using ExamSystem.API.Models.DTOs;

namespace ExamSystem.API.Services
{
    public class ExamAttemptService : IExamAttemptService
    {
        private readonly ExamSystemDbContext _context;

        public ExamAttemptService(ExamSystemDbContext context)
        {
            _context = context;
        }

        public async Task<ExamAttemptDto?> StartExamAttemptAsync(StartExamAttemptDto startExamAttemptDto, int userId)
        {
            // Check if exam exists and is available
            var exam = await _context.Exams
                .Include(e => e.Questions)
                .FirstOrDefaultAsync(e => e.Id == startExamAttemptDto.ExamId && e.IsActive);

            if (exam == null) return null;

            var now = DateTime.UtcNow;
            if (now < exam.StartTime || now > exam.EndTime)
                return null;

            // Check if user already has an active attempt
            var existingAttempt = await _context.ExamAttempts
                .FirstOrDefaultAsync(ea => ea.UserId == userId && ea.ExamId == startExamAttemptDto.ExamId && ea.Status == "InProgress");

            if (existingAttempt != null)
                return await GetExamAttemptAsync(existingAttempt.Id, userId);

            // Create new attempt
            var attempt = new ExamAttempt
            {
                UserId = userId,
                ExamId = startExamAttemptDto.ExamId,
                StartedAt = now,
                Status = "InProgress",
                TotalPoints = exam.Questions.Sum(q => q.Points)
            };

            _context.ExamAttempts.Add(attempt);
            await _context.SaveChangesAsync();

            return await GetExamAttemptAsync(attempt.Id, userId);
        }

        public async Task<ExamAttemptDto?> GetExamAttemptAsync(int attemptId, int userId)
        {
            var attempt = await _context.ExamAttempts
                .Include(ea => ea.User)
                .Include(ea => ea.Exam)
                .Include(ea => ea.Answers)
                    .ThenInclude(a => a.Question)
                .Include(ea => ea.Answers)
                    .ThenInclude(a => a.SelectedOption)
                .FirstOrDefaultAsync(ea => ea.Id == attemptId && ea.UserId == userId);

            return attempt != null ? MapToExamAttemptDto(attempt) : null;
        }

        public async Task<ExamAttemptDto?> SubmitAnswerAsync(int attemptId, SubmitAnswerDto submitAnswerDto, int userId)
        {
            var attempt = await _context.ExamAttempts
                .Include(ea => ea.Exam)
                .FirstOrDefaultAsync(ea => ea.Id == attemptId && ea.UserId == userId && ea.Status == "InProgress");

            if (attempt == null) return null;

            // Check if exam is still available
            var now = DateTime.UtcNow;
            if (now > attempt.Exam.EndTime)
                return null;

            // Check if question exists in this exam
            var question = await _context.Questions
                .Include(q => q.Options)
                .FirstOrDefaultAsync(q => q.Id == submitAnswerDto.QuestionId && q.ExamId == attempt.ExamId);

            if (question == null) return null;

            // Find existing answer or create new one
            var existingAnswer = await _context.Answers
                .FirstOrDefaultAsync(a => a.ExamAttemptId == attemptId && a.QuestionId == submitAnswerDto.QuestionId);

            if (existingAnswer != null)
            {
                // Update existing answer
                existingAnswer.TextAnswer = submitAnswerDto.TextAnswer;
                existingAnswer.SelectedOptionId = submitAnswerDto.SelectedOptionId;
                existingAnswer.BooleanAnswer = submitAnswerDto.BooleanAnswer;
                existingAnswer.AnsweredAt = now;
            }
            else
            {
                // Create new answer
                var answer = new Answer
                {
                    ExamAttemptId = attemptId,
                    QuestionId = submitAnswerDto.QuestionId,
                    TextAnswer = submitAnswerDto.TextAnswer,
                    SelectedOptionId = submitAnswerDto.SelectedOptionId,
                    BooleanAnswer = submitAnswerDto.BooleanAnswer,
                    AnsweredAt = now
                };

                _context.Answers.Add(answer);
            }

            await _context.SaveChangesAsync();
            return await GetExamAttemptAsync(attemptId, userId);
        }

        public async Task<ExamAttemptDto?> CompleteExamAttemptAsync(int attemptId, int userId)
        {
            var attempt = await _context.ExamAttempts
                .Include(ea => ea.Answers)
                    .ThenInclude(a => a.Question)
                .Include(ea => ea.Answers)
                    .ThenInclude(a => a.SelectedOption)
                .FirstOrDefaultAsync(ea => ea.Id == attemptId && ea.UserId == userId && ea.Status == "InProgress");

            if (attempt == null) return null;

            // Calculate score
            var totalScore = 0;
            foreach (var answer in attempt.Answers)
            {
                var pointsEarned = CalculateAnswerScore(answer);
                answer.PointsEarned = pointsEarned;
                totalScore += pointsEarned;
            }

            attempt.Score = totalScore;
            attempt.CompletedAt = DateTime.UtcNow;
            attempt.Status = "Completed";

            await _context.SaveChangesAsync();
            return await GetExamAttemptAsync(attemptId, userId);
        }

        public async Task<IEnumerable<ExamAttemptDto>> GetUserExamAttemptsAsync(int userId)
        {
            var attempts = await _context.ExamAttempts
                .Include(ea => ea.User)
                .Include(ea => ea.Exam)
                .Include(ea => ea.Answers)
                .Where(ea => ea.UserId == userId)
                .OrderByDescending(ea => ea.StartedAt)
                .ToListAsync();

            return attempts.Select(MapToExamAttemptDto);
        }

        public async Task<IEnumerable<ExamAttemptDto>> GetExamResultsAsync(int examId, int teacherUserId)
        {
            // Verify that the teacher created this exam
            var exam = await _context.Exams
                .FirstOrDefaultAsync(e => e.Id == examId && e.CreatedByUserId == teacherUserId);

            if (exam == null) return new List<ExamAttemptDto>();

            var attempts = await _context.ExamAttempts
                .Include(ea => ea.User)
                .Include(ea => ea.Exam)
                .Include(ea => ea.Answers)
                    .ThenInclude(a => a.Question)
                .Include(ea => ea.Answers)
                    .ThenInclude(a => a.SelectedOption)
                .Where(ea => ea.ExamId == examId)
                .OrderByDescending(ea => ea.StartedAt)
                .ToListAsync();

            return attempts.Select(MapToExamAttemptDto);
        }

        private static int CalculateAnswerScore(Answer answer)
        {
            if (answer.Question.Type == "MultipleChoice")
            {
                if (answer.SelectedOption?.IsCorrect == true)
                    return answer.Question.Points;
            }
            else if (answer.Question.Type == "TrueFalse")
            {
                if (answer.BooleanAnswer.HasValue)
                {
                    var correctAnswer = answer.Question.Options.FirstOrDefault(o => o.IsCorrect);
                    if (correctAnswer != null && answer.BooleanAnswer == correctAnswer.Text.ToLower().Contains("true"))
                        return answer.Question.Points;
                }
            }
            else if (answer.Question.Type == "Text")
            {
                // For text answers, you might want to implement manual grading
                // For now, we'll return 0 and let teachers grade manually
                return 0;
            }

            return 0;
        }

        private static ExamAttemptDto MapToExamAttemptDto(ExamAttempt attempt)
        {
            return new ExamAttemptDto
            {
                Id = attempt.Id,
                StartedAt = attempt.StartedAt,
                CompletedAt = attempt.CompletedAt,
                Score = attempt.Score,
                TotalPoints = attempt.TotalPoints,
                Status = attempt.Status,
                UserId = attempt.UserId,
                UserName = $"{attempt.User.FirstName} {attempt.User.LastName}",
                ExamId = attempt.ExamId,
                ExamTitle = attempt.Exam.Title,
                Answers = attempt.Answers.Select(a => new AnswerDto
                {
                    Id = a.Id,
                    TextAnswer = a.TextAnswer,
                    SelectedOptionId = a.SelectedOptionId,
                    BooleanAnswer = a.BooleanAnswer,
                    PointsEarned = a.PointsEarned,
                    AnsweredAt = a.AnsweredAt,
                    QuestionId = a.QuestionId,
                    QuestionText = a.Question.Text,
                    SelectedOptionText = a.SelectedOption?.Text
                }).ToList()
            };
        }
    }
}
