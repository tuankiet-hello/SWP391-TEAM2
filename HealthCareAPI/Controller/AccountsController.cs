using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// Nếu dùng IdentityRole<Guid> thì cần thêm
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

// Nếu dùng Account là class kế thừa IdentityUser<Guid>
using HealthCareAPI.Entities; // <-- nơi chứa class Account

// Nếu có dùng DTO như AccountDTO, AccountTableDTO,...
using HealthCareAPI.DTOs;
namespace HealthCareAPI.Controller
{

    [ApiController]
    [Route("api/[controller]")]
    public class AccountsController : ControllerBase
    {
        private static List<Account> accounts = new List<Account>();
        private readonly UserManager<Account> _userManager;
        private readonly RoleManager<IdentityRole<Guid>> _roleManager;

        public AccountsController(
            UserManager<Account> userManager,
            RoleManager<IdentityRole<Guid>> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        [HttpGet("list-users")]
        public async Task<ActionResult<IEnumerable<AccountTableDTO>>> GetUserList()
        {
            var users = await _userManager.Users.ToListAsync();
            var result = new List<AccountTableDTO>();
            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                result.Add(new AccountTableDTO
                {
                    Id = user.Id,
                    FullName = $"{user.FirstName} {user.LastName}",
                    Email = user.Email,
                    Role = roles.FirstOrDefault() ?? "Customer",
                    EmailConfirmed = user.EmailConfirmed,
                    AccountStatus = user.LockoutEnd == null ? "Active" : "Inactive"
                });
            }
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AccountDetailDTO>> GetUserById(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound();
            var roles = await _userManager.GetRolesAsync(user);
            var dto = new AccountDetailDTO
            {
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                UserName = user.UserName,
                DateOfBirth = user.DateOfBirth,
                Roles = roles.FirstOrDefault(),
                EmailConfirmed = user.EmailConfirmed,
                AccountStatus = user.LockoutEnd == null ? "Active" : "Inactive" // Tuỳ thuộc vào logic của bạn
            };
            return Ok(dto);
        }
        [HttpPut("{id}")]
        public async Task<ActionResult<EditAccountDTO>> EditUserByID(string id, [FromBody] EditAccountDTO dto)
        {
            //tìm user theo id
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound();
            //set lại các inf theo dto cập nhật từ body req
            user.FirstName = dto.FirstName;
            user.LastName = dto.LastName;
            user.Email = dto.Email;
            user.UserName = dto.UserName;
            user.DateOfBirth = dto.DateOfBirth;
            user.EmailConfirmed = dto.EmailConfirmed;

            // Cập nhật trạng thái tài khoản
            if (dto.AccountStatus == "Inactive")
                user.LockoutEnd = DateTimeOffset.UtcNow.AddYears(100);
            else
                user.LockoutEnd = null;

            // Xử lý role: Xóa hết role cũ, gán role mới
            var currentRoles = await _userManager.GetRolesAsync(user);
            if (currentRoles.Any())
                await _userManager.RemoveFromRolesAsync(user, currentRoles);

            if (!string.IsNullOrEmpty(dto.Roles))
                await _userManager.AddToRoleAsync(user, dto.Roles);

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok(dto);
        }


        [HttpPost("create-user")]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserDTO dto)
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
                EmailConfirmed = true,
                CreatedAt = DateTime.UtcNow
            };

            var result = await _userManager.CreateAsync(user, dto.Password);

            if (result.Succeeded)
            {

                await _userManager.AddToRoleAsync(user, dto.Role);
                return Ok(new { message = "Create User Successfully!" });
            }

            // Trả lỗi nếu tạo user thất bại
            return BadRequest(result.Errors);
        }

        // [Authorize(Role = "Admin")]
        [HttpPatch("{id}/ban")]
        public async Task<IActionResult> BanUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound();

            // Bắt buộc set cả 2 thuộc tính
            if (user.LockoutEnabled == true)
            {
                user.LockoutEnd = DateTimeOffset.UtcNow.AddYears(100);
                user.LockoutEnabled = false;
            }else return BadRequest(new { message = "Tài khoản đã bị khóa" });
            
            
            var result = await _userManager.UpdateAsync(user);
            
            return result.Succeeded 
                ? Ok(new { message = "Đã khóa tài khoản thành công" })
                : BadRequest(result.Errors);
        }

        // [Authorize(Role = "Admin")]
        [HttpPatch("{id}/unban")]
        public async Task<IActionResult> UnbanUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null) return NotFound();

            // Reset cả 2 thuộc tính
            if (user.LockoutEnabled == false)
            {
                user.LockoutEnabled = true;
                user.LockoutEnd = null;
            }else return BadRequest(new { message = "Tài khoản chưa bị khóa" });
            
            var result = await _userManager.UpdateAsync(user);
            
            return result.Succeeded 
                ? Ok(new { message = "Đã mở khóa tài khoản" })
                : BadRequest(result.Errors);
        }

    }
}

