using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HealthCareAPI.Entities
{
    [Table("Appoinment")]
    public class Appoinment
    {
        [Key]
        public int AppointmentID { get; set; }

        [Required]
        public int ConsultantID { get; set; }

        [Required]
        public int CustomerID { get; set; }

        public DateTime AppointmentTime { get; set; }

        public bool Status { get; set; }

        [ForeignKey("ConsultantID")]
        public Consultant Consultant { get; set; } = null!;

        [ForeignKey("CustomerID")]
        public Customer Customer { get; set; } = null!;
    }
}