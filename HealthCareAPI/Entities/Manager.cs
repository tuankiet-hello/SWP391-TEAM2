using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HealthCareAPI.Entities
{
  [Table("Manager")]
    public class Manager
    {
        [Key]
        public  int ManagerID { get; set; }
        [Required]
        public  int AccountID { get; set; }
        [Required]
        [Column(TypeName = "nvarchar(50)")]
        public required string FullName { get; set; }
        [Column(TypeName = "nvarchar(50)")]
        public required string Degree { get; set; }
        [ForeignKey("AccountID")]   
        public Account Account { get; set; } = null!;   

    }
}