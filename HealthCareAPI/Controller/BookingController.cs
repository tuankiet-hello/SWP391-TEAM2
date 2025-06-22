using HealthCareAPI.DTOs;
using HealthCareAPI.Entities;
using HealthCareAPI.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HealthCareAPI.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingController : ControllerBase
    {
        private readonly TestBookingService _testBookingService;
        public BookingController(TestBookingService testBookingService)
        {
            _testBookingService = testBookingService;
        }
        [HttpGet("list-booking")]
        public async Task<ActionResult<IEnumerable<TestBooking>>> GetAllBookings()
        {
            var bookings = await _testBookingService.GetAllTestBookingsAsync();
            return Ok(bookings);
        }
        [HttpPost("add-booking")]
        public async Task<IActionResult> CreateBooking([FromBody] TestBookingDTO testBookingDto)
        {
            if (testBookingDto == null)
            {
                return BadRequest("Invalid booking data.");
            }
            await _testBookingService.AddTestBookingAsync(testBookingDto);
            return Ok(new { message = "Booking created successfully." });
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBooking(int id, [FromBody] EditTestBookingDTO testBookingDto)
        {
            if (testBookingDto == null)
            {
                return BadRequest("Invalid booking data.");
            }
            try
            {
                await _testBookingService.UpdateTestAsync(id, testBookingDto);
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
    }
}
