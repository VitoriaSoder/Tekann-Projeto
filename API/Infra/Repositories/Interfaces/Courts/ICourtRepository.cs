using Domain.Project.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Repositories.Interfaces.Courts;

public interface ICourtRepository
{
    Task<IEnumerable<Court>> GetAllAsync();
    Task<IEnumerable<Court>> GetAllByAdminAsync(Guid adminId);
    Task<Court?> GetByIdAsync(Guid id);
    Task<Court?> GetByIdAndAdminAsync(Guid id, Guid adminId);
    Task<Court> AddAsync(Court court);
    Task UpdateAsync(Court court);
    Task DeleteAsync(Guid id);
}
