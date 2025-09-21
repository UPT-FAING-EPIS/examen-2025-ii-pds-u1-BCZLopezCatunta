using System.ComponentModel.DataAnnotations;

namespace ExamSystem.API.Models
{
    public class ExamAttempt
    {
        public int Id { get; set; }
        
        public DateTime StartedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? CompletedAt { get; set; }
        
        public int? Score { get; set; }
        
        public int? TotalPoints { get; set; }
        
        public string Status { get; set; } = "InProgress"; // "InProgress", "Completed", "Abandoned"
        
        // Foreign Keys
        [Required]
        public int UserId { get; set; }
        
        [Required]
        public int ExamId { get; set; }
        
        // Navigation properties
        public virtual User User { get; set; } = null!;
        public virtual Exam Exam { get; set; } = null!;
        public virtual ICollection<Answer> Answers { get; set; } = new List<Answer>();
    }
}
