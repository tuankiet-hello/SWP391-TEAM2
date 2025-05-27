using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HealthCareAPI.Entities
{
    [Table("Tests")]
    public class Test
    {
        [Key]
        public int TestID { get; set; }
        [Column(TypeName = "nvarchar(50)")]
        public required string TestName { get; set; }

        public double Price { get; set; }
        [Column(TypeName = "nvarchar(200)")]
        public string Description { get; set; } = "";
        public bool Active { get; set; }
    }
}