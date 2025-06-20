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

        public AppoinmentController(AppoinmentService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _service.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _service.GetByIdAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create(AppoinmentDTO dto)
        {
            await _service.AddAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = dto.AppointmentID }, dto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, AppoinmentDTO dto)
        {
            if (id != dto.AppointmentID) return BadRequest();
            await _service.UpdateAsync(dto);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }

        // [HttpGet("by-date/{date}")]
        [HttpGet("by-date")]
        public async Task<IActionResult> GetByDate([FromQuery] DateOnly date)
        {
            var result = await _service.GetAppointmentsByDateAsync(date);
            return Ok(result);
        }

        [HttpGet("by-week")]
        public async Task<IActionResult> GetByWeek([FromQuery] DateOnly startDate, [FromQuery] DateOnly endDate)
        {
            var result = await _service.GetAppointmentsByWeekAsync(startDate, endDate);
            return Ok(result);
        }
    }

}