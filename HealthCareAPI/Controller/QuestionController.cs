using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using HealthCareAPI.DTOs;
using HealthCareAPI.Entities;
using HealthCareAPI.Services;
using HealthCareAPI.Enum;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using HealthCareAPI.Repositories;

namespace HealthCareAPI.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuestionController : ControllerBase
    {
        private readonly QuestionService _service;
        private readonly EmailService _emailService;
        private readonly IUnitOfWork _unitOfWork;

        public QuestionController(
            QuestionService questionService,
            EmailService emailService,
            IUnitOfWork unitOfWork)
        {
            _service = questionService;
            _emailService = emailService;
            _unitOfWork = unitOfWork;
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
                            <p>Dear <b>{fullName}</b>,</p>
                            <p>Thanks for reaching out to <b>Gender Health Care</b></p>
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
                            <p>Dear <b>{fullName}</b>,</p>
                            <p>Thanks for reaching out to <b>Gender Health Care</b></p>
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

        [HttpPost]
        // [Authorize]
        public async Task<IActionResult> CreateQuestion([FromBody] NewQuestionDTO dto)
        {
            if (dto.AccountID == Guid.Empty)
                return BadRequest("AccountID is required");

            dto.Status = StatusType.Submitted;
            dto.CreatedAt = DateTime.UtcNow;

            var questionEntity = new Question
            {
                AccountID = dto.AccountID,
                Title = dto.Title,
                Description = dto.Description,
                Status = dto.Status,
                CreatedAt = dto.CreatedAt
            };

            await _unitOfWork.QuestionRepository.AddAsync(questionEntity);
            await _unitOfWork.CompleteAsync();

            dto.QuestionID = questionEntity.QuestionID;

            // ✅ Gửi email sau khi tạo câu hỏi
            try
            {
                var user = await _unitOfWork.Repository<Account>().GetByIdAsync(dto.AccountID);
                if (user != null && !string.IsNullOrEmpty(user.Email))
                {
                    var fullName = $"{user.FirstName} {user.LastName}".Trim();
                    var submittedDate = dto.CreatedAt.ToString("dd/MM/yyyy HH:mm");

                    var subject = "Your Inquiry Has Been Submitted - Gender Health Care";
                    var body = $@"
                        <div style='max-width:500px;margin:40px auto;padding:32px 24px;background:#222;border-radius:12px;color:#eee;font-family:sans-serif;box-shadow:0 2px 8px rgba(0,0,0,0.1);'>
                            <p>Dear <b>{fullName}</b>,</p>
                            <p>Thank you for submitting your question to <b>Gender Health Care</b>.</p>
                            <p>We have received your inquiry and will review it shortly.</p>
                            <ul style='margin:18px 0 24px 18px;padding:0;list-style:disc;color:#fff;'>
                                <li><b>Title:</b> {dto.Title}</li>
                                <li><b>Description:</b> {dto.Description}</li>
                                <li><b>Submitted On:</b> {submittedDate}</li>
                            </ul>
                            <p>We will get back to you soon with an answer.</p>
                            <p>Best regards,</p>
                            <p><b>Gender Health Care Team</b></p>
                            <hr style='margin:32px 0;border:none;border-top:1px solid #444;'/>
                            <p style='font-size:13px;color:#aaa;text-align:center;'>This email was sent automatically, please do not reply.</p>
                        </div>
                    ";

                    await _emailService.SendEmailAsync(user.Email, subject, body);
                }
            }
            catch (Exception ex)
            {
                // Ghi log nếu cần, không throw để không ảnh hưởng người dùng
            }

            return Ok(dto);
        }

        [HttpGet("account/{accountId}")]
        public async Task<IActionResult> GetQuestionsByAccountId(Guid accountId)
        {
            var questions = await _service.GetQuestionsByAccountIdAsync(accountId);
            return Ok(questions);
        }
    }
}