using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HealthCareAPI 
{
  [Table("Appoinment")]
    public class Appoinment
    {
        [Key]
        public required string AppoinmentID { get; set; }
        public required string AppoinmentTime { get; set; }
        public required string Status { get; set; }


    }
}