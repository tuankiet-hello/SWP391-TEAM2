using HealthCareAPI.Entities;

namespace HealthCareAPI.Repositories
{
    public interface IAppoinmentRepository : IGenericRepository<Appoinment>
    {
        //lấy lịch theo ngày, tuần
        Task<IEnumerable<Appoinment>> GetAppointmentsByDateAsync(DateOnly date);
        Task<IEnumerable<Appoinment>> GetAppointmentsByWeekAsync(DateOnly startDate, DateOnly endDate);
    }
} 