# HealthCareAPI

## Cấu trúc thư mục

```
healthcareapi/
├── Controllers/      # Chứa các controller (API endpoints)
├── Models/           # Chứa các model (class dữ liệu)
├── Config/           # Chứa file cấu hình (kết nối DB, ...)
├── Docs/             # Chứa tài liệu Swagger hoặc docs khác
├── appsettings.json  # Cấu hình ứng dụng, connection string
├── Program.cs        # Điểm khởi động ứng dụng
└── ...
```

## Hướng dẫn cấu hình SQL Server

- Sửa file `appsettings.json` phần `ConnectionStrings:DefaultConnection`:
  - `Server=YOUR_SERVER;Database=YOUR_DB;User Id=YOUR_USER;Password=YOUR_PASSWORD;TrustServerCertificate=True;`
- Đảm bảo SQL Server cho phép kết nối từ ứng dụng này.

## Khởi động API

```sh
dotnet run --project healthcareapi
```

## Kiểm tra health check
- Truy cập: `https://localhost:PORT/health` 