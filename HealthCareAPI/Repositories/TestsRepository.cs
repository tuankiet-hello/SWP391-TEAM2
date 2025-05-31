using HealthCareAPI.Entities;
using HealthCareAPI;

namespace HealthCareAPI.Repositories
{
    public class TestsRepository : GenericRepository<Test>, ITestsRepository
    {
        public TestsRepository(ApplicationDbContext context) : base(context)
        {
        }
        // Thêm các method đặc thù cho Tests nếu cần
    }
} 