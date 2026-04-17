using Application.Dto.Dtos.Courts;
using FluentAssertions;
using IntegrationTests.Helpers;
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;

namespace IntegrationTests.Controllers;

public class CourtsControllerTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;
    private readonly CustomWebApplicationFactory _factory;

    public CourtsControllerTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetAll_NoAuth_Returns200WithList()
    {
        using var scope = _factory.CreateTestScope();
        var adminId = Guid.NewGuid();
        await DatabaseSeeder.SeedCourtAsync(scope, adminId, "Quadra Aberta");

        var client = _factory.CreateClient();

        var response = await client.GetAsync("/api/courts");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var result = await response.Content.ReadFromJsonAsync<IEnumerable<CourtDto>>();
        result.Should().NotBeNull();
    }

    [Fact]
    public async Task GetAll_AsAdmin_Returns200WithAdminCourtsOnly()
    {
        var adminId = Guid.NewGuid();
        var otherAdminId = Guid.NewGuid();

        using var scope = _factory.CreateTestScope();
        await DatabaseSeeder.SeedCourtAsync(scope, adminId, "Quadra do Admin 1");
        await DatabaseSeeder.SeedCourtAsync(scope, otherAdminId, "Quadra do Admin 2");

        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", JwtTestHelper.AdminToken(adminId));

        var response = await client.GetAsync("/api/courts");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var result = await response.Content.ReadFromJsonAsync<IEnumerable<CourtDto>>();
        result.Should().HaveCount(1);
        result!.First().Name.Should().Be("Quadra do Admin 1");
    }

    [Fact]
    public async Task GetById_ExistingId_Returns200()
    {
        using var scope = _factory.CreateTestScope();
        var court = await DatabaseSeeder.SeedCourtAsync(scope, Guid.NewGuid());

        var client = _factory.CreateClient();

        var response = await client.GetAsync($"/api/courts/{court.Id}");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task GetById_NotFound_Returns404()
    {
        var client = _factory.CreateClient();

        var response = await client.GetAsync($"/api/courts/{Guid.NewGuid()}");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task Create_AsAdmin_Returns201()
    {
        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", JwtTestHelper.AdminToken());

        var dto = new CreateCourtDto
        {
            Name = "Quadra Nova Admin",
            Type = "Basquete",
            Region = "Leste",
            Capacity = 10,
            OpeningTime = new TimeSpan(8, 0, 0),
            ClosingTime = new TimeSpan(22, 0, 0),
            SlotDuration = 60,
            CancellationDeadlineHours = 12
        };

        var response = await client.PostAsJsonAsync("/api/courts", dto);

        response.StatusCode.Should().Be(HttpStatusCode.Created);
    }

    [Fact]
    public async Task Create_AsUser_Returns403()
    {
        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", JwtTestHelper.UserToken());

        var dto = new CreateCourtDto { Name = "X", Type = "X", Region = "X" };

        var response = await client.PostAsJsonAsync("/api/courts", dto);

        response.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }

    [Fact]
    public async Task Update_AdminOwnsCourt_Returns204()
    {
        var adminId = Guid.NewGuid();
        using var scope = _factory.CreateTestScope();
        var court = await DatabaseSeeder.SeedCourtAsync(scope, adminId);

        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", JwtTestHelper.AdminToken(adminId));

        var dto = new UpdateCourtDto
        {
            Name = "Editada",
            Type = court.Type,
            Region = court.Region,
            Capacity = court.Capacity,
            OpeningTime = court.OpeningTime,
            ClosingTime = court.ClosingTime,
            SlotDuration = court.SlotDuration,
            CancellationDeadlineHours = court.CancellationDeadlineHours,
            IsActive = true
        };

        var response = await client.PutAsJsonAsync($"/api/courts/{court.Id}", dto);

        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }

    [Fact]
    public async Task Update_AdminNotOwner_Returns403()
    {
        var ownerId = Guid.NewGuid();
        var attackerId = Guid.NewGuid();

        using var scope = _factory.CreateTestScope();
        var court = await DatabaseSeeder.SeedCourtAsync(scope, ownerId);

        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", JwtTestHelper.AdminToken(attackerId));

        var dto = new UpdateCourtDto { Name = "Editada", Type = "X", Region = "X" };

        var response = await client.PutAsJsonAsync($"/api/courts/{court.Id}", dto);

        response.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }

    [Fact]
    public async Task Delete_AdminOwnsCourt_Returns204()
    {
        var adminId = Guid.NewGuid();
        using var scope = _factory.CreateTestScope();
        var court = await DatabaseSeeder.SeedCourtAsync(scope, adminId);

        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", JwtTestHelper.AdminToken(adminId));

        var response = await client.DeleteAsync($"/api/courts/{court.Id}");

        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }
}
