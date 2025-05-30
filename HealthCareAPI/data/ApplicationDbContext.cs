using System;
using Microsoft.EntityFrameworkCore;
using HealthCareAPI.Entities;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.General;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace HealthCareAPI
{
    public class ApplicationDbContext : IdentityDbContext<Account, IdentityRole<Guid>, Guid>
    {
        public static readonly ILoggerFactory loggerFactory = LoggerFactory.Create(builder =>
       {
           builder.AddFilter(DbLoggerCategory.Query.Name, LogLevel.Information);
           builder.AddConsole();
       });


        public ApplicationDbContext(DbContextOptions options) : base(options)
        {

        }
        public DbSet<Account> Accounts { get; set; }
        public DbSet<Test> Tests { get; set; }
        public DbSet<TestBooking> TestBookings { get; set; }
        public DbSet<MenstrualCycle> Menstrual_Cycles { get; set; }
        public DbSet<Feedback> Feedbacks { get; set; }
        public DbSet<Appoinment> Appoinments { get; set; }

        //mỗi khi tạo ra lớp này sẽ phải override lại method
        //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //{
        //    base.OnConfiguring(optionsBuilder);
        //    optionsBuilder.UseLoggerFactory(loggerFactory);
        //    optionsBuilder.UseSqlServer(connectSql);
        //}
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder); // đừng quên gọi base để Identity hoạt động đúng

            modelBuilder.Entity<Appoinment>()
                .HasOne(a => a.Customer)
                .WithMany()
                .HasForeignKey(a => a.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Appoinment>()
                .HasOne(a => a.Consultant)
                .WithMany()
                .HasForeignKey(a => a.ConsultantId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Feedback>()
                .HasOne(f => f.Customer)
                .WithMany()
                .HasForeignKey(f => f.CustomerID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Feedback>()
                .HasOne(f => f.Consultant)
                .WithMany()
                .HasForeignKey(f => f.ConsultantID)
                .OnDelete(DeleteBehavior.Restrict);

            // Rename default Identity tables (optional)
            modelBuilder.Entity<Account>().ToTable("Users");
            modelBuilder.Entity<IdentityRole<Guid>>().ToTable("Roles");
            modelBuilder.Entity<IdentityUserRole<Guid>>().ToTable("UserRoles");
            modelBuilder.Entity<IdentityUserClaim<Guid>>().ToTable("UserClaims");
            modelBuilder.Entity<IdentityUserLogin<Guid>>().ToTable("UserLogins");
            modelBuilder.Entity<IdentityRoleClaim<Guid>>().ToTable("RoleClaims");
            modelBuilder.Entity<IdentityUserToken<Guid>>().ToTable("UserTokens");
        }

    }
}