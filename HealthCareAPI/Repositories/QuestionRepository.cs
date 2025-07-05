using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using HealthCareAPI.DTOs;
using HealthCareAPI.Entities;
using HealthCareAPI.Enum;

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
                Status = q.Status,
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

        // public async Task<QuestionDTO?> GetQuestionDetailAsync(int questionId)
        // {
        //     var question = await _dbSet
        //         .Include(q => q.Account)
        //         .FirstOrDefaultAsync(q => q.QuestionID == questionId);

        //     if (question == null) return null;

        //     return new QuestionDTO
        //     {
        //         QuestionID = question.QuestionID,
        //         AccountID = question.AccountID,
        //         Title = question.Title,
        //         Description = question.Description,
        //         Status = question.Status, // enum
        //         CreatedAt = question.CreatedAt,
        //         UpdatedAt = question.UpdatedAt,
        //         Answer = question.Answer,
        //         Account = new AccountViewDTO
        //         {
        //             FirstName = question.Account.FirstName,
        //             LastName = question.Account.LastName,
        //             DateOfBirth = question.Account.DateOfBirth,
        //             Email = question.Account.Email
        //         }
        //     };
        // }

    }
}