using Application.Dto.Dtos.Courts;
using Domain.Project.Entities;
using Microsoft.Extensions.Logging;
using Repositories.Interfaces.Courts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Application.Courts;

public class CourtService : ICourtService
{
    private readonly ICourtRepository _courtRepository;
    private readonly ILogger<CourtService> _logger;

    public CourtService(ICourtRepository courtRepository, ILogger<CourtService> logger)
    {
        _courtRepository = courtRepository;
        _logger = logger;
    }

    public async Task<IEnumerable<CourtDto>> GetAllAsync()
    {
        var courts = await _courtRepository.GetAllAsync();
        return courts.Select(MapToDto);
    }

    public async Task<IEnumerable<CourtDto>> GetAllByAdminAsync(Guid adminId)
    {
        var courts = await _courtRepository.GetAllByAdminAsync(adminId);
        return courts.Select(MapToDto);
    }

    public async Task<CourtDto?> GetByIdAsync(Guid id)
    {
        var court = await _courtRepository.GetByIdAsync(id);
        return court != null ? MapToDto(court) : null;
    }

    public async Task<CourtDto> CreateAsync(CreateCourtDto dto, Guid adminId)
    {
        var court = new Court
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Type = dto.Type,
            Region = dto.Region,
            Capacity = dto.Capacity,
            OpeningTime = dto.OpeningTime,
            ClosingTime = dto.ClosingTime,
            SlotDuration = dto.SlotDuration,
            CancellationDeadlineHours = dto.CancellationDeadlineHours,
            ImageUrl = dto.ImageUrl,
            CreatedAt = DateTime.UtcNow,
            IsActive = true,
            CreatedBy = adminId
        };

        var result = await _courtRepository.AddAsync(court);
        _logger.LogInformation("Quadra '{Name}' ({Id}) criada pelo admin {AdminId}", court.Name, court.Id, adminId);
        return MapToDto(result);
    }

    public async Task UpdateAsync(Guid id, UpdateCourtDto dto, Guid adminId)
    {
        var court = await _courtRepository.GetByIdAndAdminAsync(id, adminId);
        if (court == null) throw new UnauthorizedAccessException("Quadra não encontrada ou você não tem permissão para editá-la.");

        court.Name = dto.Name;
        court.Type = dto.Type;
        court.Region = dto.Region;
        court.Capacity = dto.Capacity;
        court.OpeningTime = dto.OpeningTime;
        court.ClosingTime = dto.ClosingTime;
        court.SlotDuration = dto.SlotDuration;
        court.CancellationDeadlineHours = dto.CancellationDeadlineHours;
        court.ImageUrl = dto.ImageUrl;
        court.IsActive = dto.IsActive;

        await _courtRepository.UpdateAsync(court);
        _logger.LogInformation("Quadra '{Id}' atualizada com sucesso pelo admin {AdminId}", court.Id, adminId);
    }

    public async Task DeleteAsync(Guid id, Guid adminId)
    {
        var court = await _courtRepository.GetByIdAndAdminAsync(id, adminId);
        if (court == null) throw new UnauthorizedAccessException("Quadra não encontrada ou você não tem permissão para excluí-la.");

        await _courtRepository.DeleteAsync(id);
        _logger.LogInformation("Quadra '{Id}' removida pelo admin {AdminId}", id, adminId);
    }

    private CourtDto MapToDto(Court court)
    {
        return new CourtDto
        {
            Id = court.Id,
            Name = court.Name,
            Type = court.Type,
            Region = court.Region,
            Capacity = court.Capacity,
            OpeningTime = court.OpeningTime,
            ClosingTime = court.ClosingTime,
            SlotDuration = court.SlotDuration,
            CancellationDeadlineHours = court.CancellationDeadlineHours,
            ImageUrl = court.ImageUrl,
            IsActive = court.IsActive
        };
    }
}
