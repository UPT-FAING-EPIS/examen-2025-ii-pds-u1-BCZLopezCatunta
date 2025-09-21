using Microsoft.AspNetCore.Mvc;
using ExamSystem.API.Models.DTOs;
using ExamSystem.API.Services;

namespace ExamSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExamAttemptsController : ControllerBase
    {
        private readonly IExamAttemptService _examAttemptService;

        public ExamAttemptsController(IExamAttemptService examAttemptService)
        {
            _examAttemptService = examAttemptService;
        }

        [HttpPost("start")]
        public async Task<ActionResult<ExamAttemptDto>> StartExamAttempt(StartExamAttemptDto startExamAttemptDto)
        {
            // TODO: Get user ID from authentication
            var userId = 2; // Temporary hardcoded for development

            var attempt = await _examAttemptService.StartExamAttemptAsync(startExamAttemptDto, userId);
            if (attempt == null)
                return BadRequest("Cannot start exam attempt");

            return Ok(attempt);
        }

        [HttpGet("{attemptId}")]
        public async Task<ActionResult<ExamAttemptDto>> GetExamAttempt(int attemptId)
        {
            // TODO: Get user ID from authentication
            var userId = 2; // Temporary hardcoded for development

            var attempt = await _examAttemptService.GetExamAttemptAsync(attemptId, userId);
            if (attempt == null)
                return NotFound();

            return Ok(attempt);
        }

        [HttpPost("{attemptId}/answer")]
        public async Task<ActionResult<ExamAttemptDto>> SubmitAnswer(int attemptId, SubmitAnswerDto submitAnswerDto)
        {
            // TODO: Get user ID from authentication
            var userId = 2; // Temporary hardcoded for development

            var attempt = await _examAttemptService.SubmitAnswerAsync(attemptId, submitAnswerDto, userId);
            if (attempt == null)
                return BadRequest("Cannot submit answer");

            return Ok(attempt);
        }

        [HttpPost("{attemptId}/complete")]
        public async Task<ActionResult<ExamAttemptDto>> CompleteExamAttempt(int attemptId)
        {
            // TODO: Get user ID from authentication
            var userId = 2; // Temporary hardcoded for development

            var attempt = await _examAttemptService.CompleteExamAttemptAsync(attemptId, userId);
            if (attempt == null)
                return BadRequest("Cannot complete exam attempt");

            return Ok(attempt);
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<ExamAttemptDto>>> GetUserExamAttempts(int userId)
        {
            var attempts = await _examAttemptService.GetUserExamAttemptsAsync(userId);
            return Ok(attempts);
        }

        [HttpGet("exam/{examId}/results")]
        public async Task<ActionResult<IEnumerable<ExamAttemptDto>>> GetExamResults(int examId)
        {
            // TODO: Get user ID from authentication
            var teacherUserId = 1; // Temporary hardcoded for development

            var results = await _examAttemptService.GetExamResultsAsync(examId, teacherUserId);
            return Ok(results);
        }
    }
}
