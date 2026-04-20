using Application.Dto.Dtos.Bookings;
using Domain.Project.Entities;
using Repositories.Interfaces.Bookings;
using Repositories.Interfaces.Courts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Project.Constants;
using Microsoft.Extensions.Logging;

namespace Application.Application.Bookings;

public class BookingService : IBookingService
{
    private readonly IBookingRepository _bookingRepository;
    private readonly ICourtRepository _courtRepository;
    private readonly ILogger<BookingService> _logger;

    public BookingService(IBookingRepository bookingRepository, ICourtRepository courtRepository, ILogger<BookingService> logger)
    {
        _bookingRepository = bookingRepository;
        _courtRepository = courtRepository;
        _logger = logger;
    }

    public async Task<PagedResult<BookingDto>> GetAllAsync(Guid userId, string role, string? search, int page, int limit, string? sortBy, string? order)
    {
        _logger.LogInformation("[GetAll] search={Search} page={Page} limit={Limit} sortBy={SortBy} order={Order}", search, page, limit, sortBy, order);
        IEnumerable<Booking> bookings;

        if (role == RoleConstants.Admin)
            bookings = await _bookingRepository.GetAllByAdminAsync(userId);
        else
            bookings = await _bookingRepository.GetAllByUserAsync(userId);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.ToLower();
            bookings = bookings.Where(b =>
                b.ClientName.ToLower().Contains(term) ||
                (b.Court?.Name ?? "").ToLower().Contains(term) ||
                b.Status.ToLower().Contains(term));
        }

        bookings = (sortBy?.ToLower(), order?.ToLower()) switch
        {
            ("clientname", "desc") => bookings.OrderByDescending(b => b.ClientName),
            ("clientname", _)      => bookings.OrderBy(b => b.ClientName),
            ("date", "desc")       => bookings.OrderByDescending(b => b.Date),
            ("date", _)            => bookings.OrderBy(b => b.Date),
            ("status", "desc")     => bookings.OrderByDescending(b => b.Status),
            ("status", _)          => bookings.OrderBy(b => b.Status),
            ("courtname", "desc")  => bookings.OrderByDescending(b => b.Court?.Name),
            ("courtname", _)       => bookings.OrderBy(b => b.Court?.Name),
            _                      => bookings.OrderByDescending(b => b.Date)
        };

        var total = bookings.Count();
        var data = bookings.Skip((page - 1) * limit).Take(limit).Select(MapToDto);

        return new PagedResult<BookingDto> { Data = data, Total = total, Page = page, Limit = limit };
    }

    public async Task<BookingDto?> GetByIdAsync(Guid id, Guid userId, string role)
    {
        var booking = await _bookingRepository.GetByIdAsync(id);
        if (booking == null) return null;

        if (role == RoleConstants.Admin)
        {
            if (booking.Court?.CreatedBy != userId)
                throw new UnauthorizedAccessException("Você não tem permissão para visualizar esta reserva.");
        }
        else
        {
            if (booking.UserId != userId)
                throw new UnauthorizedAccessException("Você não tem permissão para visualizar esta reserva.");
        }

        return MapToDto(booking);
    }

    public async Task<IEnumerable<BookingDto>> GetByCourtAndDateAsync(Guid courtId, DateTime date)
    {
        var bookings = await _bookingRepository.GetAllAsync();
        return bookings
            .Where(b => b.CourtId == courtId && b.Date.Date == date.Date && b.Status == BookingStatusConstants.Active)
            .Select(MapToDto);
    }

    public async Task<BookingDto> CreateAsync(CreateBookingDto dto, Guid userId)
    {
        // 1. Check for time conflicts
        var existingBookings = await _bookingRepository.GetAllAsync();
        var hasConflict = existingBookings.Any(b =>
            b.CourtId == dto.CourtId &&
            b.Date.Date == dto.Date.Date &&
            b.Status == BookingStatusConstants.Active &&
            dto.StartTime < b.EndTime &&
            dto.EndTime > b.StartTime);

        if (hasConflict)
            throw new InvalidOperationException("Conflito de horário: já existe uma reserva ativa neste período.");

        var booking = new Booking
        {
            Id = Guid.NewGuid(),
            CourtId = dto.CourtId,
            UserId = userId,
            ClientName = dto.ClientName,
            NumberOfPeople = dto.NumberOfPeople,
            Date = dto.Date,
            StartTime = dto.StartTime,
            EndTime = dto.EndTime,
            Status = BookingStatusConstants.Active,
            CreatedAt = DateTime.UtcNow
        };

        var result = await _bookingRepository.AddAsync(booking);
        _logger.LogInformation("Reserva '{Id}' criada com sucesso para a quadra '{CourtId}' pelo usuário '{UserId}'", booking.Id, dto.CourtId, userId);
        return MapToDto(result);
    }

    public async Task UpdateStatusAsync(Guid id, string status, Guid userId, string role)
    {
        var booking = await _bookingRepository.GetByIdAsync(id);
        if (booking == null) throw new Exception("Booking not found");

        if (role == RoleConstants.Admin)
        {
            if (booking.Court?.CreatedBy != userId)
                throw new UnauthorizedAccessException("Você não tem permissão para alterar esta reserva.");
        }
        else
        {
            if (booking.UserId != userId)
                throw new UnauthorizedAccessException("Você não tem permissão para alterar esta reserva.");
        }

        if (status == BookingStatusConstants.Cancelled)
        {
            var court = await _courtRepository.GetByIdAsync(booking.CourtId);
            if (court != null)
            {
                var bookingDateTime = booking.Date.Date.Add(booking.StartTime);
                var now = DateTime.UtcNow.AddHours(-3); // Adjusting for Brasilia time if necessary, or just use Utc
                                                        // Let's assume the DB stores in UTC or consistent time.

                if (bookingDateTime < DateTime.UtcNow.AddHours(court.CancellationDeadlineHours))
                {
                    throw new InvalidOperationException($"Cancelamento não permitido. Antecedência mínima de {court.CancellationDeadlineHours}h necessária.");
                }
            }
        }

        booking.Status = status;
        booking.UpdatedAt = DateTime.UtcNow;

        await _bookingRepository.UpdateAsync(booking);
        _logger.LogInformation("Status da reserva '{Id}' alterado para '{Status}' pelo usuário '{UserId}'", id, status, userId);
    }

    public async Task DeleteAsync(Guid id)
    {
        await _bookingRepository.DeleteAsync(id);
        _logger.LogInformation("Reserva '{Id}' foi deletada do sistema", id);
    }

    private BookingDto MapToDto(Booking booking)
    {
        return new BookingDto
        {
            Id = booking.Id,
            CourtId = booking.CourtId,
            CourtName = booking.Court?.Name ?? string.Empty,
            ClientName = booking.ClientName,
            NumberOfPeople = booking.NumberOfPeople,
            Date = booking.Date,
            StartTime = booking.StartTime,
            EndTime = booking.EndTime,
            Status = booking.Status
        };
    }
}
