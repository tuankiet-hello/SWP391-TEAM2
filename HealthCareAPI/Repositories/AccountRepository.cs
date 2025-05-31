using HealthCareAPI.Entities;
using HealthCareAPI;

namespace HealthCareAPI.Repositories
{
    public class AccountRepository : GenericRepository<Account>, IAccountRepository
    {
        public AccountRepository(ApplicationDbContext context) : base(context)
        {
        }
        // Thêm các method đặc thù cho Account nếu cần
    }
} 