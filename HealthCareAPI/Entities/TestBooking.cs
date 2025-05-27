using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HealthCareAPI.Entities
{
    [Table("TestBooking")]
    public class TestBooking
    {
        [Key]
        public int BookingID { get; set; }
        public int CustomerID { get; set; }
        public int TestID { get; set; }
        [Column(TypeName = "nvarchar(50)")] 
        public required string Result { get; set; }
        public DateTime BookingTime { get; set; }
        public  bool Status { get; set; } 

        [ForeignKey("CustomerID")]
        public Customer Customer { get; set; } = null!;

        [ForeignKey("TestID")]
        public Test Test { get; set; } = null!;
    }
}