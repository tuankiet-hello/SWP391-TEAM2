namespace HealthCareAPI.DTOs
{
    public class EditProfileDTO
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string UserName { get; set; }
        public DateOnly DateOfBirth { get; set; }
    }
}
