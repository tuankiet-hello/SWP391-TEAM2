using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HealthCareAPI.Entities
{
    [Table("Tests")]
    public class Test
    {
        [Key]
        public int TestID { get; set; }

        [Required]
        [Column(TypeName = "nvarchar(100)")]
        public string TestName { get; set; } = null!;

        public decimal Price { get; set; }

        [Required]
        [Column(TypeName = "nvarchar(200)")]
        public string Description { get; set; } = null!;

        public bool Active { get; set; }
    }
}
