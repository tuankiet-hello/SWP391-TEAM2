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

        public async Task<bool> UpdateQuestionAsync(int id, QuestionDTO dto)
        {
            var question = await _unitOfWork.QuestionRepository.GetByIdAsync(id);
            if (question == null) return false;

            // Cập nhật các trường (tùy ý, có thể kiểm tra null hoặc cập nhật tất cả)
            question.Title = dto.Title;
            question.Description = dto.Description;
            question.Status = dto.Status;
            question.Answer = dto.Answer;
            question.UpdatedAt = DateTime.UtcNow;

            // Nếu muốn update các trường khác, bổ sung tại đây

            _unitOfWork.QuestionRepository.Update(question);
            await _unitOfWork.CompleteAsync();
            return true;
        }

        public async Task<NewQuestionDTO> CreateQuestionAsync(NewQuestionDTO dto)
        {
            var entity = new Question
            {
                AccountID = dto.AccountID,
                Title = dto.Title,
                Description = dto.Description,
                Status = StatusType.Submitted,
                CreatedAt = DateTime.UtcNow
            };

            await _unitOfWork.QuestionRepository.AddAsync(entity);
            await _unitOfWork.CompleteAsync();

            dto.QuestionID = entity.QuestionID;
            dto.Status = entity.Status;
            dto.CreatedAt = entity.CreatedAt;
            return dto;
        }
    }
}

