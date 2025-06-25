using HealthCareAPI.DTOs;
using HealthCareAPI.Entities;
using HealthCareAPI.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;

namespace HealthCareAPI.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class AppoinmentController : ControllerBase
    {
        private readonly AppoinmentService _service;
        private readonly EmailService _emailService;
        private readonly IConfiguration _configuration;

        public AppoinmentController(
            AppoinmentService service,
            EmailService emailService,
            IConfiguration configuration)
        {
            _service = service;
            _emailService = emailService;
            _configuration = configuration;
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
            try
            {
                // Lấy thông tin email và tên user (giả sử DTO có các trường này)
                var userEmail = dto.Account.Email; // hoặc dto.Account.Email, tùy theo cấu trúc DTO của bạn
                var fullName = $"{dto.Account.FirstName} {dto.Account.LastName}".Trim(); // hoặc dto.Account.FullName, hoặc tự ghép firstName + lastName

                var subject = "Your appointment has been updated.";
                var emailBody = $@"
                    <div style='max-width:500px;margin:40px auto;padding:32px 24px;background:#222;border-radius:12px;color:#eee;font-family:sans-serif;box-shadow:0 2px 8px rgba(0,0,0,0.1);'>
                        <h2 style='text-align:center;margin-bottom:24px;'>Appointment Updated - <b>Health Care System</b></h2>
                        <p>Hello <b>{fullName}</b>,</p>
                        <p>Your appointment has been updated!</p>
                        <ul style='margin:18px 0 24px 18px;padding:0;list-style:disc;color:#fff;'>
                        <li><b>Date:</b> {dto.AppointmentDate:dd/MM/yyyy}</li>
                        <li><b>Time:</b> {dto.AppointmentTime}</li>
                        <li><b>Status:</b> {dto.Status}</li>
                        </ul>
                        <p style='margin-top:32px;'>If you have any questions, please contact our support team.</p>
                        <hr style='margin:32px 0;border:none;border-top:1px solid #444;'/>
                        <p style='font-size:13px;color:#aaa;text-align:center;'>This email was sent automatically, please do not reply.</p>
                    </div>
                    ";


                if ((int)dto.Status == 2 && !string.IsNullOrEmpty(userEmail))
                {
                    await _emailService.SendEmailAsync(userEmail, subject, emailBody);
                }
            }
            catch (Exception ex)
            {
                // Ghi log nếu cần, không throw để không ảnh hưởng tới FE
            }

            return Ok(new { success = true });
        }

    }

}