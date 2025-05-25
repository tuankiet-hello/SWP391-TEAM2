using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HealthCareAPI 
{
  [Table("Menstrual_cycle")]
    public class ConsMenstrual_cycleultant
    {
        [Key]
        public required string CycleID { get; set; }
        public required string CustomerID { get; set; }
        public required string Start_date { get; set; }
        public required string End_date { get; set; }
        public required string Reminder_enabled { get; set; }
        public required string Note { get; set; }

    }
}