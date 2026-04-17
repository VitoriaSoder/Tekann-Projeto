using Domain.Project.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Repositories.Interfaces.Bookings;

public interface IBookingRepository
{
    Task<IEnumerable<Booking>> GetAllAsync();
    Task<IEnumerable<Booking>> GetAllByAdminAsync(Guid adminId);
    Task<IEnumerable<Booking>> GetAllByUserAsync(Guid userId);
    Task<Booking?> GetByIdAsync(Guid id);
    Task<IEnumerable<Booking>> GetByCourtIdAsync(Guid courtId);
    Task<Booking> AddAsync(Booking booking);
    Task UpdateAsync(Booking booking);
    Task DeleteAsync(Guid id);
}
