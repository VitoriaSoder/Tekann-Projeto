using Application.Dto.Dtos.Users;

namespace Application.Application.Users;

public interface IUserService
{
    Task<AuthResponseDto> LoginAsync(LoginDto dto);
    Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
    Task<IEnumerable<UserAdminDto>> GetAllAsync();
    Task UpdateStatusAsync(Guid id, bool isActive);
}
