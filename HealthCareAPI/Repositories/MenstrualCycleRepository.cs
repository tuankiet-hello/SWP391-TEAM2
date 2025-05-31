using HealthCareAPI.Entities;
using HealthCareAPI;

namespace HealthCareAPI.Repositories
{
    public class MenstrualCycleRepository : GenericRepository<MenstrualCycle>, IMenstrualCycleRepository
    {
        public MenstrualCycleRepository(ApplicationDbContext context) : base(context)
        {
        }
        // Thêm các method đặc thù cho MenstrualCycle nếu cần
    }
} 