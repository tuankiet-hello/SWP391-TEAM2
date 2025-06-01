using HealthCareAPI;
using System;
using System.Collections;
using System.Threading.Tasks;

namespace HealthCareAPI.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _context;
        private Hashtable _repositories;

        public UnitOfWork(ApplicationDbContext context)
        {
            _context = context;
        }

        public IGenericRepository<T> Repository<T>() where T : class
        {
            if (_repositories == null)
                _repositories = new Hashtable();

            var type = typeof(T).Name;

            if (!_repositories.ContainsKey(type))
            {
                var repositoryType = typeof(GenericRepository<>);
                var repositoryInstance = Activator.CreateInstance(repositoryType.MakeGenericType(typeof(T)), _context);
                _repositories.Add(type, repositoryInstance);
            }

            return (IGenericRepository<T>)_repositories[type];
        }

        public async Task<int> CompleteAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }

        public IAppoinmentRepository AppoinmentRepository => _appoinmentRepository ??= new AppoinmentRepository(_context);
        private IAppoinmentRepository _appoinmentRepository;
        public IFeedbackRepository FeedbackRepository => _feedbackRepository ??= new FeedbackRepository(_context);
        private IFeedbackRepository _feedbackRepository;
        public IMenstrualCycleRepository MenstrualCycleRepository => _menstrualCycleRepository ??= new MenstrualCycleRepository(_context);
        private IMenstrualCycleRepository _menstrualCycleRepository;
        public ITestBookingRepository TestBookingRepository => _testBookingRepository ??= new TestBookingRepository(_context);
        private ITestBookingRepository _testBookingRepository;
        public ITestsRepository TestsRepository => _testsRepository ??= new TestsRepository(_context);
        private ITestsRepository _testsRepository;
    }
} 