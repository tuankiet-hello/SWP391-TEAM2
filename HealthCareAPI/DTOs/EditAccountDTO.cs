public class EditAccountDTO

{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string UserName { get; set; }
    public DateOnly DateOfBirth { get; set; }
    public string Roles { get; set; }
    public bool EmailConfirmed { get; set; }
    public string AccountStatus { get; set; } // Hoặc dùng enum nếu có
    public bool Gender { get; set; }
}
