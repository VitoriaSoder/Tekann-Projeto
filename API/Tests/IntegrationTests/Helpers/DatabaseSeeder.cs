using Domain.Project.Entities;
using SqlServer.Context;
using Microsoft.Extensions.DependencyInjection;
using Domain.Project.Constants;

namespace IntegrationTests.Helpers;

/// <summary>
/// Popula o banco InMemory com dados para os testes de integração.
/// </summary>
public static class DatabaseSeeder
{
    public static async Task<User> SeedUserAsync(
        IServiceScope scope,
        string email = "user@test.com",
        string role = RoleConstants.User,
        bool isActive = true,
        Guid? id = null)
    {
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var user = new User
        {
            Id = id ?? Guid.NewGuid(),
            Name = "Test User",
            Email = email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("password123"),
            Role = role,
            IsActive = isActive,
            CreatedAt = DateTime.UtcNow
        };

        db.Users.Add(user);
        await db.SaveChangesAsync();
        return user;
    }

    public static async Task<Court> SeedCourtAsync(
        IServiceScope scope,
        Guid createdBy,
        string name = "Quadra Teste",
        int cancellationDeadlineHours = 24,
        Guid? id = null)
    {
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var court = new Court
        {
            Id = id ?? Guid.NewGuid(),
            Name = name,
            Type = "Futebol",
            Region = "Centro",
            Capacity = 10,
            OpeningTime = new TimeSpan(8, 0, 0),
            ClosingTime = new TimeSpan(22, 0, 0),
            SlotDuration = 60,
            CancellationDeadlineHours = cancellationDeadlineHours,
            IsActive = true,
            CreatedBy = createdBy,
            CreatedAt = DateTime.UtcNow
        };

        db.Courts.Add(court);
        await db.SaveChangesAsync();
        return court;
    }

    public static async Task<Booking> SeedBookingAsync(
        IServiceScope scope,
        Guid courtId,
        Guid userId,
        DateTime? date = null,
        TimeSpan? startTime = null,
        TimeSpan? endTime = null,
        string status = BookingStatusConstants.Active,
        Guid? id = null)
    {
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var booking = new Booking
        {
            Id = id ?? Guid.NewGuid(),
            CourtId = courtId,
            UserId = userId,
            ClientName = "Cliente Teste",
            NumberOfPeople = 2,
            Date = (date ?? DateTime.UtcNow.Date.AddDays(7)).Date,
            StartTime = startTime ?? new TimeSpan(10, 0, 0),
            EndTime = endTime ?? new TimeSpan(11, 0, 0),
            Status = status,
            CreatedAt = DateTime.UtcNow
        };

        db.Bookings.Add(booking);
        await db.SaveChangesAsync();
        return booking;
    }
}
