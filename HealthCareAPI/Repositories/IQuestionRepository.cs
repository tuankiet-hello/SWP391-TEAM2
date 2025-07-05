using System.Collections.Generic;
using System.Threading.Tasks;
using HealthCareAPI.DTOs;
using HealthCareAPI.Entities;

namespace HealthCareAPI.Repositories
{
    public interface IQuestionRepository : IGenericRepository<Question>
    {
        Task<IEnumerable<Question>> GetQuestionsWithAccountAsync();
        Task<IEnumerable<QuestionDTO>> GetAllQuestionsAsync();
        // Task<QuestionDTO?> GetQuestionDetailAsync(int questionId);
    }
}