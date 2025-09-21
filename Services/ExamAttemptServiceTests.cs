using Microsoft.EntityFrameworkCore;
using ExamSystem.API.Data;
using ExamSystem.API.Models;
using ExamSystem.API.Models.DTOs;
using ExamSystem.API.Services;

namespace ExamSystem.API.Tests.Services
{
    public class ExamAttemptServiceTests : IDisposable
    {
        private readonly ExamSystemDbContext _context;
        private readonly ExamAttemptService _examAttemptService;

        public ExamAttemptServiceTests()
        {
            var options = new DbContextOptionsBuilder<ExamSystemDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new ExamSystemDbContext(options);
            _examAttemptService = new ExamAttemptService(_context);
        }

        [Fact]
        public async Task StartExamAttemptAsync_ShouldCreateNewAttempt()
        {
            // Arrange
            var exam = new Exam
            {
                Title = "Test Exam",
                Description = "Test Description",
                DurationMinutes = 60,
                StartTime = DateTime.UtcNow.AddHours(-1),
                EndTime = DateTime.UtcNow.AddHours(1),
                CreatedByUserId = 1,
                IsActive = true
            };

            _context.Exams.Add(exam);
            await _context.SaveChangesAsync();

            var startDto = new StartExamAttemptDto { ExamId = exam.Id };

            // Act
            var result = await _examAttemptService.StartExamAttemptAsync(startDto, 2);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.UserId);
            Assert.Equal(exam.Id, result.ExamId);
            Assert.Equal("InProgress", result.Status);
        }

        [Fact]
        public async Task StartExamAttemptAsync_ShouldReturnNullForInactiveExam()
        {
            // Arrange
            var exam = new Exam
            {
                Title = "Test Exam",
                Description = "Test Description",
                DurationMinutes = 60,
                StartTime = DateTime.UtcNow.AddHours(-2),
                EndTime = DateTime.UtcNow.AddHours(-1), // Exam has ended
                CreatedByUserId = 1,
                IsActive = true
            };

            _context.Exams.Add(exam);
            await _context.SaveChangesAsync();

            var startDto = new StartExamAttemptDto { ExamId = exam.Id };

            // Act
            var result = await _examAttemptService.StartExamAttemptAsync(startDto, 2);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task SubmitAnswerAsync_ShouldCreateAnswer()
        {
            // Arrange
            var exam = new Exam
            {
                Title = "Test Exam",
                Description = "Test Description",
                DurationMinutes = 60,
                StartTime = DateTime.UtcNow.AddHours(-1),
                EndTime = DateTime.UtcNow.AddHours(1),
                CreatedByUserId = 1,
                IsActive = true
            };

            var question = new Question
            {
                Text = "What is 2+2?",
                Type = "MultipleChoice",
                Points = 5,
                Order = 1,
                ExamId = exam.Id
            };

            var option = new QuestionOption
            {
                Text = "4",
                IsCorrect = true,
                Order = 1,
                QuestionId = question.Id
            };

            var attempt = new ExamAttempt
            {
                UserId = 2,
                ExamId = exam.Id,
                StartedAt = DateTime.UtcNow,
                Status = "InProgress",
                TotalPoints = 5
            };

            _context.Exams.Add(exam);
            _context.Questions.Add(question);
            _context.QuestionOptions.Add(option);
            _context.ExamAttempts.Add(attempt);
            await _context.SaveChangesAsync();

            var submitDto = new SubmitAnswerDto
            {
                QuestionId = question.Id,
                SelectedOptionId = option.Id
            };

            // Act
            var result = await _examAttemptService.SubmitAnswerAsync(attempt.Id, submitDto, 2);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(1, result.Answers.Count);
            Assert.Equal(option.Id, result.Answers[0].SelectedOptionId);
        }

        [Fact]
        public async Task CompleteExamAttemptAsync_ShouldCalculateScore()
        {
            // Arrange
            var exam = new Exam
            {
                Title = "Test Exam",
                Description = "Test Description",
                DurationMinutes = 60,
                StartTime = DateTime.UtcNow.AddHours(-1),
                EndTime = DateTime.UtcNow.AddHours(1),
                CreatedByUserId = 1,
                IsActive = true
            };

            var question = new Question
            {
                Text = "What is 2+2?",
                Type = "MultipleChoice",
                Points = 5,
                Order = 1,
                ExamId = exam.Id
            };

            var correctOption = new QuestionOption
            {
                Text = "4",
                IsCorrect = true,
                Order = 1,
                QuestionId = question.Id
            };

            var attempt = new ExamAttempt
            {
                UserId = 2,
                ExamId = exam.Id,
                StartedAt = DateTime.UtcNow,
                Status = "InProgress",
                TotalPoints = 5
            };

            var answer = new Answer
            {
                ExamAttemptId = attempt.Id,
                QuestionId = question.Id,
                SelectedOptionId = correctOption.Id,
                AnsweredAt = DateTime.UtcNow
            };

            _context.Exams.Add(exam);
            _context.Questions.Add(question);
            _context.QuestionOptions.Add(correctOption);
            _context.ExamAttempts.Add(attempt);
            _context.Answers.Add(answer);
            await _context.SaveChangesAsync();

            // Act
            var result = await _examAttemptService.CompleteExamAttemptAsync(attempt.Id, 2);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Completed", result.Status);
            Assert.NotNull(result.CompletedAt);
            Assert.Equal(5, result.Score);
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
