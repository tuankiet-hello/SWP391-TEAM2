using HealthCareAPI.Entities;

namespace HealthCareAPI.Repositories
{
    public interface IAppoinmentRepository : IGenericRepository<Appoinment>
    {
        Task<IEnumerable<Appoinment>> GetAllWithAccountAsync();
        // Task<bool> UpdateAppoinmentAsync(AppoinmentDTO dto);
    }
} 