using Application.Dto.Dtos.Bookings;
using FluentAssertions;
using IntegrationTests.Helpers;
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using Domain.Project.Constants;

namespace IntegrationTests.Controllers;

public class BookingsControllerTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;
    private readonly CustomWebApplicationFactory _factory;

    public BookingsControllerTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetAll_AsUser_Returns200WithOwnBookings()
    {
        var userId = Guid.NewGuid();
        using var scope = _factory.CreateTestScope();
        var court = await DatabaseSeeder.SeedCourtAsync(scope, Guid.NewGuid());
        await DatabaseSeeder.SeedBookingAsync(scope, court.Id, userId);
        await DatabaseSeeder.SeedBookingAsync(scope, court.Id, Guid.NewGuid()); // outro usuário

        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", JwtTestHelper.UserToken(userId));

        var response = await client.GetAsync("/api/bookings");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var result = await response.Content.ReadFromJsonAsync<IEnumerable<BookingDto>>();
        result.Should().HaveCount(1);
    }

    [Fact]
    public async Task GetAll_AsAdmin_Returns200WithAllAdminBookings()
    {
        var adminId = Guid.NewGuid();
        using var scope = _factory.CreateTestScope();
        var courtAdmin1 = await DatabaseSeeder.SeedCourtAsync(scope, adminId);
        var courtAdmin2 = await DatabaseSeeder.SeedCourtAsync(scope, Guid.NewGuid());

        await DatabaseSeeder.SeedBookingAsync(scope, courtAdmin1.Id, Guid.NewGuid());
        await DatabaseSeeder.SeedBookingAsync(scope, courtAdmin2.Id, Guid.NewGuid());

        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", JwtTestHelper.AdminToken(adminId));

        var response = await client.GetAsync("/api/bookings");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var result = await response.Content.ReadFromJsonAsync<IEnumerable<BookingDto>>();
        result.Should().HaveCount(1); // Somente as reservas das quadras que ele criou
    }

    [Fact]
    public async Task GetAll_NoToken_Returns401()
    {
        var response = await _client.GetAsync("/api/bookings");

        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task GetById_OwnerUser_Returns200()
    {
        var userId = Guid.NewGuid();
        using var scope = _factory.CreateTestScope();
        var court = await DatabaseSeeder.SeedCourtAsync(scope, Guid.NewGuid());
        var booking = await DatabaseSeeder.SeedBookingAsync(scope, court.Id, userId);

        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", JwtTestHelper.UserToken(userId));

        var response = await client.GetAsync($"/api/bookings/{booking.Id}");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task GetById_NotOwner_Returns403()
    {
        var ownerId = Guid.NewGuid();
        var attackerId = Guid.NewGuid();
        using var scope = _factory.CreateTestScope();
        var court = await DatabaseSeeder.SeedCourtAsync(scope, Guid.NewGuid());
        var booking = await DatabaseSeeder.SeedBookingAsync(scope, court.Id, ownerId);

        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", JwtTestHelper.UserToken(attackerId));

        var response = await client.GetAsync($"/api/bookings/{booking.Id}");

        response.StatusCode.Should().Be(HttpStatusCode.Forbidden);
    }

    //  GET /api/bookings/court/{courtId}/date/{date}

    [Fact]
    public async Task GetByCourtAndDate_Returns200()
    {
        using var scope = _factory.CreateTestScope();
        var court = await DatabaseSeeder.SeedCourtAsync(scope, Guid.NewGuid());
        var date = DateTime.UtcNow.Date.AddDays(2);
        await DatabaseSeeder.SeedBookingAsync(scope, court.Id, Guid.NewGuid(), date);

        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", JwtTestHelper.UserToken());

        var response = await client.GetAsync($"/api/bookings/court/{court.Id}/date/{date:yyyy-MM-dd}");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var result = await response.Content.ReadFromJsonAsync<IEnumerable<BookingDto>>();
        result.Should().HaveCount(1);
    }

    [Fact]
    public async Task Create_NoConflict_Returns201()
    {
        using var scope = _factory.CreateTestScope();
        var court = await DatabaseSeeder.SeedCourtAsync(scope, Guid.NewGuid());

        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", JwtTestHelper.UserToken());

        var dto = new CreateBookingDto
        {
            CourtId = court.Id,
            ClientName = "Cliente Integracao",
            NumberOfPeople = 4,
            Date = DateTime.UtcNow.Date.AddDays(5),
            StartTime = new TimeSpan(14, 0, 0),
            EndTime = new TimeSpan(15, 0, 0)
        };

        var response = await client.PostAsJsonAsync("/api/bookings", dto);

        response.StatusCode.Should().Be(HttpStatusCode.Created);
    }

    [Fact]
    public async Task Create_TimeConflict_Returns400()
    {
        using var scope = _factory.CreateTestScope();
        var court = await DatabaseSeeder.SeedCourtAsync(scope, Guid.NewGuid());
        var date = DateTime.UtcNow.Date.AddDays(5);

        await DatabaseSeeder.SeedBookingAsync(scope, court.Id, Guid.NewGuid(), date,
            new TimeSpan(14, 0, 0), new TimeSpan(15, 0, 0));

        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", JwtTestHelper.UserToken());

        var dto = new CreateBookingDto
        {
            CourtId = court.Id,
            ClientName = "Conflitante",
            NumberOfPeople = 1,
            Date = date,
            StartTime = new TimeSpan(14, 30, 0), // Conflito
            EndTime = new TimeSpan(15, 30, 0)
        };

        var response = await client.PostAsJsonAsync("/api/bookings", dto);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    //  PATCH /api/bookings/{id}/status

    [Fact]
    public async Task UpdateStatus_BeforeDeadline_Returns204()
    {
        var userId = Guid.NewGuid();
        using var scope = _factory.CreateTestScope();
        var court = await DatabaseSeeder.SeedCourtAsync(scope, Guid.NewGuid(), cancellationDeadlineHours: 24);
        var futureDate = DateTime.UtcNow.Date.AddDays(5); // Longe do deadline
        var booking = await DatabaseSeeder.SeedBookingAsync(scope, court.Id, userId, futureDate);

        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", JwtTestHelper.UserToken(userId));

        var response = await client.PatchAsync($"/api/bookings/{booking.Id}/status", JsonContent.Create(BookingStatusConstants.Cancelled));

        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }

    [Fact]
    public async Task UpdateStatus_AfterDeadline_Returns400()
    {
        var userId = Guid.NewGuid();
        using var scope = _factory.CreateTestScope();
        var court = await DatabaseSeeder.SeedCourtAsync(scope, Guid.NewGuid(), cancellationDeadlineHours: 24);

        // Passou do deadline (reserva é daqui a 2 horas)
        var nearDate = DateTime.UtcNow.Date;
        var startTime = DateTime.UtcNow.AddHours(2).TimeOfDay;
        var booking = await DatabaseSeeder.SeedBookingAsync(scope, court.Id, userId, nearDate, startTime, startTime.Add(TimeSpan.FromHours(1)));

        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", JwtTestHelper.UserToken(userId));

        var response = await client.PatchAsync($"/api/bookings/{booking.Id}/status", JsonContent.Create(BookingStatusConstants.Cancelled));

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task Delete_ValidId_Returns204()
    {
        using var scope = _factory.CreateTestScope();
        var court = await DatabaseSeeder.SeedCourtAsync(scope, Guid.NewGuid());
        var booking = await DatabaseSeeder.SeedBookingAsync(scope, court.Id, Guid.NewGuid());

        var client = _factory.CreateClient();
        // Assume que delete é acessível. No controller original `[HttpDelete("{id}")]` não tem restrição extra de rota, mas o BookingService.DeleteAsync só chama o repositório.
        // E o BookingsController inteiro tem [Authorize].
        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", JwtTestHelper.AdminToken());

        var response = await client.DeleteAsync($"/api/bookings/{booking.Id}");

        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }
}
