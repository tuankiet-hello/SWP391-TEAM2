using HealthCareAPI.Entities;
using HealthCareAPI;
using Microsoft.EntityFrameworkCore;
using HealthCareAPI.DTOs;

namespace HealthCareAPI.Repositories
{
    public class TestsRepository : GenericRepository<Test>, ITestsRepository
    {
        // Thêm các method đặc thù cho Tests nếu cần
        public TestsRepository(ApplicationDbContext context) : base(context) { }

        public async Task<IEnumerable<Test>> EditActiveTestsAsync()
        {
            var activeTests = await _dbSet.Where(t => t.Active).ToListAsync();
            foreach (var test in activeTests)
            {
                test.Active = false;
            }
            await _context.SaveChangesAsync();
            return activeTests; // Trả về danh sách các Test vừa chỉnh sửa
        }


        public Task<IEnumerable<Test>> EditActiveTestsAsync(Test test)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<Test>> GetActiveTestsAsync()
        {
            return await _dbSet.Where(t => t.Active).ToListAsync();
        }

        public async Task<Test> GetTestByNameAsync(string name)
        {
            return await _dbSet.FirstOrDefaultAsync(t => t.TestName == name);
        }

        
    }
} 