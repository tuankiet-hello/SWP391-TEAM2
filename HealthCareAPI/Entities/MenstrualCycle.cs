using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using HealthCareAPI.Enum;

namespace HealthCareAPI.Entities
{
    [Table("Menstrual_cycle")]
    public class MenstrualCycle
    {
        [Key]
        public int CycleID { get; set; }

        [Required]
        public Guid AccountID { get; set; }   // Account.Id kiểu Guid

        public DateOnly Start_date { get; set; }
        public DateOnly End_date { get; set; }

        [Required]
        public Reminder Reminder_enabled { get; set; }

        [Column(TypeName = "nvarchar(100)")]
        public string? Note { get; set; }

        [ForeignKey(nameof(AccountID))]
        public Account Account { get; set; } = null!;
    }
} 