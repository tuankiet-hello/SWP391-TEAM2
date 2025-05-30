using System.ComponentModel.DataAnnotations;

namespace HealthCareAPI.DTOs
{
    public class ForgotPasswordDTO
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}
