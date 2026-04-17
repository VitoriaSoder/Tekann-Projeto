namespace Application.Dto.Dtos.Courts;

public class CourtDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Region { get; set; } = string.Empty;
    public int Capacity { get; set; }
    public TimeSpan OpeningTime { get; set; }
    public TimeSpan ClosingTime { get; set; }
    public int SlotDuration { get; set; }
    public int CancellationDeadlineHours { get; set; }
    public string? ImageUrl { get; set; }
    public bool IsActive { get; set; }
}
