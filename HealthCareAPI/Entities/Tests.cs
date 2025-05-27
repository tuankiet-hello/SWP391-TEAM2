using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HealthCareAPI 
{
  [Table("Tests")]
    public class Test
    {
        [Key]
        public int TestID { get; set; }
        public required string TestName { get; set; }
        public required string Price { get; set; }
        public required string Description { get; set; }
        public required string Active { get; set; }


    }
}