using System;
using HealthCareAPI.Enum;
using HealthCareAPI.DTOs;

namespace HealthCareAPI.DTOs
{
    public class QuestionDTO
    {
        public int QuestionID { get; set; }
        public Guid AccountID { get; set; }
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string Status { get; set; } = null!; // hoặc StatusType nếu muốn giữ enum
        public DateTime CreatedAt { get; set; }
        public string? Answer { get; set; }
        public DateTime? UpdatedAt { get; set; }

        // Thông tin tài khoản liên quan (view only)
        public AccountViewDTO Account { get; set; } = null!;
    }
}
