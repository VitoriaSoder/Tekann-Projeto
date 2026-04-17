using Application.Dto.Dtos.Courts;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Application.Courts;

public interface ICourtService
{
    Task<IEnumerable<CourtDto>> GetAllAsync();
    Task<IEnumerable<CourtDto>> GetAllByAdminAsync(Guid adminId);
    Task<CourtDto?> GetByIdAsync(Guid id);
    Task<CourtDto> CreateAsync(CreateCourtDto dto, Guid adminId);
    Task UpdateAsync(Guid id, UpdateCourtDto dto, Guid adminId);
    Task DeleteAsync(Guid id, Guid adminId);
}
