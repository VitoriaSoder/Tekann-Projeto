using Domain.Project.Entities;

namespace Repositories.Interfaces.Users;

public interface IUserRepository
{
    Task<User?> GetByEmailAsync(string email);
    Task<IEnumerable<User>> GetAllAsync();
    Task<User?> GetByIdAsync(Guid id);
    Task<User> AddAsync(User user);
    Task UpdateAsync(User user);
}
