using HealthCareAPI.DTOs;
using HealthCareAPI.Entities;
using HealthCareAPI.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace HealthCareAPI.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : ControllerBase
    {
        private readonly TestService _testService;

        public TestController(TestService testService)
        {
            _testService = testService;
        }

        [HttpGet("list-test")]
        public async Task<ActionResult<IEnumerable<Test>>> GetAll()
        {
            var tests = await _testService.GetAllTestsAsync();
            return Ok(tests);
        }

        [HttpPost("add-test")]
        public async Task<IActionResult> Create(TestsDTO test)
        {
            await _testService.AddTestAsync(test);
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditTest(int id, [FromBody] TestsDTO tests)
        {
            try
            {
                await _testService.UpdateTestAsync(id,tests);
                return Ok(new { message = "Test updated successfully" });
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
        [HttpPatch("{id}/ban")]
        public async Task<IActionResult> DeleteTest(int id)
        {
            try
            {
                await _testService.DeletedTestAsync(id);
                return Ok(new { message = "Test edit to not active successfully" });
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }
    }
}
