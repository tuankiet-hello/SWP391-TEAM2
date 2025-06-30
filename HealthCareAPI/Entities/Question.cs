using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using HealthCareAPI.Enum;

namespace HealthCareAPI.Entities
{
    public class Question
    {
        [Key]
        public int QuestionID { get; set; }
        
        public Guid AccountID { get; set; }

        public string Title { get; set; }

        [Required]
        public string Content { get; set; }

        public StatusType Status { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        [ForeignKey(nameof(AccountID))]
        public Account Account { get; set; } = null!;
    }
}
