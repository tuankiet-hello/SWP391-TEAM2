using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HealthCareAPI 
{
  [Table("Admin")]
    public class Admin
    {
        [Key]
        [Required]
        public required string AdminID { get; set; }
        [Required]
        public required string AccountID { get; set; }
        [Required]
        public required string FullName { get; set; }
  


    }
}