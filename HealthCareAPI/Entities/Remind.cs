using System.ComponentModel.DataAnnotations.Schema;

namespace HealthCareAPI.Entities
{
    public class Remind
    {
        public int RemindID { get; set; }
        public Guid AccountID { get; set; }
        public DateOnly PredictedStartDate { get; set; }
        public DateOnly PredictedOvulationDate { get; set; }
        public DateOnly FertileWindowStart { get; set; }
        public DateOnly FertileWindowEnd { get; set; }
        public bool IsSent { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey(nameof(AccountID))]
        public Account Account { get; set; } = null!;
    }
}
