using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HealthCareAPI.Entities
{
    [Table("Menstrual_cycle")]
    public class Menstrual_cycle
    {
        [Key]
        public required int CycleID { get; set; }
        [Required]
        public int CustomerID { get; set; }
        public DateTime Start_date { get; set; }
        public DateTime End_date { get; set; }
        public required bool Reminder_enabled { get; set; }
        [Column(TypeName = "nvarchar(100)")]
        public string Note { get; set; } = "";
        [ForeignKey("CustomerID")]
        public Customer Customer { get; set; } = null!; 
    }
} 