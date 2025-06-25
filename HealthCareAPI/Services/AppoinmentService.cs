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
        var entities = await _unitOfWork.AppoinmentRepository.GetAllWithAccountAsync();
        return entities.Select(a => new AppoinmentDTO
        {
            AppointmentID = a.AppointmentID,
            AccountID = a.AccountID,
            AppointmentDate = a.AppointmentDate,
            AppointmentTime = a.AppointmentTime,
            Status = a.Status,
            Account = a.Account == null ? null : new AccountViewDTO
            {
                FirstName = a.Account.FirstName,
                LastName = a.Account.LastName,
                DateOfBirth = a.Account.DateOfBirth,
                Email = a.Account.Email
            }
        });
    }

    public async Task<bool> UpdateAppointmentAsync(AppoinmentDTO dto)
    {
        var entity = await _unitOfWork.AppoinmentRepository.GetByIdAsync(dto.AppointmentID);
        if (entity == null) return false;

        entity.AppointmentDate = dto.AppointmentDate;
        entity.AppointmentTime = dto.AppointmentTime;
        entity.Status = dto.Status;

        _unitOfWork.AppoinmentRepository.Update(entity);
        await _unitOfWork.CompleteAsync();
        return true;
    }
}
