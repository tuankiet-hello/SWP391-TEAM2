using HealthCareAPI.Entities;
using HealthCareAPI;

namespace HealthCareAPI.Repositories
{
    public class FeedbackRepository : GenericRepository<Feedback>, IFeedbackRepository
    {
        public FeedbackRepository(ApplicationDbContext context) : base(context)
        {
        }
        // Thêm các method đặc thù cho Feedback nếu cần
    }
} 