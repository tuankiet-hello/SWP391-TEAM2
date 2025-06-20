using System;
using HealthCareAPI.Enum;

namespace HealthCareAPI.DTOs
{
    public class EditTestBookingDTO
    {
        //public int BookingID { get; set; }
        //public Guid AccountID { get; set; }
        public int TestID { get; set; }
        public string Result { get; set; }
        public DateOnly BookingDate { get; set; }
        public TimeOnly BookingTime { get; set; }
        public StatusType Status { get; set; }
    }
} 