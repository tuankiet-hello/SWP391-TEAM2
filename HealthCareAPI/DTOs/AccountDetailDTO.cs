public class AccountDetailDTO
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string UserName { get; set; }
    public DateOnly DateOfBirth { get; set; }
    public List<string> Roles { get; set; }
    public bool EmailConfirmed { get; set; }
    public string AccountStatus { get; set; } // Hoặc dùng enum nếu có

    public AccountDetailDTO()
    {
        Roles = new List<string>();
    }
}
