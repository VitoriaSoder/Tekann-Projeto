using Domain.Project.Entities;
using Microsoft.EntityFrameworkCore;
using Repositories.Interfaces.Bookings;
using SqlServer.Context;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Repositories.Repositories.Bookings;

public class BookingRepository : IBookingRepository
{
    private readonly AppDbContext _context;

    public BookingRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Booking>> GetAllAsync()
    {
        return await _context.Bookings
            .Include(b => b.Court)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<IEnumerable<Booking>> GetAllByAdminAsync(Guid adminId)
    {
        return await _context.Bookings
            .Include(b => b.Court)
            .Where(b => b.Court.CreatedBy == adminId)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<IEnumerable<Booking>> GetAllByUserAsync(Guid userId)
    {
        return await _context.Bookings
            .Include(b => b.Court)
            .Where(b => b.UserId == userId)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<Booking?> GetByIdAsync(Guid id)
    {
        return await _context.Bookings
            .Include(b => b.Court)
            .FirstOrDefaultAsync(b => b.Id == id);
    }

    public async Task<IEnumerable<Booking>> GetByCourtIdAsync(Guid courtId)
    {
        return await _context.Bookings
            .Where(b => b.CourtId == courtId)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<Booking> AddAsync(Booking booking)
    {
        await _context.Bookings.AddAsync(booking);
        await _context.SaveChangesAsync();
        return booking;
    }

    public async Task UpdateAsync(Booking booking)
    {
        _context.Bookings.Update(booking);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var booking = await GetByIdAsync(id);
        if (booking != null)
        {
            _context.Bookings.Remove(booking);
            await _context.SaveChangesAsync();
        }
    }
}
