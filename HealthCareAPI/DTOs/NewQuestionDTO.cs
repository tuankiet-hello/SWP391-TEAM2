using System;
using HealthCareAPI.Enum;
using HealthCareAPI.DTOs;

namespace HealthCareAPI.DTOs
{
    public class NewQuestionDTO
    {
        public int QuestionID { get; set; }
        public Guid AccountID { get; set; }
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public StatusType Status { get; set; }// hoặc StatusType nếu muốn giữ enum
        public DateTime CreatedAt { get; set; }
    }
}
