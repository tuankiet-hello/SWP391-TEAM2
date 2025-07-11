using HealthCareAPI.DTOs;
using HealthCareAPI.Entities;
using HealthCareAPI.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using HealthCareAPI.Enum;
using HealthCareAPI.Repositories;

namespace HealthCareAPI.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class AppoinmentController : ControllerBase
    {
        private readonly AppoinmentService _service;
        private readonly EmailService _emailService;
        private readonly IConfiguration _configuration;
        private readonly IUnitOfWork _unitOfWork;

        public AppoinmentController(
            AppoinmentService service,
            EmailService emailService,
            IConfiguration configuration,
            IUnitOfWork unitOfWork)
        {
            _service = service;
            _emailService = emailService;
            _configuration = configuration;
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _service.GetAllAsync();
            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAppointment(int id, [FromBody] AppoinmentDTO dto)
        {
            if (id != dto.AppointmentID)
                return BadRequest("ID mismatch");

            var result = await _service.UpdateAppointmentAsync(dto);
            if (!result) return NotFound();

            // --- Gửi email cho user sau khi cập nhật thành công ---
            // Sau khi update thành công
            try
            {
                var userEmail = dto.Account.Email;
                var fullName = $"{dto.Account.FirstName} {dto.Account.LastName}".Trim();

                string subject = "";
                string emailBody = "";

                switch ((int)dto.Status)
                {
                    case 2: // Confirmed
                        subject = "Your Appointment is Confirmed - Gender Health Care";
                        emailBody = $@"<div style='max-width:500px;margin:40px auto;padding:32px 24px;background:#222;border-radius:12px;color:#eee;font-family:sans-serif;box-shadow:0 2px 8px rgba(0,0,0,0.1);'>
                            <p>Dear <b>{fullName}</b>,</p>
                            <p>Thanks for reaching out to <b>Gender Health Care</b></p>
                            <p>We are pleased to inform you that your appointment has been confirmed.</p>
                            <p>Below are the details of your appointment:</p>
                            <ul style='margin:18px 0 24px 18px;padding:0;list-style:disc;color:#fff;'>
                                <li><b>Date:</b> {dto.AppointmentDate:dd/MM/yyyy}</li>
                                <li><b>Time:</b> {dto.AppointmentTime:HH\:mm}</li>
                            </ul>
                            <p>Best regards,</p>
                            <p><b>Gender Health Care Team</b></p>
                            <p style='margin-top:32px;'>If you have any concerns, please contact our team.</p>
                            <hr style='margin:32px 0;border:none;border-top:1px solid #444;'/>
                            <p style='font-size:13px;color:#aaa;text-align:center;'>This email was sent automatically, please do not reply.</p>
                        </div>";
                        break;

                    case 3: // Cancelled
                        subject = "Your Appointment Has Been Cancelled - Gender Health Care";
                        emailBody = $@"<div style='max-width:500px;margin:40px auto;padding:32px 24px;background:#222;border-radius:12px;color:#eee;font-family:sans-serif;box-shadow:0 2px 8px rgba(0,0,0,0.1);'>
                            <p>Dear <b>{fullName}</b>,</p>
                            <p>Thanks for reaching out to <b>Gender Health Care</b></p>
                            <p>We regret to inform you that your appointment has been cancelled.</p>
                            <p>Below are the details of your appointment:</p>
                            <ul style='margin:18px 0 24px 18px;padding:0;list-style:disc;color:#fff;'>
                                <li><b>Date:</b> {dto.AppointmentDate:dd/MM/yyyy}</li>
                                <li><b>Time:</b> {dto.AppointmentTime:HH\:mm}</li>
                            </ul>
                            <p>Best regards,</p>
                            <p><b>Gender Health Care Team</b></p>
                            <p style='margin-top:32px;'>If you have any concerns, please contact our team.</p>
                            <hr style='margin:32px 0;border:none;border-top:1px solid #444;'/>
                            <p style='font-size:13px;color:#aaa;text-align:center;'>This email was sent automatically, please do not reply.</p>
                        </div>";
                        break;

                    case 4: // Completed
                        subject = "Your Appointment is Completed - Gender Health Care";
                        emailBody = $@"<div style='max-width:500px;margin:40px auto;padding:32px 24px;background:#222;border-radius:12px;color:#eee;font-family:sans-serif;box-shadow:0 2px 8px rgba(0,0,0,0.1);'>
                            <p>Dear <b>{fullName}</b>,</p>
                            <p>Thanks for reaching out to <b>Gender Health Care</b></p>
                            <p>We're pleased to inform you that your appointment has been completed.</p>
                            <p>Below are the details of your appointment:</p>
                            <ul style='margin:18px 0 24px 18px;padding:0;list-style:disc;color:#fff;'>
                                <li><b>Date:</b> {dto.AppointmentDate:dd/MM/yyyy}</li>
                                <li><b>Time:</b> {dto.AppointmentTime:HH\:mm}</li>
                            </ul>
                            <p>Best regards,</p>
                            <p><b>Gender Health Care Team</b></p>
                            <p style='margin-top:32px;'>If you have any concerns, please contact our team.</p>
                            <hr style='margin:32px 0;border:none;border-top:1px solid #444;'/>
                            <p style='font-size:13px;color:#aaa;text-align:center;'>This email was sent automatically, please do not reply.</p>
                        </div>";
                        break;
                }

                if (!string.IsNullOrEmpty(userEmail) && !string.IsNullOrEmpty(subject) && !string.IsNullOrEmpty(emailBody))
                {
                    await _emailService.SendEmailAsync(userEmail, subject, emailBody);
                }
            }
            catch (Exception ex)
            {
                // Ghi log nếu cần
            }


            return Ok(new { success = true });
        }

        private async Task SendConfirmationEmail(NewAppoinmentDTO dto)
        {
            try
            {
                var account = await _unitOfWork.Repository<Account>().GetByIdAsync(dto.AccountID);
                var fullName = $"{account.FirstName} {account.LastName}".Trim();
                var userEmail = account.Email;

                var subject = "Your Appointment Has Been Submitted - Gender Health Care";
                var emailBody = $@"
                    <div style='max-width:500px;margin:40px auto;padding:32px 24px;background:#222;border-radius:12px;color:#eee;font-family:sans-serif;box-shadow:0 2px 8px rgba(0,0,0,0.1);'>
                        <p>Dear <b>{fullName}</b>,</p>
                        <p>Your appointment has been successfully booked.</p>
                        <p>Below are the details of your appointment:</p>
                        <ul>
                            <li><b>Date:</b> {dto.AppointmentDate:dd/MM/yyyy}</li>
                            <li><b>Time:</b> {dto.AppointmentTime:HH\:mm}</li>
                        </ul>
                        <p><b>Gender Health Care Team</b></p>
                    </div>";

                if (!string.IsNullOrEmpty(userEmail))
                    await _emailService.SendEmailAsync(userEmail, subject, emailBody);
            }
            catch (Exception ex)
            {
                // Log nếu cần
            }
        }


        [HttpPost]
        // [Authorize]
        public async Task<IActionResult> Create([FromBody] NewAppoinmentDTO dto)
        {
            if (dto.AccountID == Guid.Empty)
                return BadRequest("AccountID is required");

            dto.Status = StatusType.Submitted;

            // 1. Kiểm tra trùng ngày
            var existing = await _unitOfWork.AppoinmentRepository.FindAsync(a =>
                a.AccountID == dto.AccountID && a.AppointmentDate == dto.AppointmentDate);

            var existingAppt = existing.FirstOrDefault();

            if (existingAppt != null)
            {
                if (existingAppt.Status == StatusType.Canceled || existingAppt.Status == StatusType.Completed)
                {
                    // Cho tạo mới
                }
                else
                {
                    // Cho phép đổi giờ nếu khác
                    if (existingAppt.AppointmentTime == dto.AppointmentTime)
                    {
                        return BadRequest("You already have an appointment at this time.");
                    }

                    existingAppt.AppointmentTime = dto.AppointmentTime;
                    existingAppt.Status = StatusType.Submitted;

                    await _unitOfWork.CompleteAsync();

                    dto.AppointmentID = existingAppt.AppointmentID;
                    await SendConfirmationEmail(dto);

                    return Ok(new {
                        message = $"Rescheduled from {existingAppt.AppointmentTime:HH\\:mm} to {dto.AppointmentTime:HH\\:mm}.",
                        dto
                    });
                }
            }


            // 2. Nếu chưa có lịch hẹn → tạo mới
            var apptEntity = new Appoinment
            {
                AccountID = dto.AccountID,
                AppointmentDate = dto.AppointmentDate,
                AppointmentTime = dto.AppointmentTime,
                Status = dto.Status
            };

            await _unitOfWork.AppoinmentRepository.AddAsync(apptEntity);
            await _unitOfWork.CompleteAsync();

            dto.AppointmentID = apptEntity.AppointmentID;

            await SendConfirmationEmail(dto);

            return Ok(dto);
        }
        
        [HttpGet("by-account-and-date")]
        public async Task<IActionResult> GetByAccountAndDate([FromQuery] Guid accountID, [FromQuery] DateOnly date)
        {
            if (accountID == Guid.Empty)
                return BadRequest("AccountID is required");

            var appointments = await _unitOfWork.AppoinmentRepository.GetByAccountAndDateAsync(accountID, date);

            var dtos = appointments.Select(a => new AppoinmentDTO
            {
                AppointmentID = a.AppointmentID,
                AccountID = a.AccountID,
                AppointmentDate = a.AppointmentDate,
                AppointmentTime = a.AppointmentTime,
                Status = a.Status,
                Account = a.Account != null ? new AccountViewDTO
                {
                    FirstName = a.Account.FirstName,
                    LastName = a.Account.LastName,
                    DateOfBirth = a.Account.DateOfBirth,
                    Email = a.Account.Email
                } : null
            }).ToList();

            return Ok(dtos);
        }

        [HttpGet("account/{accountId}")]
        public async Task<IActionResult> GetAppointmentsByAccountID(Guid accountId)
        {
            var result = await _service.GetAppointmentsByAccountIDAsync(accountId);
            return Ok(result);
        }

       
    }

}