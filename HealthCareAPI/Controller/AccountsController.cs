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
        public async Task<ActionResult<AccountDetailDTO>> GetUserById( string id)
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
                Roles = roles.ToList(),
                EmailConfirmed = user.EmailConfirmed,
                AccountStatus = user.LockoutEnd == null ? "Active" : "Inactive" // Tuỳ thuộc vào logic của bạn
            };
            return Ok(dto);
        }

    }
}

