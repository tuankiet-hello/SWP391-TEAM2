using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;
using System.Threading.Tasks;
using HealthCareAPI.Entities;

namespace HealthCareAPI.data
{
    public static class SeedData
    {
        public static async Task InitializeAsync(IServiceProvider serviceProvider)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
            var userManager = serviceProvider.GetRequiredService<UserManager<Account>>();

            // Roles
            var roles = new[] { "admin", "staff", "consultant", "manager", "customer" };
            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole<Guid> { Name = role, NormalizedName = role.ToUpper() });
                }
            }

            // Users
            await CreateUserAsync(userManager, "admin", "admin@example.com", "Admin@123", "Admin", "User", new DateOnly(1990, 1, 1), "admin");
            await CreateUserAsync(userManager, "staff", "staff@example.com", "Staff@123", "Staff", "User", new DateOnly(1991, 2, 2), "staff");
            await CreateUserAsync(userManager, "consultant", "consultant@example.com", "Consultant@123", "Consultant", "User", new DateOnly(1992, 3, 3), "consultant");
            await CreateUserAsync(userManager, "manager", "manager@example.com", "Manager@123", "Manager", "User", new DateOnly(1993, 4, 4), "manager");
            await CreateUserAsync(userManager, "customer", "customer@example.com", "Customer@123", "Customer", "User", new DateOnly(1994, 5, 5), "customer");
        }

        private static async Task CreateUserAsync(UserManager<Account> userManager, string username, string email, string password, string firstName, string lastName, DateOnly dob, string role)
        {
            if (await userManager.FindByNameAsync(username) == null)
            {
                var user = new Account
                {
                    UserName = username,
                    Email = email,
                    FirstName = firstName,
                    LastName = lastName,
                    DateOfBirth = dob,
                    EmailConfirmed = true
                };
                var result = await userManager.CreateAsync(user, password);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(user, role);
                }
            }
        }
    }
} 