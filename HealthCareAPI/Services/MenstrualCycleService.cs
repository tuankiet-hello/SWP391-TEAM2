using HealthCareAPI.DTOs;
using HealthCareAPI.Entities;
using HealthCareAPI.Repositories;

namespace HealthCareAPI.Services
{
    public class MenstrualCycleService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly EmailService _emailService;

        public MenstrualCycleService(IUnitOfWork unitOfWork, EmailService emailService)
        {
            _unitOfWork = unitOfWork;
            _emailService = emailService;
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
        public async Task<Remind> CreateOvulationReminderAsync(Guid accountId)
        {
            // Gọi trực tiếp hàm trong repository
            return await _unitOfWork.MenstrualCycleRepository.CreateOvulationReminderAsync(accountId);
        }

        public async Task<int> SendRemindersAsync()
        {
            var today = DateTime.UtcNow.Date;

            // Lấy danh sách nhắc nhở chưa gửi, bao gồm cả thông tin Account (để lấy email)
            var reminders = await _unitOfWork.MenstrualCycleRepository.GetPendingRemindersWithAccountAsync();

            // Lọc những nhắc nhở cần gửi trước 3 ngày
            var remindersToSend = reminders.Where(r =>
                !r.IsSent &&
                (
                    (r.PredictedStartDate.ToDateTime(TimeOnly.MinValue) - today).TotalDays == 2 ||
                    (r.PredictedOvulationDate.ToDateTime(TimeOnly.MinValue) - today).TotalDays == 2
                )
            ).ToList();

            int sentCount = 0;

            foreach (var reminder in remindersToSend)
            {
                var user = reminder.Account;
                if (user == null || string.IsNullOrEmpty(user.Email))
                    continue;

                var emailBody = $@"
                <div style='max-width:500px;margin:40px auto;padding:32px 24px;background:#222;border-radius:12px;color:#eee;font-family:sans-serif;box-shadow:0 2px 8px rgba(0,0,0,0.1);'>
                  <h2 style='text-align:center;margin-bottom:24px;'>Reminder from <b>Health Care System</b></h2>
                  <p>Dear <b>{user.FirstName} {user.LastName}</b>,</p>
                  <p>This is a friendly reminder that your ovulation date is predicted to be on <b>{reminder.PredictedOvulationDate:yyyy-MM-dd}</b>.</p>
                  <p>Please remember to take your medication (e.g., birth control pills) starting 3 days before this date.</p>
                  <p>Your next menstrual cycle is predicted to start on <b>{reminder.PredictedStartDate:yyyy-MM-dd}</b>.</p>
                  <hr style='margin:32px 0;border:none;border-top:1px solid #444;'/>
                  <p style='font-size:13px;color:#aaa;text-align:center;'>This email was sent automatically. Please do not reply.</p>
                </div>
                ";

                try
                {
                    await _emailService.SendEmailAsync(user.Email, "Health Care System - Ovulation Reminder", emailBody);

                    // Đánh dấu đã gửi
                    reminder.IsSent = true;
                    _unitOfWork.MenstrualCycleRepository.UpdateReminderAsync(reminder);
                    await _unitOfWork.CompleteAsync();

                    sentCount++;
                }
                catch (Exception ex)
                {
                    // Log lỗi nếu cần
                    Console.WriteLine($"Failed to send email to {user.Email}: {ex.Message}");
                }
            }

            return sentCount;
        }
        public async Task<Remind> GetLatestRemindByAccountIdAsync(Guid accountId)
        {
            return await _unitOfWork.MenstrualCycleRepository.GetLatestRemindByAccountIdAsync(accountId);
        }


    }
}
