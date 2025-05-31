using System;

namespace HealthCareAPI.DTOs
{
    public class AppoinmentDTO
    {
        public int AppointmentID { get; set; }
        public Guid AccountID { get; set; }
        public DateOnly AppointmentDate { get; set; }
        public TimeOnly AppointmentTime { get; set; }
        public bool Status { get; set; }
    }
} 