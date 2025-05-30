using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HealthCareAPI.Entities
{
    [Table("Feedback")]
    public class Feedback
    {
        [Key]
        public int FeedbackID { get; set; }

        public Guid ConsultantID { get; set; }  // FK đến Account.Id
        public Guid CustomerID { get; set; }    // FK đến Account.Id

        [Column(TypeName = "nvarchar(100)")]
        public string? Comment { get; set; }

        public int Rating { get; set; }

        public DateTime CreateAt { get; set; }

        [ForeignKey(nameof(ConsultantID))]
        public Account Consultant { get; set; } = null!;

        [ForeignKey(nameof(CustomerID))]
        public Account Customer { get; set; } = null!;
    }
}