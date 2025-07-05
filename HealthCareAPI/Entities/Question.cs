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

        [Required]
        [StringLength(200, ErrorMessage = "Title cannot be longer than 200 characters.")]
        public string Title { get; set; }

        [Required]
        [StringLength(5000, ErrorMessage = "Content cannot be longer than 5000 characters.")]
        public string Description { get; set; }

        public StatusType Status { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public string? Answer { get; set; }
        public DateTime? UpdatedAt { get; set; }

        [ForeignKey(nameof(AccountID))]
        public Account Account { get; set; } = null!;
    }
}
