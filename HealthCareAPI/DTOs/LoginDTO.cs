﻿using System.ComponentModel.DataAnnotations;

namespace HealthCareAPI.DTOs
{
    public class LoginDTO
    {
        [Required]
        public string UsernameOrEmail { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
