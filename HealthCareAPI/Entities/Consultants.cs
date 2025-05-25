using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HealthCareAPI 
{
  [Table("Consultants")]
    public class Consultant
    {
        [Key]
        public required string ConsultantID { get; set; }
        public required string AccountID { get; set; }
        public required string FullName { get; set; }
        public required string Degree { get; set; }
        public required string Experience { get; set; }
        public required string Consulting_schedule { get; set; }

    }
}