using System;
using HealthCareAPI.Enum;

namespace HealthCareAPI.DTOs
{
    public class MenstrualCycleDTO
    {
        public int CycleID { get; set; }
        public Guid AccountID { get; set; }
        public DateOnly Start_date { get; set; }
        public DateOnly End_date { get; set; }
        public Reminder Reminder_enabled { get; set; }
        public string? Note { get; set; }
    }
} 