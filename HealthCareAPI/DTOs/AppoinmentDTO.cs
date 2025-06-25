using System;
using HealthCareAPI.Enum;
using HealthCareAPI.DTOs;

namespace HealthCareAPI.DTOs
{
    public class AppoinmentDTO
    {
        public int AppointmentID { get; set; }
        public Guid AccountID { get; set; }
        public DateOnly AppointmentDate { get; set; }
        public TimeOnly AppointmentTime { get; set; }
        public StatusType Status { get; set; }
        public AccountViewDTO Account { get; set; }
    }
} 