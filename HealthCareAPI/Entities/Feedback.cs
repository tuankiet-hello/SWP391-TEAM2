using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HealthCareAPI.Entities
{
    [Table("Feedback")]
    public class Feedback
    {
        [Key]
        public int FeedbackID { get; set; }
        public int ConsultantID { get; set; }
        public int CustomerID { get; set; }
        [Column(TypeName = "nvarchar(100)")]
        public string Comment { get; set; } = "";
        public int Rating { get; set; }
        public required DateTime CreateAt { get; set; }

        [ForeignKey("ConsultantID")]
        public Consultant Consultant { get; set; } = null!;

        [ForeignKey("CustomerID")]
        public Customer Customer { get; set; } = null!;
    }
}