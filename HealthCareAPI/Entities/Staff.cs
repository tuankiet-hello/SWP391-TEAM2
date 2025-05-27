using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HealthCareAPI.Entities
{
  [Table("Staff")]
    public class Staff
    {
        [Key]
        public int StaffID { get; set; }
        [Required]
        public required int AccountID { get; set; }
        [Required]
        [Column(TypeName = "nvarchar(50)")]
        public required string FullName { get; set; }
        [Column(TypeName = "nvarchar(50)")]
        public required string Degree { get; set; }
        [ForeignKey("AccountID")]
        public Account Account { get; set; } = null!;   
    }
}