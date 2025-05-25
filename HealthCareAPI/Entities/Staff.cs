using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HealthCareAPI 
{
  [Table("Staff")]
    public class Staff
    {
        [Key]
        [Required]
        public required string StaffID { get; set; }
        [Required]
        public required string AccountID { get; set; }
        [Required]
        public required string FullName { get; set; }
        public required string Degree { get; set; }

    }
}