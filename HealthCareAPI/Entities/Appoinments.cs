using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HealthCareAPI.Entities
{
    [Table("Appoinment")]
    public class Appoinment
    {

        [Key]
        public int AppointmentID { get; set; }

        public Guid ConsultantId { get; set; } // FK đến Account.Id
        public Guid CustomerId { get; set; }   // FK đến Account.Id

        [Column("Appointment Date", TypeName = "date")]
        public DateOnly AppointmentDate { get; set; }
        //"yyyy-MM-dd"

        [Column("Appointment Time", TypeName = "time")]
        public TimeOnly AppointmentTime { get; set; }
        //"HH:mm:ss.fffffff"
        public bool Status { get; set; }

        [ForeignKey(nameof(ConsultantId))]
        public Account Consultant { get; set; } = null!;

        [ForeignKey(nameof(CustomerId))]
        public Account Customer { get; set; } = null!;
    }
}