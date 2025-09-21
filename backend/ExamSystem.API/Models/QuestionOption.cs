using System.ComponentModel.DataAnnotations;

namespace ExamSystem.API.Models
{
    public class QuestionOption
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(500)]
        public string Text { get; set; } = string.Empty;
        
        public bool IsCorrect { get; set; } = false;
        
        public int Order { get; set; }
        
        // Foreign Keys
        [Required]
        public int QuestionId { get; set; }
        
        // Navigation properties
        public virtual Question Question { get; set; } = null!;
    }
}
