using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Domain.Project.Constants;

namespace IntegrationTests.Helpers;

/// <summary>
/// Gera tokens JWT válidos para autenticação nos testes de integração,
/// usando a mesma configuração do appsettings.json da aplicação.
/// </summary>
public static class JwtTestHelper
{
    private const string Secret = "ALTERE_ESTA_CHAVE_SECRETA_EM_PRODUCAO";
    private const string Issuer = "Tekann";
    private const string Audience = "TekannUsers";

    public static string GenerateToken(Guid userId, string email, string name, string role)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Secret));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, email),
            new Claim(ClaimTypes.Name, name),
            new Claim(ClaimTypes.Role, role),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: Issuer,
            audience: Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public static string AdminToken(Guid? adminId = null) =>
        GenerateToken(adminId ?? Guid.NewGuid(), "admin@test.com", "Admin Test", RoleConstants.Admin);

    public static string UserToken(Guid? userId = null) =>
        GenerateToken(userId ?? Guid.NewGuid(), "user@test.com", "User Test", RoleConstants.User);
}
