using System;
using System.Threading.Tasks;

namespace HealthCareAPI.Repositories
{
    public interface IUnitOfWork : IDisposable
    {
        IGenericRepository<T> Repository<T>() where T : class;
        Task<int> CompleteAsync();
    }
} 