using HealthCareAPI.DTOs;
using HealthCareAPI.Entities;
using HealthCareAPI.Repositories;
using Microsoft.AspNetCore.Identity;

namespace HealthCareAPI.Services
{
    public class TestService
    {
        private readonly IUnitOfWork _unitOfWork;

        public TestService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<IEnumerable<Test>> GetAllTestsAsync()
        {
            return await _unitOfWork.TestsRepository.GetAllAsync();
        }

        public async Task AddTestAsync(TestsDTO testDto)
        {
            var test = new Test
            {
                TestName = testDto.TestName,
                Price = (decimal)testDto.Price,
                Description = testDto.Description ?? string.Empty,
                Active = testDto.Active == HealthCareAPI.Enum.ActivityTest.Active
            };
            await _unitOfWork.TestsRepository.AddAsync(test);
            await _unitOfWork.CompleteAsync();
        }
      
        public async Task UpdateTestAsync(int id, TestsDTO testDto)
        {
            var test = await _unitOfWork.TestsRepository.GetByIdAsync(id);
            if (test == null) throw new Exception("Test not found");

            test.TestName = testDto.TestName;
            test.Price = (decimal)testDto.Price;
            test.Description = testDto.Description ?? string.Empty;
            test.Active = testDto.Active == HealthCareAPI.Enum.ActivityTest.Active;

            _unitOfWork.TestsRepository.Update(test);
            await _unitOfWork.CompleteAsync();
        }
         public async Task DeletedTestAsync(int id)
        {
            var test = await _unitOfWork.TestsRepository.GetByIdAsync(id);
            if (test == null) throw new Exception("Test not found");

            // Bắt buộc set cả 2 thuộc tính
            if (test.Active == true)
            {
                test.Active = false;
            }
            _unitOfWork.TestsRepository.Update(test);
            await _unitOfWork.CompleteAsync();
        }
        

        public async Task<Test> GetTestByNameAsync(string name)
        {
            return await _unitOfWork.TestsRepository.GetTestByNameAsync(name);
        }
    }
}
