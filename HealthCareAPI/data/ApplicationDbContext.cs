using System;
using Microsoft.EntityFrameworkCore;

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
        Initial Catalog=ShopDB;
        User ID=sa;
        Password=12345;
        TrustServerCertificate=True;";
        //mỗi khi tạo ra lớp này sẽ phải override lại method
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
            optionsBuilder.UseLoggerFactory(loggerFactory);
            optionsBuilder.UseSqlServer(connectSql);
        }

    }
}