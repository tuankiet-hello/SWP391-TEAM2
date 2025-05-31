using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HealthCareAPI.Entities
{
    [Table("Feedback")]
    public class Feedback
    {
        [Key]
        public int FeedbackID { get; set; }

        public Guid AccountID { get; set; }  // FK đến Account.Id

        [Column(TypeName = "nvarchar(100)")]
        public string? Comment { get; set; }

        public int Rating { get; set; }

        public DateTime CreateAt { get; set; }

        [ForeignKey(nameof(AccountID))]
        public Account Account { get; set; } = null!;
    }
}