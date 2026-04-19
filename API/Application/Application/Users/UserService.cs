using Application.Dto.Dtos.Users;
using Domain.Project.Entities;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Project;
using Repositories.Interfaces.Bookings;
using Repositories.Interfaces.Courts;
using Repositories.Interfaces.Users;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Domain.Project.Constants;

namespace Application.Application.Users;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IBookingRepository _bookingRepository;
    private readonly ICourtRepository _courtRepository;
    private readonly JwtConfiguration _jwtConfig;
    private readonly ILogger<UserService> _logger;

    public UserService(IUserRepository userRepository, IBookingRepository bookingRepository, ICourtRepository courtRepository, IOptions<JwtConfiguration> jwtConfig, ILogger<UserService> logger)
    {
        _userRepository = userRepository;
        _bookingRepository = bookingRepository;
        _courtRepository = courtRepository;
        _jwtConfig = jwtConfig.Value;
        _logger = logger;
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        var user = await _userRepository.GetByEmailAsync(dto.Email)
            ?? throw new InvalidOperationException("Credenciais inválidas.");

        if (!user.IsActive)
            throw new InvalidOperationException("Usuário inativo.");

        if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            throw new InvalidOperationException("Credenciais inválidas.");

        var token = GenerateToken(user);

        return new AuthResponseDto
        {
            Token = token,
            User = MapToDto(user)
        };
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
        var existing = await _userRepository.GetByEmailAsync(dto.Email);
        if (existing != null)
            throw new InvalidOperationException("E-mail já cadastrado.");

        var user = new User
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role = !string.IsNullOrEmpty(dto.Role) ? dto.Role : RoleConstants.User,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        await _userRepository.AddAsync(user);

        _logger.LogInformation("Novo usuário registrado: {Email} (Role: {Role})", user.Email, user.Role);

        var token = GenerateToken(user);

        return new AuthResponseDto
        {
            Token = token,
            User = MapToDto(user)
        };
    }

    private string GenerateToken(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtConfig.Secret));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Name),
            new Claim(ClaimTypes.Role, user.Role),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: _jwtConfig.Issuer,
            audience: _jwtConfig.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(_jwtConfig.ExpirationHours),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public async Task<IEnumerable<UserAdminDto>> GetAllAsync()
    {
        var users = await _userRepository.GetAllAsync();
        return users.Select(u => new UserAdminDto
        {
            Id = u.Id,
            Name = u.Name,
            Email = u.Email,
            Role = u.Role,
            IsActive = u.IsActive,
            CreatedAt = u.CreatedAt
        });
    }

    public async Task UpdateStatusAsync(Guid id, bool isActive)
    {
        var user = await _userRepository.GetByIdAsync(id)
            ?? throw new InvalidOperationException("Usuário não encontrado.");

        user.IsActive = isActive;
        await _userRepository.UpdateAsync(user);

        _logger.LogInformation("Status do usuário {Id} alterado para IsActive = {IsActive}", id, isActive);
    }

    private static UserDto MapToDto(User user)
    {
        return new UserDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Role = user.Role
        };
    }

    public async Task UpdateProfileAsync(Guid userId, UpdateProfileDto dto)
    {
        var user = await _userRepository.GetByIdAsync(userId)
            ?? throw new InvalidOperationException("Usuário não encontrado.");

        user.Name = dto.Name;
        await _userRepository.UpdateAsync(user);

        _logger.LogInformation("Perfil do usuário {Id} atualizado.", userId);
    }

    public async Task ChangePasswordAsync(Guid userId, ChangePasswordDto dto)
    {
        var user = await _userRepository.GetByIdAsync(userId)
            ?? throw new InvalidOperationException("Usuário não encontrado.");

        if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.PasswordHash))
            throw new InvalidOperationException("Senha atual incorreta.");

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
        await _userRepository.UpdateAsync(user);

        _logger.LogInformation("Senha do usuário {Id} alterada.", userId);
    }

    public async Task DeleteAccountAsync(Guid userId)
    {
        var user = await _userRepository.GetByIdAsync(userId)
            ?? throw new InvalidOperationException("Usuário não encontrado.");

        var userBookings = await _bookingRepository.GetAllByUserAsync(userId);
        foreach (var booking in userBookings)
            await _bookingRepository.DeleteAsync(booking.Id);

        var courts = await _courtRepository.GetAllByAdminAsync(userId);
        foreach (var court in courts)
        {
            var courtBookings = await _bookingRepository.GetByCourtIdAsync(court.Id);
            foreach (var booking in courtBookings)
                await _bookingRepository.DeleteAsync(booking.Id);

            await _courtRepository.DeleteAsync(court.Id);
        }

        await _userRepository.DeleteAsync(user);

        _logger.LogInformation("Conta do usuário {Id} deletada.", userId);
    }
}
