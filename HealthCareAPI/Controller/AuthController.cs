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
                return Unauthorized("Invalid username/email");  // Riêng biệt

            var result = await _signInManager.CheckPasswordSignInAsync(user, dto.Password, false);
            if (!result.Succeeded)
                return Unauthorized("Invalid password");  // Riêng biệt

            var token = await GenerateJwtToken(user);
            return Ok(new { token });
        }

        private async Task<string> GenerateJwtToken(Account user)
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName ?? ""),
                new Claim(JwtRegisteredClaimNames.Email, user.Email ?? ""),
            };
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

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var encodedToken = System.Net.WebUtility.UrlEncode(token);

            // Link frontend sẽ xử lý: ví dụ trang reset password ở FE là /reset-password

            var resetLink = $"{_configuration["ClientUrl"]}/reset-password?email={user.Email}&token={encodedToken}";
            var emailBody = $@"
                    <div style='max-width:500px;margin:40px auto;padding:32px 24px;background:#222;border-radius:12px;color:#eee;font-family:sans-serif;box-shadow:0 2px 8px rgba(0,0,0,0.1);'>
                      <h2 style='text-align:center;margin-bottom:24px;'>Chào mừng đến với <b>Health Care System!</b></h2>
                      <p>Xin chào,</p>
                      <p>Cảm ơn bạn đã đăng ký tài khoản tại <b>Health Care System</b>.</p>
                      <p>Vui lòng nhấp vào nút bên dưới để thay đổi mật khẩu của bạn:</p>
                      <div style='text-align:center;margin:32px 0;'>
                        <a href='{resetLink}' style='background:#4FC3F7;color:#222;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:18px;display:inline-block;'>Xác nhận email</a>
                      </div>
                      <p style='margin-top:32px;'>Sau khi đặt lại mật khẩu bạn có thể đăng nhập và sử dụng đầy đủ các tính năng của Health Care System.</p>
                      <hr style='margin:32px 0;border:none;border-top:1px solid #444;'/>
                      <p style='font-size:13px;color:#aaa;text-align:center;'>Email này được gửi tự động, vui lòng không trả lời.</p>
                    </div>
                    ";
            try
            {
                await _emailService.SendEmailAsync(user.Email, "Xác nhận đặt lại mật khẩu - Health Care System", emailBody);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Email không tồn tại hoặc không gửi được. Vui lòng nhập lại email hợp lệ." });
            }

            return Ok(new { message = "Đã gửi đường dẫn đặt lại mật khẩu qua email.", token });
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
                      <h2 style='text-align:center;margin-bottom:24px;'>Chào mừng đến với <b>Health Care System!</b></h2>
                      <p>Xin chào,</p>
                      <p>Cảm ơn bạn đã đăng ký tài khoản tại <b>Health Care System</b>.</p>
                      <p>Vui lòng nhấp vào nút bên dưới để xác nhận địa chỉ email của bạn:</p>
                      <div style='text-align:center;margin:32px 0;'>
                        <a href='{confirmationLink}' style='background:#4FC3F7;color:#222;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:18px;display:inline-block;'>Xác nhận email</a>
                      </div>
                      <p style='margin-top:32px;'>Sau khi xác nhận, bạn có thể đăng nhập và sử dụng đầy đủ các tính năng của Health Care System.</p>
                      <hr style='margin:32px 0;border:none;border-top:1px solid #444;'/>
                      <p style='font-size:13px;color:#aaa;text-align:center;'>Email này được gửi tự động, vui lòng không trả lời.</p>
                    </div>
                    ";
                try
                {
                    await _emailService.SendEmailAsync(user.Email, "Xác nhận đăng ký tài khoản - Health Care System", emailBody);
                }
                catch (Exception ex)
                {
                    await _userManager.DeleteAsync(user); // Xóa user nếu gửi mail thất bại
                    return BadRequest(new { message = "Email không tồn tại hoặc không gửi được. Vui lòng nhập lại email hợp lệ." });
                }

                return Ok(new { message = "Đăng ký thành công! Vui lòng kiểm tra email để xác nhận." });
            }

            // Trả lỗi nếu tạo user thất bại
            return BadRequest(result.Errors);
        }

        [HttpGet("confirm-email")]
        public async Task<IActionResult> ConfirmEmail(string email, string token)
        {
            var user = await _userManager.FindByEmailAsync(email.ToString());
            if (user == null)
                return BadRequest(new { message = "Người dùng không tồn tại." });

            //  var decodedToken =System.Net.WebUtility.UrlDecode(token);
             //không cần decode nữa vì ConfirmEmailAsync tự decode r 

            var result = await _userManager.ConfirmEmailAsync(user, token);
            if (result.Succeeded)
                return Ok(new { message = "Tài khoản đã được xác thực thành công." });

            // Log chi tiết lỗi
            return BadRequest(new { message = "Token không hợp lệ hoặc đã hết hạn.", errors = result.Errors}); 
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
  <h2 style='text-align:center;margin-bottom:24px;'>Chào mừng đến với <b>Health Care System!</b></h2>
  <p>Xin chào,</p>
  <p>Bạn vừa yêu cầu gửi lại email xác nhận tài khoản tại <b>Health Care System</b>.</p>
  <p>Vui lòng nhấp vào nút bên dưới để xác nhận địa chỉ email của bạn:</p>
  <div style='text-align:center;margin:32px 0;'>
    <a href='{confirmationLink}' style='background:#4FC3F7;color:#222;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:18px;display:inline-block;'>Xác nhận email</a>
  </div>
  <p style='margin-top:32px;'>Sau khi xác nhận, bạn có thể đăng nhập và sử dụng đầy đủ các tính năng của Health Care System.</p>
  <hr style='margin:32px 0;border:none;border-top:1px solid #444;'/>
  <p style='font-size:13px;color:#aaa;text-align:center;'>Email này được gửi tự động, vui lòng không trả lời.</p>
</div>
";
            try
            {
                Console.WriteLine(token);
                await _emailService.SendEmailAsync(user.Email, "Gửi lại xác nhận đăng ký tài khoản - Health Care System", emailBody);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Email không tồn tại hoặc không gửi được. Vui lòng nhập lại email hợp lệ." });
            }
            return Ok(new { message = "Đã gửi lại email xác nhận. Vui lòng kiểm tra hộp thư." });
        }

    }
} 