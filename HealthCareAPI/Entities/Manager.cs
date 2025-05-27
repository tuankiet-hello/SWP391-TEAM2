using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HealthCareAPI 
{
  [Table("Manager")]
    public class Manager
    {
        [Key]
        public  int ManagerID { get; set; }
        [Required]
        public  int AccountID { get; set; }
        [Required]
        public required string FullName { get; set; }
        public required string Degree { get; set; }
        [ForeignKey("AccountID")]   
        public Account Account { get; set; } = null!;   

    }
}