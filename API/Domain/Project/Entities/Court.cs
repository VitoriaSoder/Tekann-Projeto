namespace Domain.Project.Entities;

public class Court
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Region { get; set; } = string.Empty;
    public int Capacity { get; set; } = 10;
    public TimeSpan OpeningTime { get; set; }
    public TimeSpan ClosingTime { get; set; }
    public int SlotDuration { get; set; } = 60;
    public int CancellationDeadlineHours { get; set; } = 1;
    public string? ImageUrl { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Guid CreatedBy { get; set; }
    public User Admin { get; set; } = null!;

    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}
