using HealthCareAPI.Entities;

namespace HealthCareAPI.Repositories
{
    public interface IAppoinmentRepository : IGenericRepository<Appoinment>
    {
        Task<IEnumerable<Appoinment>> GetAllWithAccountAsync();
        Task<List<Appoinment>> GetByAccountAndDateAsync(Guid accountID, DateOnly date);
        Task<List<Appoinment>> GetAppointmentsByAccountIdAsync(Guid accountId);
        // Task<bool> UpdateAppoinmentAsync(AppoinmentDTO dto);
    }
} 