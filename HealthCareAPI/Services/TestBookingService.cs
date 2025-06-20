using HealthCareAPI.DTOs;
using HealthCareAPI.Entities;
using HealthCareAPI.Enum;
using HealthCareAPI.Repositories;

namespace HealthCareAPI.Services
{
    public class TestBookingService
    {
        private readonly IUnitOfWork _unitOfWork;

        public TestBookingService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<IEnumerable<TestBooking>> GetAllTestBookingsAsync()
        {
            return await _unitOfWork.TestBookingRepository.GetAllWithIncludesAsync();
        }

        public async Task AddTestBookingAsync(TestBookingDTO testBookingDto)
        {
            var test = new TestBooking
            {
                AccountID = testBookingDto.AccountID,
                TestID = testBookingDto.TestID,
                Result = testBookingDto.Result ?? string.Empty,
                BookingDate = testBookingDto.BookingDate,
                BookingTime = testBookingDto.BookingTime,
                Status = testBookingDto.Status
            };
            await _unitOfWork.TestBookingRepository.AddAsync(test);
            await _unitOfWork.CompleteAsync();
        }

        public async Task UpdateTestAsync(int id, EditTestBookingDTO testBookingDto)
        {
            var testBooking = await _unitOfWork.TestBookingRepository.GetByIdAsync(id);
            if (testBooking == null) throw new Exception("TestBooking not found");

           testBooking.TestID = testBookingDto.TestID;
            testBooking.Result = testBookingDto.Result ?? string.Empty;
            testBooking.BookingDate = testBookingDto.BookingDate;
            testBooking.BookingTime = testBookingDto.BookingTime;
            testBooking.Status = testBookingDto.Status;

            _unitOfWork.TestBookingRepository.Update(testBooking);
            await _unitOfWork.CompleteAsync();
        }

      
    }
}
