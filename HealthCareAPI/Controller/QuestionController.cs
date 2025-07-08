using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using HealthCareAPI.DTOs;
using HealthCareAPI.Entities;
using HealthCareAPI.Services;

namespace HealthCareAPI.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuestionController : ControllerBase
    {
        private readonly QuestionService _service;
        private readonly EmailService _emailService;

        public QuestionController(
            QuestionService questionService,
            EmailService emailService)
        {
            _service = questionService;
            _emailService = emailService;
        }

        [HttpGet]
        public async Task<IActionResult> GetQuestions()
        {
            var questions = await _service.GetAllQuestionsAsync();
            return Ok(questions);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateQuestion(int id, [FromBody] QuestionDTO dto)
        {
            if (id != dto.QuestionID)
                return BadRequest("ID mismatch");

            var result = await _service.UpdateQuestionAsync(id, dto);
            if (!result)
                return NotFound(new { message = "Question not found" });

            // --- Gửi email cho user dựa vào trạng thái ---
            try
            {
                var userEmail = dto.Account.Email;
                var fullName = $"{dto.Account.FirstName} {dto.Account.LastName}".Trim();
                var createdAt = dto.CreatedAt.ToString("dd/MM/yyyy HH:mm");
                var subject = "";
                var emailBody = "";

                // Status: Completed (ví dụ status == 2)
                if ((int)dto.Status == 4 && !string.IsNullOrEmpty(userEmail))
                {
                    subject = "Your Inquiry Has Been Anserwered - Gender Health Care";
                    emailBody = $@"
                        <div style='max-width:500px;margin:40px auto;padding:32px 24px;background:#222;border-radius:12px;color:#eee;font-family:sans-serif;box-shadow:0 2px 8px rgba(0,0,0,0.1);'>
                            <h2 style='text-align:center;margin-bottom:24px;'>Thanks for reaching out to <b>Gender Health Care</b></h2>
                            <p>Dear <b>{fullName}</b>,</p>
                            <p>We're pleased to inform you that your inquiry has been reviewed and answer.</p>
                            <p>Below are the details of your question:</p>
                            <ul style='margin:18px 0 24px 18px;padding:0;list-style:disc;color:#fff;'>
                                <li><b>Title:</b> {dto.Title}</li>
                                <li><b>Description:</b> {dto.Description}</li>
                                <li><b>Submitted On:</b> {createdAt}</li>
                                <li><b>Answer:</b> {dto.Answer}</li>
                            </ul>
                            <p>Best regards,</p>
                            <p><b>Gender Health Care Team</b></p>
                            <p style='margin-top:32px;'>If you have any concerns, please contact our team.</p>
                            <hr style='margin:32px 0;border:none;border-top:1px solid #444;'/>
                            <p style='font-size:13px;color:#aaa;text-align:center;'>This email was sent automatically, please do not reply.</p>
                        </div>
                    ";
                    await _emailService.SendEmailAsync(userEmail, subject, emailBody);
                }
                // Status: Canceled (ví dụ status == 3)
                else if ((int)dto.Status == 3 && !string.IsNullOrEmpty(userEmail))
                {
                    subject = "Your Inquiry Has Been Cancelled - Gender Health Care";
                    emailBody = $@"
                        <div style='max-width:500px;margin:40px auto;padding:32px 24px;background:#222;border-radius:12px;color:#eee;font-family:sans-serif;box-shadow:0 2px 8px rgba(0,0,0,0.1);'>
                            <h2 style='text-align:center;margin-bottom:24px;'>Thanks for reaching out to <b>Gender Health Care</b></h2>
                            <p>Dear <b>{fullName}</b>,</p>
                            <p>We regret to inform you that your request has been reviewed and cannot be fulfilled at this time.</p>
                            <p>Below are the details of your question:</p>
                            <ul style='margin:18px 0 24px 18px;padding:0;list-style:disc;color:#fff;'>
                                <li><b>Title:</b> {dto.Title}</li>
                                <li><b>Description:</b> {dto.Description}</li>
                                <li><b>Submitted On:</b> {createdAt}</li>
                                <li><b>Reason for cancellation :</b> {dto.Answer}</li>
                            </ul>
                            <p>Best regards,</p>
                            <p><b>Gender Health Care Team</b></p>
                            <p style='margin-top:32px;'>If you have any concerns, please contact our team.</p>
                            <hr style='margin:32px 0;border:none;border-top:1px solid #444;'/>
                            <p style='font-size:13px;color:#aaa;text-align:center;'>This email was sent automatically, please do not reply.</p>
                        </div>
                    ";
                    await _emailService.SendEmailAsync(userEmail, subject, emailBody);
                }
                // Status: Submitted (ví dụ status == 1) => Không gửi mail
            }
            catch (Exception ex)
            {
                // Ghi log nếu cần, không throw để không ảnh hưởng tới FE
            }

            return Ok(new { message = "Question updated successfully" });
        }

    }
}