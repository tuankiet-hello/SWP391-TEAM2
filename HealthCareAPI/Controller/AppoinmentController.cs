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
                        emailBody = $@"<div style='max-width:500px;margin:40px auto;padding:32px 24px;background:#F9F9F9;border-radius:12px;color:#222;font-family:sans-serif;box-shadow:0 2px 8px rgba(0,0,0,0.1);'>
                            <h2 style='text-align:center;margin-bottom:24px;'>Thanks for reaching out to <b>Gender Health Care</b></h2>
                            <p>Dear <b>{fullName}</b>,</p>
                            <p>We are pleased to inform you that your appointment has been confirmed.</p>
                            <p>Below are the details of your appointment:</p>
                            <ul style='margin:18px 0 24px 18px;padding:0;list-style:disc;color:#222;'>
                                <li><b>Date:</b> {dto.AppointmentDate:dd/MM/yyyy}</li>
                                <li><b>Time:</b> {dto.AppointmentTime}</li>
                                <li><b>Status:</b> Confirmed</li>
                            </ul>
                            <p>Best regards,</p>
                            <p><b>Gender Health Care Team</b></p>
                            <p style='margin-top:32px;'>If you have any concerns, please contact our team.</p>
                            <hr style='margin:32px 0;border:none;border-top:1px solid #eee;'/>
                            <p style='font-size:13px;color:#aaa;text-align:center;'>This email was sent automatically, please do not reply.</p>
                        </div>";
                        break;

                    case 3: // Cancelled
                        subject = "Your Appointment Has Been Cancelled - Gender Health Care";
                        emailBody = $@"<div style='max-width:500px;margin:40px auto;padding:32px 24px;background:#F9F9F9;border-radius:12px;color:#222;font-family:sans-serif;box-shadow:0 2px 8px rgba(0,0,0,0.1);'>
                            <h2 style='text-align:center;margin-bottom:24px;'>Thanks for reaching out to <b>Gender Health Care</b></h2>
                            <p>Dear <b>{fullName}</b>,</p>
                            <p>We regret to inform you that your appointment has been cancelled.</p>
                            <p>Below are the details of your appointment:</p>
                            <ul style='margin:18px 0 24px 18px;padding:0;list-style:disc;color:#222;'>
                                <li><b>Date:</b> {dto.AppointmentDate:dd/MM/yyyy}</li>
                                <li><b>Time:</b> {dto.AppointmentTime}</li>
                                <li><b>Status:</b> Cancelled</li>
                            </ul>
                            <p>Best regards,</p>
                            <p><b>Gender Health Care Team</b></p>
                            <p style='margin-top:32px;'>If you have any concerns, please contact our team.</p>
                            <hr style='margin:32px 0;border:none;border-top:1px solid #eee;'/>
                            <p style='font-size:13px;color:#aaa;text-align:center;'>This email was sent automatically, please do not reply.</p>
                        </div>";
                        break;

                    case 4: // Completed
                        subject = "Your Appointment is Completed - Gender Health Care";
                        emailBody = $@"<div style='max-width:500px;margin:40px auto;padding:32px 24px;background:#F9F9F9;border-radius:12px;color:#222;font-family:sans-serif;box-shadow:0 2px 8px rgba(0,0,0,0.1);'>
                            <h2 style='text-align:center;margin-bottom:24px;'>Thanks for reaching out to <b>Gender Health Care</b></h2>
                            <p>Dear <b>{fullName}</b>,</p>
                            <p>We're pleased to inform you that your appointment has been completed.</p>
                            <p>Below are the details of your appointment:</p>
                            <ul style='margin:18px 0 24px 18px;padding:0;list-style:disc;color:#222;'>
                                <li><b>Date:</b> {dto.AppointmentDate:dd/MM/yyyy}</li>
                                <li><b>Time:</b> {dto.AppointmentTime}</li>
                                <li><b>Status:</b> Completed</li>
                            </ul>
                            <p>Best regards,</p>
                            <p><b>Gender Health Care Team</b></p>
                            <p style='margin-top:32px;'>If you have any concerns, please contact our team.</p>
                            <hr style='margin:32px 0;border:none;border-top:1px solid #eee;'/>
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

    }

}