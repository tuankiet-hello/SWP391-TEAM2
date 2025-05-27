using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HealthCareAPI.Entities
{
    [Table("Account")]
    public class Account
    {
        [Key]
        public int AccountID { get; set; }
        [Required]
        [MaxLength(50)]
        [Column(TypeName = "varchar(50)")]
        public required string Username { get; set; }
        [Required]
        [MaxLength(50)]
        [Column(TypeName = "varchar(50)")]
        public required string Password { get; set; }
        [Required]
        [Column(TypeName = "nvarchar(20)")]
        public required string Role { get; set; }
    }
}