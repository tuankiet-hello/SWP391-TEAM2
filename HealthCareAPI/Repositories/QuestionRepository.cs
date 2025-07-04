using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using HealthCareAPI.DTOs;
using HealthCareAPI.Entities;

namespace HealthCareAPI.Repositories
{
    public class QuestionRepository : GenericRepository<Question>, IQuestionRepository
    {
        public QuestionRepository(ApplicationDbContext context) : base(context) { }

        public async Task<IEnumerable<Question>> GetQuestionsWithAccountAsync()
        {
            return await _dbSet.Include(q => q.Account).ToListAsync();
        }

        public async Task<IEnumerable<QuestionDTO>> GetAllQuestionsAsync()
    {
            var questions = await _dbSet.Include(q => q.Account).ToListAsync();
            return questions.Select(q => new QuestionDTO
            {
                QuestionID = q.QuestionID,
                AccountID = q.AccountID,
                Title = q.Title,
                Description = q.Description,
                Status = q.Status.ToString(),
                CreatedAt = q.CreatedAt,
                UpdatedAt = q.UpdatedAt,
                Answer = q.Answer,
                Account = new AccountViewDTO
                {
                    FirstName = q.Account.FirstName,
                    LastName = q.Account.LastName,
                    DateOfBirth = q.Account.DateOfBirth,
                    Email = q.Account.Email
                }
            });
        }

    }
}