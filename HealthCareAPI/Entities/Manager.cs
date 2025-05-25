using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HealthCareAPI 
{
  [Table("Manager")]
    public class Manager
    {
        [Key]
        [Required]
        public required string ManagerID { get; set; }
        [Required]
        public required string AccountID { get; set; }
        [Required]
        public required string FullName { get; set; }
        public required string Degree { get; set; }


    }
}