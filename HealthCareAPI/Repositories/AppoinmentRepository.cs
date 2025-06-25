using HealthCareAPI.Entities;
using HealthCareAPI;
using Microsoft.EntityFrameworkCore;

namespace HealthCareAPI.Repositories
{
    public class AppoinmentRepository : GenericRepository<Appoinment>, IAppoinmentRepository
    {
        public AppoinmentRepository(ApplicationDbContext context) : base(context) { }

        public async Task<IEnumerable<Appoinment>> GetAllWithAccountAsync()
        {
            return await _dbSet
                .Include(a => a.Account)
                .ToListAsync();
        }

        public void Update(Appoinment entity)
        {
            _context.Appoinments.Update(entity);
        }
    }
}
//Các file I___ sẽ là lớp định nghĩa cho các class Repository
//File  IGenericRepository.cs sẽ là lớp định nghĩa chung cho các class Repository và là lớp đc tạo đầu tiên
//File GenericRepository.cs sẽ là lớp chung cho các class Repository và là lớp đc tạo thứ 2