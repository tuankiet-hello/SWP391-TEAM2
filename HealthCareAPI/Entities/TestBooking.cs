using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HealthCareAPI 
{
  [Table("TestBooking")]
    public class TestBooking
    {
        public required string Result { get; set; }
        public required string BookingID { get; set; }
        public required string BookingTime { get; set; }
        public required string Status { get; set; }

    }
}