using HealthCareAPI.Entities;
using HealthCareAPI;

namespace HealthCareAPI.Repositories
{
    public class AppoinmentRepository : GenericRepository<Appoinment>, IAppoinmentRepository
    {
        public AppoinmentRepository(ApplicationDbContext context) : base(context)
        {
        }
        // Thêm các method đặc thù cho Appoinment nếu cần
    }
} 