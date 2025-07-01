using HealthCareAPI.DTOs;
using HealthCareAPI.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using HealthCareAPI.Services;

namespace HealthCareAPI.Controller
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly RoleManager<IdentityRole<Guid>> _roleManager;
        private readonly UserManager<Account> _userManager;
        private readonly SignInManager<Account> _signInManager;
        private readonly IConfiguration _configuration;
        private readonly EmailService _emailService;

        public AuthController(UserManager<Account> userManager,
                       SignInManager<Account> signInManager,
                       IConfiguration configuration,
                       RoleManager<IdentityRole<Guid>> roleManager,
                       EmailService emailService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _roleManager = roleManager;
            _emailService = emailService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO dto)
        {
            Account user = null;
            if (dto.UsernameOrEmail.Contains("@"))
                user = await _userManager.FindByEmailAsync(dto.UsernameOrEmail);
            else
                user = await _userManager.FindByNameAsync(dto.UsernameOrEmail);

            if (user == null)
                return Unauthorized("Invalid username/email");

            // Kiểm tra password trước
            var validPassword = await _userManager.CheckPasswordAsync(user, dto.Password);

            // Nếu password đúng nhưng email chưa xác nhận
            if (validPassword && !user.EmailConfirmed)
                return Unauthorized("You need to confirm your email before Login.");

            // Nếu password sai
            if (!validPassword)
                return Unauthorized("Invalid password");

            // Nếu mọi thứ hợp lệ, login thành công
            var token = await GenerateJwtToken(user);
            return Ok(new { token });
        }



        private async Task<string> GenerateJwtToken(Account user)
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            var roles = await _userManager.GetRolesAsync(user);
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName ?? ""),
                new Claim(JwtRegisteredClaimNames.Email, user.Email ?? ""),
            };
            //gen jwt thêm phần key:value của role nè, tí decode ra mới có role để phân quyền
            foreach (var role in roles)
            {
                claims.Add(new Claim("role", role));
            }
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: creds
            );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDTO dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null)
                return BadRequest("Email không tồn tại");

            var fullName = $"{user?.FirstName ?? ""} {user?.LastName ?? ""}".Trim();
            if (string.IsNullOrWhiteSpace(fullName))
            {
                fullName = user?.UserName ?? "";
            }
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var encodedToken = System.Net.WebUtility.UrlEncode(token);

            // Link frontend sẽ xử lý: ví dụ trang reset password ở FE là /reset-password

            var resetLink = $"{_configuration["ClientUrl"]}/reset-password?email={user.Email}&token={encodedToken}";
            var emailBody = $@"
                    <div style='max-width:500px;margin:40px auto;padding:32px 24px;background:#222;border-radius:12px;color:#eee;font-family:sans-serif;box-shadow:0 2px 8px rgba(0,0,0,0.1);'>
                      <h2 style='text-align:center;margin-bottom:24px;'>Welcome to <b>Health Care System!</b></h2>
                      <p>Dear <b>{fullName}</b>,</p>
                      <p>Thank you for registering an account with <b>Health Care System</b>.</p>
                      <p>Please click the button below to reset your password:</p>
                      <div style='text-align:center;margin:32px 0;'>
                        <a href='{resetLink}' style='background:#4FC3F7;color:#222;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:18px;display:inline-block;'>Reset password</a>
                      </div>
                      <p style='margin-top:32px;'>After resetting your password you can log in and use all the features of Health Care System.</p>
                      <hr style='margin:32px 0;border:none;border-top:1px solid #444;'/>
                      <p style='font-size:13px;color:#aaa;text-align:center;'>This email was sent automatically, please do not reply.</p>
                    </div>
                    ";
            try
            {
                await _emailService.SendEmailAsync(user.Email, "Confirm password reset - Health Care System", emailBody);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Email không tồn tại hoặc không gửi được. Vui lòng nhập lại email hợp lệ." });
            }

            return Ok(new { message = "Password reset link sent via email.", token });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDTO dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            var decodeToken = WebUtility.HtmlDecode(dto.Token);
            if (user == null)
                return BadRequest("Email không tồn tại");

            var result = await _userManager.ResetPasswordAsync(user, decodeToken, dto.NewPassword);
            if (result.Succeeded)
                return Ok(new { message = "Đặt lại mật khẩu thành công!" });
            return BadRequest(result.Errors);
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            // await _signInManager.SignOutAsync(); do dùng jwt nên tạm thười ko cần
            return Ok(new { message = "Đăng xuất thành công!" });
        }

        [HttpPut("edit-profile")]
        public async Task<IActionResult> EditProfile([FromBody] EditProfileDTO dto)
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized();

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return NotFound("User không tồn tại");
            user.Email = dto.Email;
            user.UserName = dto.UserName;
            user.FirstName = dto.FirstName;
            user.LastName = dto.LastName;
            user.DateOfBirth = dto.DateOfBirth;

            var result = await _userManager.UpdateAsync(user);
            if (result.Succeeded)
                return Ok(new { message = "Cập nhật thông tin thành công!" });
            return BadRequest(result.Errors);
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterAccountDTO dto)
        {
            // 1. Validate dữ liệu đầu vào
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values
                                       .SelectMany(v => v.Errors)
                                       .Select(e => e.ErrorMessage);
                return BadRequest(new { message = "Dữ liệu không hợp lệ", errors });
            }

            // 2. Kiểm tra username đã tồn tại chưa
            var existingUser = await _userManager.FindByNameAsync(dto.UserName);
            if (existingUser != null)
            {
                return BadRequest(new { message = "Username đã tồn tại" });
            }

            // 3. Kiểm tra email đã tồn tại chưa
            var existingEmail = await _userManager.FindByEmailAsync(dto.Email);
            if (existingEmail != null)
            {
                return BadRequest(new { message = "Email đã tồn tại" });
            }

            // 4. Tạo user mới (để password hash do UserManager xử lý)
            var user = new Account
            {
                UserName = dto.UserName,
                Email = dto.Email,
                CreatedAt = DateTime.UtcNow
            };

            var result = await _userManager.CreateAsync(user, dto.Password);

            if (result.Succeeded)
            {
                // 5. Gán role Customer mặc định
                if (!await _roleManager.RoleExistsAsync("Customer"))
                {
                    await _roleManager.CreateAsync(new IdentityRole<Guid>("Customer"));
                }
                await _userManager.AddToRoleAsync(user, "Customer");

                // 6. Tạo token xác nhận email
                var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                var encodedToken = System.Net.WebUtility.UrlEncode(token);

                var confirmationLink = $"{_configuration["ClientUrl"]}/confirm-email?email={user.Email}&token={encodedToken}";
                var emailBody = $@"
                    <div style='max-width:500px;margin:40px auto;padding:32px 24px;background:#222;border-radius:12px;color:#eee;font-family:sans-serif;box-shadow:0 2px 8px rgba(0,0,0,0.1);'>
                      <h2 style='text-align:center;margin-bottom:24px;'>Welcome to <b>Health Care System!</b></h2>
                      <p>Dear <b>{dto.UserName}</b>,</p>
                      <p>Thank you for registering an account with <b>Health Care System</b>.</p>
                      <p>Please click the button below to verify your email address:</p>
                      <div style='text-align:center;margin:32px 0;'>
                        <a href='{confirmationLink}' style='background:#4FC3F7;color:#222;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:18px;display:inline-block;'>Confirm email</a>
                      </div>
                      <p style='margin-top:32px;'>After verification, you can log in and use all features of the Health Care System.</p>
                      <hr style='margin:32px 0;border:none;border-top:1px solid #444;'/>
                      <p style='font-size:13px;color:#aaa;text-align:center;'>This email was sent automatically. Please do not reply.</p>
                    </div>
                    ";
                try
                {
                    await _emailService.SendEmailAsync(user.Email, "Confirm account registration - Health Care System", emailBody);
                }
                catch (Exception ex)
                {
                    await _userManager.DeleteAsync(user); // Xóa user nếu gửi mail thất bại
                    return BadRequest(new { message = "Email does not exist or could not be sent. Please re-enter a valid email." });
                }

                return Ok(new { message = "Registration successful! Please check your email for confirmation." });
            }

            // Trả lỗi nếu tạo user thất bại
            return BadRequest(result.Errors);
        }

        [HttpGet("confirm-email")]
        public async Task<IActionResult> ConfirmEmail(string email, string token)
        {
            var user = await _userManager.FindByEmailAsync(email.ToString());
            if (user == null)
                return BadRequest(new { message = "User does not exist." });

            //  var decodedToken =System.Net.WebUtility.UrlDecode(token);
             //không cần decode nữa vì ConfirmEmailAsync tự decode r 

            var result = await _userManager.ConfirmEmailAsync(user, token);
            if (result.Succeeded)
                return Ok(new { message = "Account has been successfully verified." });

            // Log chi tiết lỗi
            return BadRequest(new { message = "Token is invalid or expired.", errors = result.Errors}); 
        }

        [HttpPost("resend-confirm-email")]
        public async Task<IActionResult> ResendConfirmEmail([FromBody] ForgotPasswordDTO dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null)
                return BadRequest(new { message = "Email không tồn tại." });
            if (user.EmailConfirmed)
                return BadRequest(new { message = "Email đã được xác nhận." });

            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var encodedToken = System.Net.WebUtility.UrlEncode(token);
            var confirmationLink = $"{_configuration["ClientUrl"]}/confirm-email?email={user.Email}&token={encodedToken}";
            var emailBody = $@"
                    <div style='max-width:500px;margin:40px auto;padding:32px 24px;background:#222;border-radius:12px;color:#eee;font-family:sans-serif;box-shadow:0 2px 8px rgba(0,0,0,0.1);'>
                    <h2 style='text-align:center;margin-bottom:24px;'>Welcome to <b>Health Care System!</b></h2>
                    <p>Dear <b>{user.UserName},</p>
                    <p>You have just requested to resend your account confirmation email at <b>Health Care System</b>.</p>
                    <p>Please click the button below to confirm your email address:</p>
                    <div style='text-align:center;margin:32px 0;'>
                        <a href='{confirmationLink}' style='background:#4FC3F7;color:#222;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:18px;display:inline-block;'>Confirm email</a>
                    </div>
                    <p style='margin-top:32px;'>After verification, you can log in and use all features of the Health Care System.</p>
                    <hr style='margin:32px 0;border:none;border-top:1px solid #444;'/>
                    <p style='font-size:13px;color:#aaa;text-align:center;'>This email was sent automatically, please do not reply.</p>
                    </div>
                    ";
            try
            {
                Console.WriteLine(token);
                await _emailService.SendEmailAsync(user.Email, "Resend account registration confirmation - Health Care System", emailBody);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Email không tồn tại hoặc không gửi được. Vui lòng nhập lại email hợp lệ." });
            }
            return Ok(new { message = "Confirmation email resent. Please check your email." });
        }
        [HttpGet("user-profile")]
        public async Task<IActionResult> GetUserProfile()
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized();

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return NotFound("User không tồn tại");

            return Ok(new
            {
                user.UserName,   // phải có trường này
                user.Email,      // phải có trường này
                user.FirstName,
                user.LastName,
                user.DateOfBirth
            });

        }
        [HttpGet("check-username")]
        public async Task<IActionResult> CheckUserName(string username)
        {
            var user = await _userManager.FindByNameAsync(username);
            return Ok(new { exists = user != null });
        }

        [HttpGet("check-email")]
public async Task<IActionResult> CheckEmail(string email)
{
    var user = await _userManager.FindByEmailAsync(email);
    return Ok(new { exists = user != null });
}


    }
} 