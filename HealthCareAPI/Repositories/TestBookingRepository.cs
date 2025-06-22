using HealthCareAPI.Entities;
using HealthCareAPI;
using Microsoft.EntityFrameworkCore;

namespace HealthCareAPI.Repositories
{
    public class TestBookingRepository : GenericRepository<TestBooking>, ITestBookingRepository
    {
        public TestBookingRepository(ApplicationDbContext context) : base(context)
        {
        }
        public async Task<IEnumerable<TestBooking>> GetAllWithIncludesAsync()
        {
            return await _context.TestBookings
                .Include(tb => tb.Account)
                .Include(tb => tb.Test)
                .ToListAsync();
        }
        public async Task<IEnumerable<TestBooking>> GetHistoryWithIncludesAsync(Guid accountId)
        {
            return await _context.TestBookings
                .Where(tb => tb.AccountID == accountId)
                .Include(tb => tb.Test)
                .Include(tb => tb.Account)
                .OrderByDescending(tb => tb.BookingDate)
                .ToListAsync();
        }

        // Thêm các method đặc thù cho TestBooking nếu cần
    }
} 