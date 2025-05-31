using HealthCareAPI.Entities;
using HealthCareAPI;

namespace HealthCareAPI.Repositories
{
    public class TestBookingRepository : GenericRepository<TestBooking>, ITestBookingRepository
    {
        public TestBookingRepository(ApplicationDbContext context) : base(context)
        {
        }
        // Thêm các method đặc thù cho TestBooking nếu cần
    }
} 