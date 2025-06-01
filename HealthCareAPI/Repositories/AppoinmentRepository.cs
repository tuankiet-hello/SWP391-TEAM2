using HealthCareAPI.Entities;
using HealthCareAPI;

namespace HealthCareAPI.Repositories
{
    public class AppoinmentRepository : GenericRepository<Appoinment>, IAppoinmentRepository
    {
        public AppoinmentRepository(ApplicationDbContext context) : base(context)
        {
        }
        // Thêm các method đặc thù cho Appoinment nếu cần
    }
}
//Các file I___ sẽ là lớp định nghĩa cho các class Repository
//File  IGenericRepository.cs sẽ là lớp định nghĩa chung cho các class Repository và là lớp đc tạo đầu tiên
//File GenericRepository.cs sẽ là lớp chung cho các class Repository và là lớp đc tạo thứ 2