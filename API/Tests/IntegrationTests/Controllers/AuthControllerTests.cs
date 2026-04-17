using Application.Dto.Dtos.Users;
using FluentAssertions;
using IntegrationTests.Helpers;
using System.Net;
using System.Net.Http.Json;

namespace IntegrationTests.Controllers;

public class AuthControllerTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;
    private readonly CustomWebApplicationFactory _factory;

    public AuthControllerTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Register_ValidData_Returns201WithToken()
    {
        var dto = new RegisterDto
        {
            Name = "Nova Usuária",
            Email = $"register_{Guid.NewGuid()}@test.com",
            Password = "securePass123"
        };

        var response = await _client.PostAsJsonAsync("/api/auth/register", dto);

        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var result = await response.Content.ReadFromJsonAsync<AuthResponseDto>();
        result!.Token.Should().NotBeNullOrEmpty();
        result.User.Email.Should().Be(dto.Email);
    }

    [Fact]
    public async Task Register_DuplicateEmail_Returns400()
    {
        // Arrange — seed de um usuário com email fixo
        using var scope = _factory.CreateTestScope();
        var existingEmail = $"dup_{Guid.NewGuid()}@test.com";
        await DatabaseSeeder.SeedUserAsync(scope, email: existingEmail);

        var dto = new RegisterDto
        {
            Name = "Duplicado",
            Email = existingEmail,
            Password = "any"
        };

        var response = await _client.PostAsJsonAsync("/api/auth/register", dto);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task Login_ValidCredentials_Returns200WithToken()
    {
        using var scope = _factory.CreateTestScope();
        var email = $"login_{Guid.NewGuid()}@test.com";
        await DatabaseSeeder.SeedUserAsync(scope, email: email);

        var dto = new LoginDto { Email = email, Password = "password123" };

        var response = await _client.PostAsJsonAsync("/api/auth/login", dto);

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var result = await response.Content.ReadFromJsonAsync<AuthResponseDto>();
        result!.Token.Should().NotBeNullOrEmpty();
    }

    [Fact]
    public async Task Login_WrongPassword_Returns400()
    {
        using var scope = _factory.CreateTestScope();
        var email = $"wrongpass_{Guid.NewGuid()}@test.com";
        await DatabaseSeeder.SeedUserAsync(scope, email: email);

        var dto = new LoginDto { Email = email, Password = "wrongPassword" };

        var response = await _client.PostAsJsonAsync("/api/auth/login", dto);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task Login_InactiveUser_Returns400()
    {
        using var scope = _factory.CreateTestScope();
        var email = $"inactive_{Guid.NewGuid()}@test.com";
        await DatabaseSeeder.SeedUserAsync(scope, email: email, isActive: false);

        var dto = new LoginDto { Email = email, Password = "password123" };

        var response = await _client.PostAsJsonAsync("/api/auth/login", dto);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
}
