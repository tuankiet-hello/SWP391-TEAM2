using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HealthCareAPI 
{
  [Table("TestBooking")]
    public class TestBooking
    {
        [Key]
        public  int BookingID { get; set; }
        public int CustomerID { get; set; };
        public int TestID { get; set; };
        public required string Result { get; set; }
        
        public DateTime BookingTime { get; set; }
        public required string Status { get; set; }
        [ForeignKey(nameof(CustomerID))]
        public Customer Customer { get; set; } = null!;
        [ForeignKey(nameof(TestID))]
        public Test Test { get; set; } = null!; 

    }
}