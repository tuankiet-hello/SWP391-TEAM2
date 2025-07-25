using HealthCareAPI.Entities;

namespace HealthCareAPI.Repositories
{
    public interface ITestBookingRepository : IGenericRepository<TestBooking>
    {
        // Thêm các method đặc thù cho TestBooking nếu cần
        Task<IEnumerable<TestBooking>> GetAllWithIncludesAsync();
        Task<TestBooking> GetByIdWithIncludesAsync(int id);

        Task<IEnumerable<TestBooking>> GetHistoryWithIncludesAsync(Guid accountId);
    }
} 