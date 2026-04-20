using Application.Dto.Dtos.Bookings;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Application.Bookings;

public interface IBookingService
{
    Task<PagedResult<BookingDto>> GetAllAsync(Guid userId, string role, string? search, int page, int limit, string? sortBy, string? order);
    Task<BookingDto?> GetByIdAsync(Guid id, Guid userId, string role);
    Task<IEnumerable<BookingDto>> GetByCourtAndDateAsync(Guid courtId, DateTime date);
    Task<BookingDto> CreateAsync(CreateBookingDto dto, Guid userId);
    Task UpdateStatusAsync(Guid id, string status, Guid userId, string role);
    Task DeleteAsync(Guid id);
}
