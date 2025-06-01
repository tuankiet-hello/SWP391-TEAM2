using System.ComponentModel.DataAnnotations;

namespace HealthCareAPI.DTOs
{
    public class RegisterAccountDTO
    {
        [Required(ErrorMessage = "Tên đăng nhập là bắt buộc")]
        public string UserName { get; set; }

        [Required(ErrorMessage = "Email là bắt buộc")]
        [EmailAddress(ErrorMessage = "Email không hợp lệ")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Mật khẩu là bắt buộc")]
        [MinLength(6, ErrorMessage = "Mật khẩu phải ít nhất 6 ký tự")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Xác nhận mật khẩu là bắt buộc")]
        [Compare("Password", ErrorMessage = "Mật khẩu xác nhận không khớp")]
        public string ConfirmPassword { get; set; }

        [Required(ErrorMessage = "Họ là bắt buộc")]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "Tên là bắt buộc")]
        public string LastName { get; set; }

        [Required(ErrorMessage = "Ngày sinh là bắt buộc")]
        public DateOnly DateOfBirth { get; set; }
    }
}
