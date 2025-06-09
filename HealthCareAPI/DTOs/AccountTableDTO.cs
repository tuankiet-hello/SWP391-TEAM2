public class AccountTableDTO
{
    public Guid Id { get; set; }
    public string FullName { get; set; }         // FirstName + LastName
    public string Email { get; set; }
    public string Role { get; set; }
    public bool EmailConfirmed { get; set; }
    public string AccountStatus { get; set; }    // "Active" / "Locked"
}
