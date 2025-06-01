namespace HealthCareAPI.DTOs
{
    public class EditProfileDTO
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateOnly DateOfBirth { get; set; }
    }
}
