using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using HealthCareAPI.Repositories;
using HealthCareAPI.data;
using Microsoft.AspNetCore.Identity;
using HealthCareAPI.Entities;
using Microsoft.EntityFrameworkCore;
using System.Threading;
using HealthCareAPI.Services;

namespace HealthCareAPI
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Cấu hình controller và cho swagger đọc đc điểm cuối của api
            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();

            // Cấu hình swagger trực tiếp
            builder.Services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo { Title = "HealthCare API", Version = "v1" });
                c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                {
                    Description = "Enter 'Bearer' [space] and then your token",
                    Name = "Authorization",
                    In = Microsoft.OpenApi.Models.ParameterLocation.Header,
                    Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
                    Scheme = "Bearer"
                });
                c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
                {
                    {
                        new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                        {
                            Reference = new Microsoft.OpenApi.Models.OpenApiReference
                            {
                                Type=Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                                Id="Bearer"
                            }
                        },
                        new string[]{}
                    }
                });
            });
            //cấu hình AddIdentity
            builder.Services.AddIdentity<Account, IdentityRole<Guid>>(options =>
            {
                options.SignIn.RequireConfirmedEmail = true; // Yêu cầu xác nhận email
                options.User.RequireUniqueEmail = true;
            })
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

            // Cấu hình JWT trực tiếp
            var jwt = builder.Configuration.GetSection("Jwt");
            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwt["Issuer"],
                    ValidAudience = jwt["Audience"],
                    IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(jwt["Key"]))
                };
            });

            builder.Services.AddAuthorization();

            // Đăng ký UnitOfWork và GenericRepository
            builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
            builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

            // Đăng ký ApplicationDbContext vào DI
            builder.Services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
            // Đăng ký các Repository
            builder.Services.AddScoped<ITestsRepository, TestsRepository>();
            builder.Services.AddScoped<ITestBookingRepository,TestBookingRepository>();
            builder.Services.AddScoped<IAppoinmentRepository, AppoinmentRepository>();

            // Đăng ký các Service
            builder.Services.AddScoped<TestService>();
            builder.Services.AddScoped<TestBookingService>();
            builder.Services.AddScoped<AppoinmentService>();
            
            builder.Services.AddScoped<HealthCareAPI.Services.EmailService>();

            builder.Services.Configure<Microsoft.AspNetCore.Identity.DataProtectionTokenProviderOptions>(opt =>
            {
                opt.TokenLifespan = TimeSpan.FromMinutes(5);
            });

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAngularDev",
                    builder =>
                    {
                        builder.WithOrigins("http://localhost:4200")  //CHO PHÉP Angular đọc thuộc tính error mà be trả về
                            .AllowAnyHeader()
                            .AllowAnyMethod();
                    });
            });

            var app = builder.Build();

            // Tự động migrate database khi app khởi động, chỉ nếu có migration chưa áp dụng
            // using (var scope = app.Services.CreateScope())
            // {
            //     var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            //     var pendingMigrations = db.Database.GetPendingMigrations();
            //     if (pendingMigrations.Any())
            //     {
            //         Console.WriteLine($"Có {pendingMigrations.Count()} migration chưa áp dụng, đang thực hiện migrate...");
            //         db.Database.Migrate();
            //         Console.WriteLine("Migrate hoàn tất.");
            //     }
            //     else
            //     {
            //         Console.WriteLine("Database đã ở phiên bản mới nhất, không cần migrate.");
            //     }
            // }
            //code này đang lỗi chưa dùng đc nha, để nào hỏi giảng viên đã

            // Seed dữ liệu mẫu (user, role)
            using (var scope = app.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                await SeedData.InitializeAsync(services);
            }

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                {
                    c.SwaggerEndpoint("/swagger/v1/swagger.json", "HealthCare API V1");
                     c.RoutePrefix = "swagger";
                    //c.RoutePrefix = string.Empty;
                });
            }
            app.UseHttpsRedirection();
            app.UseCors(options =>
                        {
                            options.AllowAnyHeader();
                            options.AllowAnyMethod();
                            options.AllowAnyOrigin();
                        });
            app.UseHttpsRedirection();
            app.UseCors("AllowAngularDev");

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            // Chạy job xóa user chưa xác nhận mỗi 60 phút
            // var cancellationTokenSource = new CancellationTokenSource();
            // _ = Task.Run(async () =>
            // {
            //     while (!cancellationTokenSource.Token.IsCancellationRequested)
            //     {
            //         using (var scope = app.Services.CreateScope())
            //         {
            //             await SeedData.DeleteUnconfirmedUsersAsync(scope.ServiceProvider);
            //         }
            //         await Task.Delay(TimeSpan.FromHours(1), cancellationTokenSource.Token);
            //     }
            // });

            app.Run();
        }
    }
}
