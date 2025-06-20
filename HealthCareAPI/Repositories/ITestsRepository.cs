using HealthCareAPI.DTOs;
using HealthCareAPI.Entities;

namespace HealthCareAPI.Repositories
{
    public interface ITestsRepository : IGenericRepository<Test>
    {

        //Interface này kế thừa từ generic repository và
        //bổ sung các hàm đặc thù cho Test.
        Task<IEnumerable<Test>> EditActiveTestsAsync();
        Task<Test> GetTestByNameAsync(string name);

    }
}