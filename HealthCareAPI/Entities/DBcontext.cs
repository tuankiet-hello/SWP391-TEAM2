using Microsoft.EntityFrameworkCore;

namespace HealthCareAPI
{
        public class ProductDbContext : DbContext
    {
        public DbSet<Account> Accounts { get; set;}
        public DbSet<Customer> Customers { get; set;}
        public DbSet<Consultant> Consultants { get; set;}
        public DbSet<Manager> Managers { get; set;}
        public DbSet<Admin> Admins { get; set;}
        public DbSet<Staff> Staff { get; set;}
        public DbSet<TestBooking> TestBookings { get; set;}
        public DbSet<ConsMenstrual_cycleultant> ConsMenstrual_Cycleultants { get; set;}
        public DbSet<Feedback> Feedbacks { get; set;}
        public DbSet<Appoinment> Appoinments { get; set;}

        private const string connectSql = @"
        Data Source=localhost,1433;
        Initial Catalog=data01;
        User ID=sa;
        Password=12345;
        TrustServerCertificate=True;";
        //mỗi khi tạo ra lớp này sẽ phải override lại method
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
            optionsBuilder.UseSqlServer(connectSql);
        }
    }
}