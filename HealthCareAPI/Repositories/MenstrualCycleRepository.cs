using HealthCareAPI.Entities;
using HealthCareAPI;
using Microsoft.EntityFrameworkCore;

namespace HealthCareAPI.Repositories
{
    public class MenstrualCycleRepository : GenericRepository<MenstrualCycle>, IMenstrualCycleRepository
    {
        public MenstrualCycleRepository(ApplicationDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<MenstrualCycle>> GetAllWithIncludesAsync()
        {
            return await _context.Menstrual_Cycles
                .Include(tb => tb.Account)
                .ToListAsync();
        }

        public async Task<MenstrualCycle> GetByIdWithCycleAsync(int cycleID)
        {
            return await _context.Menstrual_Cycles
                .Include(mc => mc.Account)
                .FirstOrDefaultAsync(mc => mc.CycleID == cycleID);
        }
        public async Task<IEnumerable<MenstrualCycle>> GetByAccountIdAsync(Guid accountId)
        {
            return await _context.Menstrual_Cycles
                .Where(x => x.AccountID == accountId)
                .Include(x=>x.Account)
                .OrderByDescending(x => x.Start_date)
                .ToListAsync();
        }

        public async Task<object> PredictCycleAsync(Guid accountId)
        {
            var cycles = (await GetByAccountIdAsync(accountId))
                .OrderBy(x => x.Start_date)
                .ToList();

            if (cycles.Count < 2)
                throw new Exception("Cần ít nhất 2 chu kỳ để dự đoán.");

            // Tính độ dài từng chu kỳ
            var cycleLengths = new List<int>();
            for (int i = 1; i < cycles.Count; i++)
            {
                var prev = cycles[i - 1].Start_date.ToDateTime(TimeOnly.MinValue);
                var curr = cycles[i].Start_date.ToDateTime(TimeOnly.MinValue);
                cycleLengths.Add((curr - prev).Days);
            }
            var avgLength = (int)cycleLengths.Average();

            var lastCycle = cycles.Last();
            var predictedStart = lastCycle.Start_date.AddDays(avgLength);
            var predictedOvulation = predictedStart.AddDays(-14);

            return new
            {
                PredictedStartDate = predictedStart,
                PredictedOvulationDate = predictedOvulation,
                FertileWindow = new[]
                {
                predictedOvulation.AddDays(-5),
                predictedOvulation.AddDays(1)
                }
            };
        }



    }
} 