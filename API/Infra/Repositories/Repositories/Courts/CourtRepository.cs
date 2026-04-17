using Domain.Project.Entities;
using Microsoft.EntityFrameworkCore;
using Repositories.Interfaces.Courts;
using SqlServer.Context;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Repositories.Repositories.Courts;

public class CourtRepository : ICourtRepository
{
    private readonly AppDbContext _context;

    public CourtRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Court>> GetAllAsync()
    {
        return await _context.Courts.AsNoTracking().ToListAsync();
    }

    public async Task<IEnumerable<Court>> GetAllByAdminAsync(Guid adminId)
    {
        return await _context.Courts
            .Where(c => c.CreatedBy == adminId)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<Court?> GetByIdAsync(Guid id)
    {
        return await _context.Courts.FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<Court?> GetByIdAndAdminAsync(Guid id, Guid adminId)
    {
        return await _context.Courts
            .FirstOrDefaultAsync(c => c.Id == id && c.CreatedBy == adminId);
    }

    public async Task<Court> AddAsync(Court court)
    {
        await _context.Courts.AddAsync(court);
        await _context.SaveChangesAsync();
        return court;
    }

    public async Task UpdateAsync(Court court)
    {
        _context.Courts.Update(court);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var court = await GetByIdAsync(id);
        if (court != null)
        {
            _context.Courts.Remove(court);
            await _context.SaveChangesAsync();
        }
    }
}
