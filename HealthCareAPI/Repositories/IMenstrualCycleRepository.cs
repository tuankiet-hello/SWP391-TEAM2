using HealthCareAPI.Entities;

namespace HealthCareAPI.Repositories
{
    public interface IMenstrualCycleRepository : IGenericRepository<MenstrualCycle>
    {
        // Thêm các method đặc thù cho MenstrualCycle nếu cần
       Task<IEnumerable<MenstrualCycle>> GetAllWithIncludesAsync();
        Task<MenstrualCycle> GetByIdWithCycleAsync(int cycleID);
        Task<IEnumerable<MenstrualCycle>> GetByAccountIdAsync(Guid accountId);
       Task<Remind> CreateOvulationReminderAsync(Guid accountId);
        Task<object> PredictCycleAsync(Guid accountId);
        Task<List<Remind>> GetPendingRemindersWithAccountAsync();
        Task UpdateReminderAsync(Remind reminder);
    }
} 