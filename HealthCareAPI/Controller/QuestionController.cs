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
        private readonly QuestionService _questionService;

        public QuestionController(QuestionService questionService)
        {
            _questionService = questionService;
        }

        [HttpGet]
        public async Task<IActionResult> GetQuestions()
        {
            var questions = await _questionService.GetAllQuestionsAsync();
            return Ok(questions);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateQuestion(int id, [FromBody] QuestionDTO dto)
        {
            var result = await _questionService.UpdateQuestionAsync(id, dto);
            if (!result)
                return NotFound(new { message = "Question not found" });

            return Ok(new { message = "Question updated successfully" });
        }
    }
}