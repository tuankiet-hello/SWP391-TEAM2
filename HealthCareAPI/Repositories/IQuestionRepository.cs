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
        Task<IEnumerable<Question>> GetQuestionsByAccountIdAsync(Guid accountId);

        // Task<QuestionDTO?> GetQuestionDetailAsync(int questionId);
    }
}