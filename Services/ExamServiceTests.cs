using Microsoft.EntityFrameworkCore;
using ExamSystem.API.Data;
using ExamSystem.API.Models;
using ExamSystem.API.Models.DTOs;
using ExamSystem.API.Services;

namespace ExamSystem.API.Tests.Services
{
    public class ExamServiceTests : IDisposable
    {
        private readonly ExamSystemDbContext _context;
        private readonly ExamService _examService;

        public ExamServiceTests()
        {
            var options = new DbContextOptionsBuilder<ExamSystemDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _context = new ExamSystemDbContext(options);
            _examService = new ExamService(_context);
        }

        [Fact]
        public async Task CreateExamAsync_ShouldCreateExamWithQuestions()
        {
            // Arrange
            var createExamDto = new CreateExamDto
            {
                Title = "Test Exam",
                Description = "Test Description",
                DurationMinutes = 60,
                StartTime = DateTime.UtcNow.AddHours(1),
                EndTime = DateTime.UtcNow.AddHours(2),
                Questions = new List<CreateQuestionDto>
                {
                    new CreateQuestionDto
                    {
                        Text = "What is 2+2?",
                        Type = "MultipleChoice",
                        Points = 5,
                        Order = 1,
                        Options = new List<CreateQuestionOptionDto>
                        {
                            new CreateQuestionOptionDto { Text = "3", IsCorrect = false, Order = 1 },
                            new CreateQuestionOptionDto { Text = "4", IsCorrect = true, Order = 2 },
                            new CreateQuestionOptionDto { Text = "5", IsCorrect = false, Order = 3 }
                        }
                    }
                }
            };

            // Act
            var result = await _examService.CreateExamAsync(createExamDto, 1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Test Exam", result.Title);
            Assert.Equal(1, result.Questions.Count);
            Assert.Equal("What is 2+2?", result.Questions[0].Text);
            Assert.Equal(3, result.Questions[0].Options.Count);
        }

        [Fact]
        public async Task GetExamByIdAsync_ShouldReturnExam()
        {
            // Arrange
            var exam = new Exam
            {
                Title = "Test Exam",
                Description = "Test Description",
                DurationMinutes = 60,
                StartTime = DateTime.UtcNow.AddHours(1),
                EndTime = DateTime.UtcNow.AddHours(2),
                CreatedByUserId = 1,
                IsActive = true
            };

            _context.Exams.Add(exam);
            await _context.SaveChangesAsync();

            // Act
            var result = await _examService.GetExamByIdAsync(exam.Id);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Test Exam", result.Title);
        }

        [Fact]
        public async Task GetExamByIdAsync_ShouldReturnNullForNonExistentExam()
        {
            // Act
            var result = await _examService.GetExamByIdAsync(999);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task UpdateExamAsync_ShouldUpdateExam()
        {
            // Arrange
            var exam = new Exam
            {
                Title = "Original Title",
                Description = "Original Description",
                DurationMinutes = 60,
                StartTime = DateTime.UtcNow.AddHours(1),
                EndTime = DateTime.UtcNow.AddHours(2),
                CreatedByUserId = 1,
                IsActive = true
            };

            _context.Exams.Add(exam);
            await _context.SaveChangesAsync();

            var updateDto = new UpdateExamDto
            {
                Title = "Updated Title",
                Description = "Updated Description",
                DurationMinutes = 90,
                StartTime = DateTime.UtcNow.AddHours(1),
                EndTime = DateTime.UtcNow.AddHours(2),
                IsActive = true
            };

            // Act
            var result = await _examService.UpdateExamAsync(exam.Id, updateDto, 1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Updated Title", result.Title);
            Assert.Equal("Updated Description", result.Description);
            Assert.Equal(90, result.DurationMinutes);
        }

        [Fact]
        public async Task DeleteExamAsync_ShouldDeactivateExam()
        {
            // Arrange
            var exam = new Exam
            {
                Title = "Test Exam",
                Description = "Test Description",
                DurationMinutes = 60,
                StartTime = DateTime.UtcNow.AddHours(1),
                EndTime = DateTime.UtcNow.AddHours(2),
                CreatedByUserId = 1,
                IsActive = true
            };

            _context.Exams.Add(exam);
            await _context.SaveChangesAsync();

            // Act
            var result = await _examService.DeleteExamAsync(exam.Id, 1);

            // Assert
            Assert.True(result);
            var updatedExam = await _context.Exams.FindAsync(exam.Id);
            Assert.False(updatedExam!.IsActive);
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}