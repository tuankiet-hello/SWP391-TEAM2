using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;
using System.Threading.Tasks;
using HealthCareAPI.Entities;
using HealthCareAPI.Enum;

namespace HealthCareAPI.data
{
    public static class SeedData
    {
        public static async Task InitializeAsync(IServiceProvider serviceProvider)
        {
            var context = serviceProvider.GetRequiredService<ApplicationDbContext>();
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
            var userManager = serviceProvider.GetRequiredService<UserManager<Account>>();

            await SeedRolesAsync(roleManager);
            await SeedUsersAsync(userManager);

            await SeedTestsAsync(context);
            await SeedAppoinmentsAsync(context);
            await SeedFeedbacksAsync(context);
            await SeedMenstrualCyclesAsync(context);
            await SeedTestBookingsAsync(context);
            await SeedQuestionsAsync(context);
        }

        // 1. Seed Roles
        private static async Task SeedRolesAsync(RoleManager<IdentityRole<Guid>> roleManager)
        {
            var roles = new[] { "admin", "staff", "consultant", "manager", "customer" };
            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole<Guid> { Name = role, NormalizedName = role.ToUpper() });
                }
            }
        }

        // 2. Seed Users
        private static async Task SeedUsersAsync(UserManager<Account> userManager)
        {
            await CreateUserAsync(userManager, "admin", "admin@example.com", "Admin@123", "Admin", "User", new DateOnly(1990, 1, 1), "admin", true);
            await CreateUserAsync(userManager, "staff", "staff@example.com", "Staff@123", "Staff", "User", new DateOnly(1991, 2, 2), "staff", false);
            await CreateUserAsync(userManager, "consultant", "consultant@example.com", "Consultant@123", "Consultant", "User", new DateOnly(1992, 3, 3), "consultant", true);
            await CreateUserAsync(userManager, "manager", "manager@example.com", "Manager@123", "Manager", "User", new DateOnly(1993, 4, 4), "manager", true);
            await CreateUserAsync(userManager, "customer", "customer@example.com", "Customer@123", "Customer", "User", new DateOnly(1994, 5, 5), "customer", false);

            await CreateUserAsync(userManager, "alice", "alice@example.com", "Alice@123", "Alice", "Smith", new DateOnly(1995, 6, 6), "customer", true);
            await CreateUserAsync(userManager, "bob", "bob@example.com", "Bob@123", "Bob", "Johnson", new DateOnly(1996, 7, 7), "customer", true);
            await CreateUserAsync(userManager, "carol", "carol@example.com", "Carol@123", "Carol", "Williams", new DateOnly(1997, 8, 8), "customer", false);
            await CreateUserAsync(userManager, "dave", "dave@example.com", "Dave@123", "Dave", "Brown", new DateOnly(1998, 9, 9), "customer", true);
            await CreateUserAsync(userManager, "eve", "eve@example.com", "Eve@123", "Eve", "Davis", new DateOnly(1999, 10, 10), "customer", false);
            await CreateUserAsync(userManager, "frank", "frank@example.com", "Frank@123", "Frank", "Miller", new DateOnly(1990, 11, 11), "customer", false);
            await CreateUserAsync(userManager, "grace", "grace@example.com", "Grace@123", "Grace", "Wilson", new DateOnly(1991, 12, 12), "customer", true);
            await CreateUserAsync(userManager, "heidi", "heidi@example.com", "Heidi@123", "Heidi", "Moore", new DateOnly(1992, 1, 13), "customer", false);
            await CreateUserAsync(userManager, "ivan", "ivan@example.com", "Ivan@123", "Ivan", "Taylor", new DateOnly(1993, 2, 14), "customer", true);
            await CreateUserAsync(userManager, "judy", "judy@example.com", "Judy@123", "Judy", "Anderson", new DateOnly(1994, 3, 15), "customer", false);
            await CreateUserAsync(userManager, "mallory", "mallory@example.com", "Mallory@123", "Mallory", "Thomas", new DateOnly(1995, 4, 16), "customer", true);
        }

        private static async Task CreateUserAsync(UserManager<Account> userManager, string username, string email, string password, string firstName, string lastName, DateOnly dob, string role, bool gender)
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
                    EmailConfirmed = true,
                    Gender = gender
                };
                var result = await userManager.CreateAsync(user, password);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(user, role);
                }
            }
        }

        // 3. Seed Test
        private static async Task SeedTestsAsync(ApplicationDbContext context)
        {
            if (context.Tests.Any()) return;

            var tests = new[]
            {
                new Test { TestName = "HIV Rapid Antibody Test", Description = "Rapid screening for HIV antibodies in blood or oral fluid.", Price = 100, Active = true },
                new Test { TestName = "HIV Antigen/Antibody Combo Test", Description = "Detects both HIV antibodies and p24 antigen for early diagnosis.", Price = 120, Active = true },
                new Test { TestName = "HIV RNA PCR Test", Description = "Detects HIV RNA for early infection and viral load monitoring.", Price = 200, Active = true },
                new Test { TestName = "Syphilis RPR (Rapid Plasma Reagin)", Description = "Screening blood test for syphilis infection.", Price = 90, Active = true },
                new Test { TestName = "Syphilis TPHA (Treponema pallidum Hemagglutination)", Description = "Confirmatory test for syphilis.", Price = 110, Active = true },
                new Test { TestName = "Chlamydia NAAT (Nucleic Acid Amplification Test)", Description = "Highly sensitive urine or swab test for Chlamydia trachomatis.", Price = 95, Active = true },
                new Test { TestName = "Gonorrhea NAAT (Nucleic Acid Amplification Test)", Description = "Highly sensitive urine or swab test for Neisseria gonorrhoeae.", Price = 95, Active = true },
                new Test { TestName = "Chlamydia/Gonorrhea Combo Test", Description = "Simultaneous detection of Chlamydia and Gonorrhea.", Price = 150, Active = true },
                new Test { TestName = "Trichomoniasis Test", Description = "Urine or swab test for Trichomonas vaginalis.", Price = 85, Active = true },
                new Test { TestName = "Herpes Simplex Virus Type 1 & 2 PCR", Description = "PCR test for HSV-1 and HSV-2 DNA from lesion swab.", Price = 130, Active = true },
                new Test { TestName = "Herpes Simplex Virus Type 1 & 2 IgG", Description = "Blood test for HSV-1 and HSV-2 antibodies.", Price = 110, Active = true },
                new Test { TestName = "HPV DNA Test", Description = "Detection of high-risk HPV DNA in cervical or anal samples.", Price = 160, Active = true },
                new Test { TestName = "Hepatitis B Surface Antigen (HBsAg)", Description = "Blood test for Hepatitis B infection.", Price = 80, Active = true },
                new Test { TestName = "Hepatitis B Surface Antibody (anti-HBs)", Description = "Blood test to check immunity to Hepatitis B.", Price = 80, Active = true },
                new Test { TestName = "Hepatitis C Antibody Test", Description = "Blood test for Hepatitis C infection.", Price = 90, Active = true },
                new Test { TestName = "Hepatitis C RNA PCR", Description = "Detects Hepatitis C viral RNA for diagnosis and monitoring.", Price = 180, Active = true },
                new Test { TestName = "Mycoplasma genitalium PCR", Description = "PCR test for Mycoplasma genitalium infection.", Price = 120, Active = true },
                new Test { TestName = "Ureaplasma urealyticum PCR", Description = "PCR test for Ureaplasma urealyticum infection.", Price = 120, Active = true },
                new Test { TestName = "Gardnerella vaginalis PCR", Description = "PCR test for Gardnerella vaginalis (bacterial vaginosis).", Price = 100, Active = true },
                new Test { TestName = "Chancroid PCR", Description = "PCR test for Haemophilus ducreyi (Chancroid).", Price = 140, Active = true },
                new Test { TestName = "Lymphogranuloma venereum (LGV) PCR", Description = "PCR test for LGV, a severe form of chlamydia.", Price = 130, Active = true },
                new Test { TestName = "Comprehensive STI Panel (PCR)", Description = "Multiplex PCR panel for Chlamydia, Gonorrhea, Trichomonas, Mycoplasma, Ureaplasma, HSV, and others.", Price = 250, Active = true },
                new Test { TestName = "Pap Smear", Description = "Cervical screening test for precancerous or cancerous cells, often related to HPV.", Price = 90, Active = true }
            };
            context.Tests.AddRange(tests);
            await context.SaveChangesAsync();

        }

        // 4. Seed Appoinment
        private static async Task SeedAppoinmentsAsync(ApplicationDbContext context)
        {
            if (context.Appoinments.Any()) return;

            var userIds = context.Users.Select(u => u.Id).Take(10).ToArray();
            var statusValues = new[] {
                StatusType.Submitted,
                StatusType.Pending,
                StatusType.Confirmed,
                StatusType.Canceled,
                StatusType.Completed,
                StatusType.Pending,
                StatusType.Confirmed,
                StatusType.Canceled,
                StatusType.Completed,
                StatusType.Submitted
            };

            var appoinments = Enumerable.Range(1, 10).Select(i =>
                new Appoinment
                {
                    // AppointmentID = i,
                    AccountID = userIds[i - 1],
                    AppointmentDate = new DateOnly(2025, 7, i),
                    AppointmentTime = new TimeOnly(8 + i, 0),
                    Status = statusValues[i - 1]
                }
            ).ToArray();

            context.Appoinments.AddRange(appoinments);
            await context.SaveChangesAsync();
        }

        // 5. Seed Feedback
        private static async Task SeedFeedbacksAsync(ApplicationDbContext context)
        {
            if (context.Feedbacks.Any()) return;

            var userIds = context.Users.Select(u => u.Id).Take(10).ToArray();
            var feedbacks = Enumerable.Range(1, 10).Select(i =>
                new Feedback
                {
                    AccountID = userIds[i - 1],
                    Comment = $"Feedback {i}",
                    CreateAt = DateTime.UtcNow.AddDays(-i),
                    Rating = 4 + (i % 2)
                }
            ).ToArray();

            context.Feedbacks.AddRange(feedbacks);
            await context.SaveChangesAsync();
        }

        // 6. Seed Menstrual Cycle
        private static async Task SeedMenstrualCyclesAsync(ApplicationDbContext context)
        {
            if (context.Menstrual_Cycles.Any()) return;

            var userIds = context.Users.Select(u => u.Id).Take(10).ToArray();
            var cycles = Enumerable.Range(1, 10).Select(i =>
                new MenstrualCycle
                {
                    // CycleID = i,
                    AccountID = userIds[i - 1],
                    Start_date = new DateOnly(2025, 6, i),
                    End_date = new DateOnly(2025, 6, i + 5),
                    Reminder_enabled = i % 2 == 0, // true cho chẵn, false cho lẻ
                    Note = i % 2 == 0 ? "Normal cycle" : "Mild cramps"
                }
            ).ToArray();

            context.Menstrual_Cycles.AddRange(cycles);
            await context.SaveChangesAsync();
        }

        // 7. Seed Test Booking
        private static async Task SeedTestBookingsAsync(ApplicationDbContext context)
        {
            if (context.TestBookings.Any()) return;

            var userIds = context.Users.Select(u => u.Id).Take(10).ToArray();
            var testIds = context.Tests.Select(t => t.TestID).Take(10).ToArray();
            var statusValues = new[]
            {
                StatusType.Pending,
                StatusType.Confirmed,
                StatusType.Completed,
                StatusType.Canceled,
                StatusType.Submitted,
                StatusType.Completed,
                StatusType.Pending,
                StatusType.Confirmed,
                StatusType.Canceled,
                StatusType.Submitted
            };

            var bookings = Enumerable.Range(1, 10).Select(i =>
                new TestBooking
                {
                    // BookingID = i,
                    AccountID = userIds[i - 1],
                    TestID = testIds[i - 1],
                    Result = i % 3 == 0 ? "Positive" : "Negative",
                    BookingDate = new DateOnly(2025, 6, 10 + i),
                    BookingTime = new TimeOnly(8 + i, 0),
                    Status = statusValues[i - 1]
                }
            ).ToArray();

            context.TestBookings.AddRange(bookings);
            await context.SaveChangesAsync();
        }

        // 8. Seed Question
        private static async Task SeedQuestionsAsync(ApplicationDbContext context)
        {
            if (context.Questions.Any()) return; // Nếu đã có dữ liệu thì không seed lại

            var userIds = context.Users.Select(u => u.Id).Take(10).ToArray(); // Lấy 10 AccountID từ bảng Users
            var questions = new[]
            {
                new Question {
                    AccountID = userIds[0],
                    Title = "When should my daughter get the HPV vaccine?",
                    Description = "My daughter is 12 years old. What is the recommended age for the HPV vaccine and how many doses are required?",
                    Status = StatusType.Submitted,
                    CreatedAt = DateTime.UtcNow.AddDays(-6)
                },
                new Question {
                    AccountID = userIds[1],
                    Title = "Booking a reproductive health consultation",
                    Description = "I would like to schedule an online consultation about modern contraception methods. How can I book an appointment?",
                    Status = StatusType.Submitted,
                    CreatedAt = DateTime.UtcNow.AddDays(-5)
                },
                new Question {
                    AccountID = userIds[2],
                    Title = "Symptoms of sexually transmitted infections",
                    Description = "I've been experiencing itching and discomfort in the genital area. Could this be a sign of an STI?",
                    Status = StatusType.Confirmed,
                    CreatedAt = DateTime.UtcNow.AddDays(-4),
                    UpdatedAt = DateTime.UtcNow.AddDays(-2)
                },
                new Question {
                    AccountID = userIds[3],
                    Title = "Menstrual cycle reminder feature",
                    Description = "Does the system support reminders for my next expected period date? How do I activate this feature?",
                    Status = StatusType.Completed,
                    CreatedAt = DateTime.UtcNow.AddDays(-10),
                    UpdatedAt = DateTime.UtcNow.AddDays(-7)
                },
                new Question {
                    AccountID = userIds[4],
                    Title = "Feedback on STI testing service",
                    Description = "I am very satisfied with the sample collection and result notification process at your clinic.",
                    Status = StatusType.Completed,
                    CreatedAt = DateTime.UtcNow.AddDays(-3)
                },
                new Question {
                    AccountID = userIds[5],
                    Title = "Advice on unplanned pregnancy",
                    Description = "I missed my period for a week and the pregnancy test result is unclear. What should I do next?",
                    Status = StatusType.Submitted,
                    CreatedAt = DateTime.UtcNow.AddDays(-1)
                },
                new Question {
                    AccountID = userIds[6],
                    Title = "Side effects of birth control pills",
                    Description = "I've been taking daily birth control pills but recently feel headaches and nausea. Are these side effects?",
                    Status = StatusType.Completed,
                    CreatedAt = DateTime.UtcNow.AddDays(-8)
                },
                new Question {
                    AccountID = userIds[7],
                    Title = "Scheduling an HIV test",
                    Description = "I want to book an HIV test this weekend. Can you guide me through the process and result notification time?",
                    Status = StatusType.Canceled,
                    CreatedAt = DateTime.UtcNow.AddDays(-2)
                },
                new Question {
                    AccountID = userIds[8],
                    Title = "How to manage irregular menstruation?",
                    Description = "My menstrual cycle is irregular, sometimes skipping months. What should I do to improve this condition?",
                    Status = StatusType.Submitted,
                    CreatedAt = DateTime.UtcNow.AddDays(-12)
                },
                new Question {
                    AccountID = userIds[9],
                    Title = "Canceling a consultation appointment",
                    Description = "I booked a gender health consultation but have an urgent work matter. Please help me cancel the appointment.",
                    Status = StatusType.Canceled,
                    CreatedAt = DateTime.UtcNow.AddDays(-7),
                    UpdatedAt = DateTime.UtcNow.AddDays(-6)
                }

            };
            context.Questions.AddRange(questions);
            await context.SaveChangesAsync();
        }
    }
}
