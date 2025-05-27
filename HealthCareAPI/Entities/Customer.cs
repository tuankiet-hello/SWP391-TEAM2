using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HealthCareAPI.Entities
{
    [Table("Customer")]
    public class Customer
    {
        [Key]
        public int CustomerID { get; set; }
        public required int AccountID { get; set; }
        [Column(TypeName = "nvarchar(50)")]
        public required string FullName { get; set; }
        public required bool Gender { get; set; }
        public required string Date_of_Birth { get; set; }
        [ForeignKey("AccountID")]
        public Account Account { get; set; } = null!;
        public ICollection<Appoinment> Appoinments { get; set; } = new List<Appoinment>();
        public ICollection<Feedback> Feedbacks { get; set; } = new List<Feedback>();
    }
}