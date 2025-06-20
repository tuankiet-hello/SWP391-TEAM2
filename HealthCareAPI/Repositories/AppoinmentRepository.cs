using HealthCareAPI.Entities;
using HealthCareAPI;
using Microsoft.EntityFrameworkCore;

namespace HealthCareAPI.Repositories
{
    public class AppoinmentRepository : GenericRepository<Appoinment>, IAppoinmentRepository
    {
        public AppoinmentRepository(ApplicationDbContext context) : base(context) { }
        
        public async Task<IEnumerable<Appoinment>> GetAppointmentsByDateAsync(DateOnly date)
        {
            return await _dbSet.Where(a => a.AppointmentDate == date).ToListAsync();
        }

        public async Task<IEnumerable<Appoinment>> GetAppointmentsByWeekAsync(DateOnly startDate, DateOnly endDate)
        {
            return await _dbSet.Where(a => a.AppointmentDate >= startDate && a.AppointmentDate <= endDate).ToListAsync();
        }
        // Thêm các method đặc thù cho Appoinment nếu cần
    }
}
//Các file I___ sẽ là lớp định nghĩa cho các class Repository
//File  IGenericRepository.cs sẽ là lớp định nghĩa chung cho các class Repository và là lớp đc tạo đầu tiên
//File GenericRepository.cs sẽ là lớp chung cho các class Repository và là lớp đc tạo thứ 2