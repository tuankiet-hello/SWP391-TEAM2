using HealthCareAPI.DTOs;
using HealthCareAPI.Entities;
using HealthCareAPI.Enum;
using HealthCareAPI.Repositories;
public class AppoinmentService
{
    private readonly IUnitOfWork _unitOfWork;

    public AppoinmentService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<IEnumerable<AppoinmentDTO>> GetAllAsync()
    {
        var entities = await _unitOfWork.AppoinmentRepository.GetAllAsync();
        return entities.Select(a => new AppoinmentDTO
        {
            AppointmentID = a.AppointmentID,
            AccountID = a.AccountID,
            AppointmentDate = a.AppointmentDate,
            AppointmentTime = a.AppointmentTime,
            Status = a.Status
        });
    }

    public async Task<AppoinmentDTO?> GetByIdAsync(int id)
    {
        var entity = await _unitOfWork.AppoinmentRepository.GetByIdAsync(id);
        if (entity == null) return null;

        return new AppoinmentDTO
        {
            AppointmentID = entity.AppointmentID,
            AccountID = entity.AccountID,
            AppointmentDate = entity.AppointmentDate,
            AppointmentTime = entity.AppointmentTime,
            Status = entity.Status
        };
    }

    public async Task AddAsync(AppoinmentDTO dto)
    {
        var entity = new Appoinment
        {
            AccountID = dto.AccountID,
            AppointmentDate = dto.AppointmentDate,
            AppointmentTime = dto.AppointmentTime,
            Status = dto.Status
        };
        await _unitOfWork.AppoinmentRepository.AddAsync(entity);
        await _unitOfWork.CompleteAsync();
    }

    public async Task UpdateAsync(AppoinmentDTO dto)
    {
        var entity = await _unitOfWork.AppoinmentRepository.GetByIdAsync(dto.AppointmentID);
        if (entity == null) return;

        entity.AppointmentDate = dto.AppointmentDate;
        entity.AppointmentTime = dto.AppointmentTime;
        entity.Status = dto.Status;

        _unitOfWork.AppoinmentRepository.Update(entity);
        await _unitOfWork.CompleteAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var entity = await _unitOfWork.AppoinmentRepository.GetByIdAsync(id);
        if (entity == null) return;

        _unitOfWork.AppoinmentRepository.Remove(entity);
        await _unitOfWork.CompleteAsync();
    }

    public async Task<IEnumerable<AppoinmentDTO>> GetAppointmentsByDateAsync(DateOnly date)
    {
        var entities = await _unitOfWork.AppoinmentRepository.GetAppointmentsByDateAsync(date);
        return entities.Select(a => new AppoinmentDTO
        {
            AppointmentID = a.AppointmentID,
            AccountID = a.AccountID,
            AppointmentDate = a.AppointmentDate,
            AppointmentTime = a.AppointmentTime,
            Status = a.Status
        });
    }

    public async Task<IEnumerable<AppoinmentDTO>> GetAppointmentsByWeekAsync(DateOnly startDate, DateOnly endDate)
    {
        var entities = await _unitOfWork.AppoinmentRepository.GetAppointmentsByWeekAsync(startDate, endDate);
        return entities.Select(a => new AppoinmentDTO
        {
            AppointmentID = a.AppointmentID,
            AccountID = a.AccountID,
            AppointmentDate = a.AppointmentDate,
            AppointmentTime = a.AppointmentTime,
            Status = a.Status
        });
    }
}
