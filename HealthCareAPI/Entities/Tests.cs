using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using HealthCareAPI.Enum;

namespace HealthCareAPI.Entities
{
    [Table("Tests")]
    public class Test
    {
        [Key]
        public int TestID { get; set; }

        [Required]
        [Column(TypeName = "nvarchar(50)")]
        public string TestName { get; set; } = null!;

        public double Price { get; set; }

        [Column(TypeName = "nvarchar(200)")]
        public string? Description { get; set;}

        public ActivityTest Active { get; set; }
    }
}
