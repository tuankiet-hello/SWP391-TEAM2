using HealthCareAPI.DTOs;
using HealthCareAPI.Entities;
using HealthCareAPI.Repositories;

namespace HealthCareAPI.Services
{
    public class MenstrualCycleService
    {
        private readonly IUnitOfWork _unitOfWork;

        public MenstrualCycleService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<IEnumerable<MenstrualCycle>> GetAllMenstrualCycleAsync()
        {
            return await _unitOfWork.MenstrualCycleRepository.GetAllWithIncludesAsync();
        }
        public async Task<MenstrualCycle> GetMenstrualCycleByIdAsync(int cycleID)
        {
            return await _unitOfWork.MenstrualCycleRepository.GetByIdWithCycleAsync(cycleID);
        }
        public async Task<IEnumerable<MenstrualCycle>> GetMenstrualCycleByAccountIdAsync(Guid accountId)
        {
            return await _unitOfWork.MenstrualCycleRepository.GetByAccountIdAsync(accountId);
        }
        public async Task<object> PredictCycleAsync(Guid accountId)
        {
            return await _unitOfWork.MenstrualCycleRepository.PredictCycleAsync(accountId);
        }
        public async Task AddMenstrualCycleAsync(MenstrualCycleDTO cycleDto)
        {
            // Map từ DTO sang Entity trong Service
            var cycle = new MenstrualCycle
            {
                AccountID = cycleDto.AccountID,
                Start_date = cycleDto.Start_date,
                End_date = cycleDto.End_date,
                Note = cycleDto.Note
                // Các trường khác nếu có
            };

            // Lưu entity vào database
            await _unitOfWork.MenstrualCycleRepository.AddAsync(cycle);
            await _unitOfWork.CompleteAsync();
        }

        public async Task UpdateMenstrualCycleAsync(int cycleID, MenstrualCycleDTO cycleDto)
        {
            var existingCycle = await _unitOfWork.MenstrualCycleRepository.GetByIdAsync(cycleID);
            if (existingCycle == null)
                throw new KeyNotFoundException("Menstrual Cycle not found");

            // Map từ DTO sang Entity (chỉ cập nhật các trường cần thiết)
            existingCycle.Start_date = cycleDto.Start_date;
            existingCycle.End_date = cycleDto.End_date;
            existingCycle.AccountID = cycleDto.AccountID;
            existingCycle.Note = cycleDto.Note;
            // Thêm các trường khác nếu có

            _unitOfWork.MenstrualCycleRepository.Update(existingCycle);
            await _unitOfWork.CompleteAsync();
        }

    }
}
