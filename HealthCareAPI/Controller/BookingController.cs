using HealthCareAPI.DTOs;
using HealthCareAPI.Entities;
using HealthCareAPI.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using HealthCareAPI.Enum;
using HealthCareAPI.Repositories;

namespace HealthCareAPI.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingController : ControllerBase
    {
        private readonly TestBookingService _testBookingService;
        private readonly EmailService _emailService;
        private readonly IUnitOfWork _unitOfWork;
        public BookingController(TestBookingService testBookingService, EmailService emailService, IUnitOfWork unitOfWork)
        {
            _testBookingService = testBookingService;
            _emailService = emailService;
            _unitOfWork = unitOfWork;
        }
        [HttpGet("list-booking")]
        public async Task<ActionResult<IEnumerable<TestBooking>>> GetAllBookings()
        {
            var bookings = await _testBookingService.GetAllTestBookingsAsync();
            return Ok(bookings);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetByID(int id)
        {
            var test = await _testBookingService.GetByIdWithMoreInfAsync(id);
            if (test == null)
            {
                return NotFound(new { message = "Booking not found" });
            }
            return Ok(test);
        }

        [HttpPost("add-booking")]
        public async Task<IActionResult> CreateBooking([FromBody] TestBookingDTO testBookingDto)
        {
            if (testBookingDto == null)
            {
                return BadRequest("Invalid booking data.");
            }

            await _testBookingService.AddTestBookingAsync(testBookingDto);

            // === Gửi email nếu trạng thái là Confirmed ===
            if (testBookingDto.Status == StatusType.Confirmed)
            {
                try
                {
                    // Truy vấn Account & Test từ DB
                    var account = await _unitOfWork.Repository<Account>().GetByIdAsync(testBookingDto.AccountID);
                    var test = await _unitOfWork.Repository<Test>().GetByIdAsync(testBookingDto.TestID);

                    if (account != null && test != null)
                    {
                        var fullName = $"{account.FirstName} {account.LastName}".Trim();
                        var email = account.Email;
                        var testName = test.TestName;

                        var subject = "Your Test Booking is Confirmed - Gender Health Care";
                        var emailBody = $@"
                            <div style='max-width:500px;margin:40px auto;padding:32px 24px;background:#222;border-radius:12px;color:#eee;font-family:sans-serif;box-shadow:0 2px 8px rgba(0,0,0,0.1);'>
                                <p>Dear <b>{fullName}</b>,</p>
                                <p>Thanks for reaching out to <b>Gender Health Care</b>.</p>
                                <p>We are pleased to inform you that your test booking has been confirmed.</p>
                                <p>Below are the details of your test booking:</p>
                                <ul style='margin:18px 0 24px 18px;padding:0;list-style:disc;color:#fff;'>
                                    <li><b>Date:</b> {testBookingDto.BookingDate:dd/MM/yyyy}</li>
                                    <li><b>Time:</b> {testBookingDto.BookingTime:HH\:mm}</li>
                                    <li><b>Test:</b> {testName}</li>
                                </ul>
                                <p>Best regards,</p>
                                <p><b>Gender Health Care Team</b></p>
                                <p style='margin-top:32px;'>If you have any concerns, please contact our team.</p>
                                <hr style='margin:32px 0;border:none;border-top:1px solid #444;'/>
                                <p style='font-size:13px;color:#aaa;text-align:center;'>This email was sent automatically. Please do not reply.</p>
                            </div>";

                        if (!string.IsNullOrEmpty(email))
                        {
                            await _emailService.SendEmailAsync(email, subject, emailBody);
                        }
                    }
                }
                catch (Exception ex)
                {
                    // Ghi log nếu cần
                }
            }

            return Ok(new { message = "Booking created successfully." });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBooking(
            int id,
            [FromBody] EditTestBookingDTO testBookingDto,
            [FromQuery] Guid accountID // lấy accountID từ query string
        )
        {
            if (testBookingDto == null)
            {
                return BadRequest("Invalid booking data.");
            }

            try
            {
                await _testBookingService.UpdateTestAsync(id, testBookingDto);

                // Gửi email theo trạng thái mới
                if (testBookingDto.Status == StatusType.Confirmed ||
                    testBookingDto.Status == StatusType.Canceled ||
                    testBookingDto.Status == StatusType.Completed)
                {
                    try
                    {
                        var account = await _unitOfWork.Repository<Account>().GetByIdAsync(accountID);
                        var test = await _unitOfWork.Repository<Test>().GetByIdAsync(testBookingDto.TestID);

                        if (account != null && test != null)
                        {
                            var fullName = $"{account.FirstName} {account.LastName}".Trim();
                            var email = account.Email;
                            var testName = test.TestName;

                            string subject = "";
                            string emailBody = "";

                            switch (testBookingDto.Status)
                            {
                                case StatusType.Confirmed:
                                    subject = "Your Test Booking is Confirmed - Gender Health Care";
                                    emailBody = $@"
                                        <div style='max-width:500px;margin:40px auto;padding:32px 24px;background:#222;border-radius:12px;color:#eee;font-family:sans-serif;box-shadow:0 2px 8px rgba(0,0,0,0.1);'>
                                            <p>Dear <b>{fullName}</b>,</p>
                                            <p>Thanks for reaching out to <b>Gender Health Care</b>.</p>
                                            <p>Your test booking has been confirmed.</p>
                                            <p>Below are the details of your test booking:</p>
                                            <ul style='margin:18px 0 24px 18px;padding:0;list-style:disc;color:#fff;'>
                                                <li><b>Date:</b> {testBookingDto.BookingDate:dd/MM/yyyy}</li>
                                                <li><b>Time:</b> {testBookingDto.BookingTime:HH\:mm}</li>
                                                <li><b>Test:</b> {testName}</li>
                                            </ul>
                                            <p>Best regards,</p>
                                            <p><b>Gender Health Care Team</b></p>
                                            <p style='margin-top:32px;'>If you have any concerns, please contact our team.</p>
                                            <hr style='margin:32px 0;border:none;border-top:1px solid #444;'/>
                                            <p style='font-size:13px;color:#aaa;text-align:center;'>This email was sent automatically. Please do not reply.</p>
                                        </div>";
                                    break;

                                case StatusType.Canceled:
                                    subject = "Your Test Booking Has Been Cancelled - Gender Health Care";
                                    emailBody = $@"
                                        <div style='max-width:500px;margin:40px auto;padding:32px 24px;background:#222;border-radius:12px;color:#eee;font-family:sans-serif;box-shadow:0 2px 8px rgba(0,0,0,0.1);'>
                                            <p>Dear <b>{fullName}</b>,</p>
                                            <p>We regret to inform you that your test booking has been cancelled.</p>
                                            <p>Below are the details of your test booking:</p>
                                            <ul style='margin:18px 0 24px 18px;padding:0;list-style:disc;color:#fff;'>
                                                <li><b>Date:</b> {testBookingDto.BookingDate:dd/MM/yyyy}</li>
                                                <li><b>Time:</b> {testBookingDto.BookingTime:HH\:mm}</li>
                                                <li><b>Test:</b> {testName}</li>
                                            </ul>
                                            <p>Best regards,</p>
                                            <p><b>Gender Health Care Team</b></p>
                                            <p style='margin-top:32px;'>If you have any concerns, please contact our team.</p>
                                            <hr style='margin:32px 0;border:none;border-top:1px solid #444;'/>
                                            <p style='font-size:13px;color:#aaa;text-align:center;'>This email was sent automatically. Please do not reply.</p>
                                        </div>";
                                    break;

                                case StatusType.Completed:
                                    subject = "Your Test Booking is Completed - Gender Health Care";
                                    emailBody = $@"
                                        <div style='max-width:500px;margin:40px auto;padding:32px 24px;background:#222;border-radius:12px;color:#eee;font-family:sans-serif;box-shadow:0 2px 8px rgba(0,0,0,0.1);'>
                                            <p>Dear <b>{fullName}</b>,</p>
                                            <p>We are pleased to inform you that your test booking has been completed.</p>
                                            <p>Below are the details of your test booking:</p>
                                            <ul style='margin:18px 0 24px 18px;padding:0;list-style:disc;color:#fff;'>
                                                <li><b>Date:</b> {testBookingDto.BookingDate:dd/MM/yyyy}</li>
                                                <li><b>Time:</b> {testBookingDto.BookingTime:HH\:mm}</li>
                                                <li><b>Test:</b> {testName}</li>
                                                <li><b>Result:</b> {testBookingDto.Result}</li>
                                            </ul>
                                            <p>Best regards,</p>
                                            <p><b>Gender Health Care Team</b></p>
                                            <p style='margin-top:32px;'>If you have any concerns, please contact our team.</p>
                                            <hr style='margin:32px 0;border:none;border-top:1px solid #444;'/>
                                            <p style='font-size:13px;color:#aaa;text-align:center;'>This email was sent automatically. Please do not reply.</p>
                                        </div>";
                                    break;
                            }

                            if (!string.IsNullOrEmpty(email) && !string.IsNullOrEmpty(subject) && !string.IsNullOrEmpty(emailBody))
                            {
                                await _emailService.SendEmailAsync(email, subject, emailBody);
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        // Log lỗi nếu cần
                    }
                }

                return Ok(new { message = "Booking updated successfully." });
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }


        [HttpGet("history")]
        public async Task<IActionResult> GetTestHistory([FromQuery] Guid accountId)
        {
            var history = await _testBookingService.GetTestHistoryAsync(accountId);
            return Ok(history);
        }
        
        [HttpPost("create-booking")]
        public async Task<IActionResult> CreateBookingForUser([FromBody] TestBookingDTO testBookingDto)
        {
            if (testBookingDto == null)
            {
                return BadRequest("Invalid booking data.");
            }

            try
            {
                // Gán mặc định nếu chưa truyền (phòng ngừa client gửi thiếu)
                testBookingDto.Status = StatusType.Submitted;
                testBookingDto.Result = null;

                // Thêm vào database
                await _testBookingService.AddTestBookingAsync(testBookingDto);

                return Ok(new { message = "Booking created successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Error while creating booking.",
                    detail = ex.ToString()
                });
            }
        }

    }
}
