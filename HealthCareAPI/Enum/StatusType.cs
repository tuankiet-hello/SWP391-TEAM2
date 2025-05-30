namespace HealthCareAPI.Enum
{
	public enum StatusType
	{
		Submited,     // Đã gửi 0
		Pending,      // Đang chờ duyệt 1
		Confirmed,    // Đã xác nhận 2
		Canceled,     // Đã hủy 3
		Available,    // Có sẵn 4
		Unavailable,   // Không khả dụng 5,
		Completed    // Hoàn thành 6
	}
}
