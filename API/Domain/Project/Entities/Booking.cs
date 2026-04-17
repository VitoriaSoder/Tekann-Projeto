using Domain.Project.Constants;
namespace Domain.Project.Entities;

public class Booking
{
    public Guid Id { get; set; }
    public Guid CourtId { get; set; }
    public Court Court { get; set; } = null!;

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public string ClientName { get; set; } = string.Empty;
    public int NumberOfPeople { get; set; } = 1;
    public DateTime Date { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public string Status { get; set; } = BookingStatusConstants.Active;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
}
