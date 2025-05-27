using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HealthCareAPI 
{
  [Table("Admin")]
    public class Admin
    {
        [Key]
        public int  AdminID { get; set; }
        [Required]
        public required int AccountID { get; set;}
        [ForeignKey("AccountID")]
        public Account? Account { get; set; }
        [Required]
        public required string FullName { get; set; }
  


    }
}