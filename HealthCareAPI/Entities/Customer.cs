using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HealthCareAPI 
{
  [Table("Customer")]
    public class Customer
    {
        [Key]
        public required string CustomerID { get; set; }
        public required string AccountID { get; set; }
        public required string FullName { get; set; }
        public required string Gender { get; set; }
        public required string Date_of_Birth { get; set; }

    }
}