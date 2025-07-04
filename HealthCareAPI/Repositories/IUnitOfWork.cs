using System;
using System.Threading.Tasks;

namespace HealthCareAPI.Repositories
{
    public interface IUnitOfWork : IDisposable
    {
        IGenericRepository<T> Repository<T>() where T : class;
        Task<int> CompleteAsync();
        IAppoinmentRepository AppoinmentRepository { get; }
        IFeedbackRepository FeedbackRepository { get; }
        IMenstrualCycleRepository MenstrualCycleRepository { get; }
        ITestBookingRepository TestBookingRepository { get; }
        ITestsRepository TestsRepository { get; }
        IQuestionRepository QuestionRepository { get; }
    }
} 