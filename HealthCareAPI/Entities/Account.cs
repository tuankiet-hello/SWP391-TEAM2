using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HealthCareAPI 
{
  [Table("Account")]
    public class Account
    {
        [Key]
        public int AccountID { get; set; }
        [Required]
        [StringLength(50)]
        [Column( TypeName = "varchar")]
        public string Username { get; set; } = "";
        [Required]
        [Column(TypeName = "varchar")]
        [StringLength(50)]
        public string Password { get; set; } ="";
        [Required]
        [Column(TypeName = "varchar")]
        public string Role { get; set; } = "";

    }
}