using System;
using Microsoft.EntityFrameworkCore;
using HealthCareAPI.Entities;

namespace HealthCareAPI
{
    public class ApplicationDbContext : DbContext
    {
        public static readonly ILoggerFactory loggerFactory = LoggerFactory.Create(builder =>
       {
           builder.AddFilter(DbLoggerCategory.Query.Name, LogLevel.Information);
           builder.AddConsole();
       });
        private const string connectSql = @"
        Data Source=localhost,1433;
        Initial Catalog=HealthCareDB;
        User ID=sa;
        Password=12345;
        TrustServerCertificate=True;";

        public ApplicationDbContext(DbContextOptions options) : base(options)
        {
        }
        public DbSet<Account> Accounts { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Consultant> Consultants { get; set; }
        public DbSet<Manager> Managers { get; set; }
        public DbSet<Admin> Admins { get; set; }
        public DbSet<Staff> Staff { get; set; }
        public DbSet<Test> Tests { get; set; }
        public DbSet<TestBooking> TestBookings { get; set; }
        public DbSet<Menstrual_cycle> Menstrual_Cycles { get; set; }
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
            modelBuilder.Entity<Appoinment>()
                .HasOne(a => a.Customer)
                .WithMany(c => c.Appoinments)
                .HasForeignKey(a => a.CustomerID)
                .OnDelete(DeleteBehavior.Restrict); // <- Tắt cascade delete

            modelBuilder.Entity<Appoinment>()
                .HasOne(a => a.Consultant)
                .WithMany(c => c.Appoinments)
                .HasForeignKey(a => a.ConsultantID)
                .OnDelete(DeleteBehavior.Restrict); // <- Tắt cascade delete

            modelBuilder.Entity<Feedback>()
                .HasOne(f => f.Customer)
                .WithMany(c => c.Feedbacks)
                .HasForeignKey(f => f.CustomerID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Feedback>()
                .HasOne(f => f.Consultant)
                .WithMany(c => c.Feedbacks)
                .HasForeignKey(f => f.ConsultantID)
                .OnDelete(DeleteBehavior.Restrict);
        }

    }
}