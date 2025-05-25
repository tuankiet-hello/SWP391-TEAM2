using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HealthCareAPI 
{
  [Table("Account")]
    public class Account
    {
        [Required]
        [StringLength(5)]
        public required string AccountID { get; set; }
        [Required]
        [StringLength(5)]
        
        public required string Username { get; set; }
        public required string Password { get; set; }
        public required string Role { get; set; }
        public required string CreateAt { get; set; }

    }
}