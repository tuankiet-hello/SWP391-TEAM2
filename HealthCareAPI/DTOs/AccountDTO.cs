namespace HealthCareAPI.DTOs
{
    public class AccountDTO
    {
        public Guid Id { get; set; }  // IdentityUser<Guid> dùng Guid làm key
        public string UserName { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateOnly DateOfBirth { get; set; }
    }
}
