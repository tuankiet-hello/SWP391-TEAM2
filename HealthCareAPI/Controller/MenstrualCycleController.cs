using HealthCareAPI.DTOs;
using HealthCareAPI.Entities;
using HealthCareAPI.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HealthCareAPI.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class MenstrualCycleController : ControllerBase
    {
        private readonly MenstrualCycleService _menstrualCycleService;
        public MenstrualCycleController(MenstrualCycleService menstrualCycleService)
        {
            _menstrualCycleService = menstrualCycleService;
        }
        [HttpGet("list-menstrual-cycle")]
        public async Task<ActionResult<IEnumerable<MenstrualCycle>>> GetAllMenstrualCycle()
        {
            var menstrualCycle = await _menstrualCycleService.GetAllMenstrualCycleAsync();
            return Ok(menstrualCycle);
        }
        [HttpGet("menstrual-cycle-by-account-id/{id}")]
        public async Task<IActionResult> GetByAccountID(string id)
        {
            if (!Guid.TryParse(id, out Guid accountId))
            {
                return BadRequest(new { message = "Invalid account ID format." });
            }

            var cycles = await _menstrualCycleService.GetMenstrualCycleByAccountIdAsync(accountId);

            if (cycles == null || !cycles.Any())
            {
                return NotFound(new { message = "No menstrual cycles found for this account." });
            }

            return Ok(cycles);
        }
        [HttpPost("add-menstrual-cycle")]
        public async Task<IActionResult> CreateMenstrualCycle([FromBody] MenstrualCycleDTO menstrualCycleDto)
        {
            if (menstrualCycleDto == null)
            {
                return BadRequest("Invalid menstrualCycle data.");
            }
            await _menstrualCycleService.AddMenstrualCycleAsync(menstrualCycleDto);
            return Ok(new { message = "menstrualCycle created successfully." });
        }

        [HttpPut("update-menstrual-cycle/{cycleID}")]
        public async Task<IActionResult> UpdateMenstrualCycle(int cycleID, [FromBody] MenstrualCycleDTO menstrualCycleDto)
        {
            if (menstrualCycleDto == null)
                return BadRequest("Invalid menstrualCycle data.");

            try
            {
                await _menstrualCycleService.UpdateMenstrualCycleAsync(cycleID, menstrualCycleDto);
                return Ok(new { message = "Menstrual cycle updated successfully." });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred.", detail = ex.Message });
            }
        }
        [HttpGet("predict/{accountId}")]
        public async Task<IActionResult> PredictCycle(Guid accountId)
        {
            try
            {
                var prediction = await _menstrualCycleService.PredictCycleAsync(accountId);
                return Ok(prediction);
            }
            catch (Exception ex)
            {
                // Nếu không đủ dữ liệu hoặc lỗi khác, trả về BadRequest kèm thông báo
                return BadRequest(new { message = ex.Message });
            }
        }

    }
}
