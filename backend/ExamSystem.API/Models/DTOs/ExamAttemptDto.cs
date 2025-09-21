namespace ExamSystem.API.Models.DTOs
{
    public class ExamAttemptDto
    {
        public int Id { get; set; }
        public DateTime StartedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public int? Score { get; set; }
        public int? TotalPoints { get; set; }
        public string Status { get; set; } = string.Empty;
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public int ExamId { get; set; }
        public string ExamTitle { get; set; } = string.Empty;
        public List<AnswerDto> Answers { get; set; } = new List<AnswerDto>();
    }

    public class StartExamAttemptDto
    {
        public int ExamId { get; set; }
    }

    public class SubmitAnswerDto
    {
        public int QuestionId { get; set; }
        public string? TextAnswer { get; set; }
        public int? SelectedOptionId { get; set; }
        public bool? BooleanAnswer { get; set; }
    }

    public class AnswerDto
    {
        public int Id { get; set; }
        public string? TextAnswer { get; set; }
        public int? SelectedOptionId { get; set; }
        public bool? BooleanAnswer { get; set; }
        public int PointsEarned { get; set; }
        public DateTime AnsweredAt { get; set; }
        public int QuestionId { get; set; }
        public string QuestionText { get; set; } = string.Empty;
        public string? SelectedOptionText { get; set; }
    }
}
