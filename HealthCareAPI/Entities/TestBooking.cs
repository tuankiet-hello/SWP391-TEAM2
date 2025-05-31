using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using HealthCareAPI.Enum;

namespace HealthCareAPI.Entities
{
    [Table("TestBooking")]
    public class TestBooking
    {
        [Key]
        public int BookingID { get; set; }

        public Guid AccountID { get; set; }  // Đổi sang Guid

        public int TestID { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public required string Result { get; set; }

        public DateOnly BookingDate { get; set; }

        public TimeOnly BookingTime { get; set; }

        public StatusType Status { get; set; }

        [ForeignKey(nameof(AccountID))]
        public Account Account { get; set; } = null!;

        [ForeignKey(nameof(TestID))]
        public Test Test { get; set; } = null!;
    }
}
