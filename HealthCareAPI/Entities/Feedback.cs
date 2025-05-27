using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HealthCareAPI 
{
  [Table("Feedback")]
    public class Feedback
    {
        [Key]
        [Required]
        public required string FeedbackID { get; set; }
        [Required]
        public int ConsultantID { get; set; }

        [Required]
        public int CustomerID { get; set; }
        [Required]
        public required string Comment { get; set; }
        [Required]
        public required string Rating { get; set; }
        public required string CreateAt { get; set; }
        
        [ForeignKey(nameof(ConsultantID))]
        public Consultant Consultant { get; set; } = null!;

        [ForeignKey(nameof(CustomerID))]
        public Customer Customer { get; set; } = null!;

    }
}