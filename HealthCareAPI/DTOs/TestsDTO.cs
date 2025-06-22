using HealthCareAPI.Enum;

namespace HealthCareAPI.DTOs
{
    public class TestsDTO
    {
        //public int TestID { get; set; }
        public string TestName { get; set; }
        public decimal Price { get; set; }
        public string? Description { get; set; }
        public bool Active { get; set; }
    }
} 