using System.ComponentModel.DataAnnotations;

namespace ExamSystem.API.Models
{
    public class Question
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(1000)]
        public string Text { get; set; } = string.Empty;
        
        [Required]
        [StringLength(50)]
        public string Type { get; set; } = string.Empty; // "MultipleChoice", "TrueFalse", "Text"
        
        public int Points { get; set; } = 1;
        
        public int Order { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? UpdatedAt { get; set; }
        
        // Foreign Keys
        [Required]
        public int ExamId { get; set; }
        
        // Navigation properties
        public virtual Exam Exam { get; set; } = null!;
        public virtual ICollection<QuestionOption> Options { get; set; } = new List<QuestionOption>();
        public virtual ICollection<Answer> Answers { get; set; } = new List<Answer>();
    }
}
