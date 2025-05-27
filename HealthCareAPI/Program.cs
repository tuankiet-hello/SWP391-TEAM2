using HealthCareAPI;
using Microsoft.EntityFrameworkCore;

namespace HealthCareAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "HealthCare API V1");
                    c.RoutePrefix = string.Empty; // Swagger UI as default page
                });
            }

            app.UseHttpsRedirection();
            app.MapControllers(); // This is important to map attribute-based controllers.

            app.Run();
        }
    }
}
