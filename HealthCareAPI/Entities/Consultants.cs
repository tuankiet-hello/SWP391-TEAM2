using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HealthCareAPI.Entities
{
    [Table("Consultants")]
    public class Consultant
    {
        [Key]
        public int ConsultantID { get; set; }
        public int AccountID { get; set; }
        [Column(TypeName = "nvarchar(50)")]
        public required string FullName { get; set; }
        [Column(TypeName = "nvarchar(50)")]
        public required string Degree { get; set; }
        [Column(TypeName = "nvarchar(50)")]
        public required string Experience { get; set; }
        [Column(TypeName = "nvarchar(50)")]
        public required string Consulting_schedule { get; set; }
        [ForeignKey("AccountID")]
        public Account Account { get; set; } = null!;
        public ICollection<Appoinment> Appoinments { get; set; } = new List<Appoinment>();
        public ICollection<Feedback> Feedbacks { get; set; } = new List<Feedback>();
    }
}