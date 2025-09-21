using System.ComponentModel.DataAnnotations;

namespace ExamSystem.API.Models
{
    public class Answer
    {
        public int Id { get; set; }
        
        [StringLength(1000)]
        public string? TextAnswer { get; set; }
        
        public int? SelectedOptionId { get; set; }
        
        public bool? BooleanAnswer { get; set; }
        
        public int PointsEarned { get; set; } = 0;
        
        public DateTime AnsweredAt { get; set; } = DateTime.UtcNow;
        
        // Foreign Keys
        [Required]
        public int ExamAttemptId { get; set; }
        
        [Required]
        public int QuestionId { get; set; }
        
        // Navigation properties
        public virtual ExamAttempt ExamAttempt { get; set; } = null!;
        public virtual Question Question { get; set; } = null!;
        public virtual QuestionOption? SelectedOption { get; set; }
    }
}
