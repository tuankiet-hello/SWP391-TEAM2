using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HealthCareAPI.DTOs;
using HealthCareAPI.Entities;
using HealthCareAPI.Repositories;
using HealthCareAPI.Enum;

namespace HealthCareAPI.Services
{
    public class QuestionService
    {
        private readonly IUnitOfWork _unitOfWork;

        public QuestionService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<QuestionDTO>> GetAllQuestionsAsync()
        {
            var questions = await _unitOfWork.QuestionRepository.GetQuestionsWithAccountAsync();
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
        //     return await _unitOfWork.QuestionRepository.GetQuestionDetailAsync(questionId);
        // }
    }
}

