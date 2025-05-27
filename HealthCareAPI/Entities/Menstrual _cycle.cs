using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HealthCareAPI 
{
  [Table("Menstrual_cycle")]
    public class ConsMenstrual_cycleultant
    {
        [Key]
        public required int CycleID { get; set; }
        [Required]
        public  int CustomerID { get; set; }
        public DateTime Start_date { get; set; }
        public DateTime End_date { get; set; }
        public required string Reminder_enabled { get; set; }
        public required string Note { get; set; }
        [ForeignKey("CustomerID")]
        public Customer Customer { get; set; } = null!; 
    }
}