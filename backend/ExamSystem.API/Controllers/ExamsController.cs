using Microsoft.AspNetCore.Mvc;
using ExamSystem.API.Models.DTOs;
using ExamSystem.API.Services;

namespace ExamSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExamsController : ControllerBase
    {
        private readonly IExamService _examService;

        public ExamsController(IExamService examService)
        {
            _examService = examService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ExamDto>>> GetExams()
        {
            var exams = await _examService.GetAllExamsAsync();
            return Ok(exams);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ExamDto>> GetExam(int id)
        {
            var exam = await _examService.GetExamByIdAsync(id);
            if (exam == null)
                return NotFound();

            return Ok(exam);
        }

        [HttpPost]
        public async Task<ActionResult<ExamDto>> CreateExam(CreateExamDto createExamDto)
        {
            // TODO: Get user ID from authentication
            var userId = 1; // Temporary hardcoded for development

            var exam = await _examService.CreateExamAsync(createExamDto, userId);
            return CreatedAtAction(nameof(GetExam), new { id = exam.Id }, exam);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateExam(int id, UpdateExamDto updateExamDto)
        {
            // TODO: Get user ID from authentication
            var userId = 1; // Temporary hardcoded for development

            var exam = await _examService.UpdateExamAsync(id, updateExamDto, userId);
            if (exam == null)
                return NotFound();

            return Ok(exam);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExam(int id)
        {
            // TODO: Get user ID from authentication
            var userId = 1; // Temporary hardcoded for development

            var result = await _examService.DeleteExamAsync(id, userId);
            if (!result)
                return NotFound();

            return NoContent();
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<ExamDto>>> GetExamsByUser(int userId)
        {
            var exams = await _examService.GetExamsByUserAsync(userId);
            return Ok(exams);
        }

        [HttpGet("{id}/student")]
        public async Task<ActionResult<ExamDto>> GetExamForStudent(int id)
        {
            // TODO: Get user ID from authentication
            var userId = 2; // Temporary hardcoded for development

            var exam = await _examService.GetExamForStudentAsync(id, userId);
            if (exam == null)
                return NotFound();

            return Ok(exam);
        }
    }
}
