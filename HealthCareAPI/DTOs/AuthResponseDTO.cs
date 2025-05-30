namespace HealthCareAPI.DTOs
{
    public class AuthResponseDTO
    {
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }  
        public AccountDTO User { get; set; }
    }
}
