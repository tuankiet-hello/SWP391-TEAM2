using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using HealthCareAPI.Enum;

namespace HealthCareAPI.Entities
{
    [Table("Appoinment")]
    public class Appoinment
    {
        [Key]
        public int AppointmentID { get; set; }

        public Guid AccountID { get; set; } // FK đến Account.Id

        [Column("Appointment Date", TypeName = "date")]
        public DateOnly AppointmentDate { get; set; }
        //"yyyy-MM-dd"

        [Column("Appointment Time", TypeName = "time")]
        public TimeOnly AppointmentTime { get; set; }
        //"HH:mm:ss.fffffff"
        public StatusType Status { get; set; }

        [ForeignKey(nameof(AccountID))]
        public Account Account { get; set; } = null!;
    }
}