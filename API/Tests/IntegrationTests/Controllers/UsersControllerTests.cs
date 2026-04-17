using Application.Dto.Dtos.Users;
using FluentAssertions;
using IntegrationTests.Helpers;
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;

namespace IntegrationTests.Controllers;

public class UsersControllerTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;
    private readonly CustomWebApplicationFactory _factory;

    public UsersControllerTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetAll_AsAdmin_Returns200WithList()
    {
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", JwtTestHelper.AdminToken());

        var response = await _client.GetAsync("/api/users");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task GetAll_AsUser_Returns403()
    {
        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", JwtTestHelper.UserToken());

        var response = await client.GetAsync("/api/users");

        response.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }

    [Fact]
    public async Task GetAll_NoToken_Returns401()
    {
        var client = _factory.CreateClient();

        var response = await client.GetAsync("/api/users");

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    //  PATCH /api/users/{id}/status

    [Fact]
    public async Task UpdateStatus_AsAdmin_Returns204()
    {
        using var scope = _factory.CreateTestScope();
        var user = await DatabaseSeeder.SeedUserAsync(scope, email: $"status_{Guid.NewGuid()}@test.com");

        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", JwtTestHelper.AdminToken());

        var dto = new UpdateUserStatusDto { IsActive = false };
        var response = await client.PatchAsync($"/api/users/{user.Id}/status", JsonContent.Create(dto));

        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }

    [Fact]
    public async Task UpdateStatus_AsUser_Returns403()
    {
        using var scope = _factory.CreateTestScope();
        var user = await DatabaseSeeder.SeedUserAsync(scope, email: $"status403_{Guid.NewGuid()}@test.com");

        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", JwtTestHelper.UserToken());

        var dto = new UpdateUserStatusDto { IsActive = false };
        var response = await client.PatchAsync($"/api/users/{user.Id}/status", JsonContent.Create(dto));

        response.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }
}
