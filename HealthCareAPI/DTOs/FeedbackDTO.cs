using System;

namespace HealthCareAPI.DTOs
{
    public class FeedbackDTO
    {
        public int FeedbackID { get; set; }
        public Guid AccountID { get; set; }
        public string? Comment { get; set; }
        public int Rating { get; set; }
        public DateTime CreateAt { get; set; }
    }
} 