namespace Application.Dto.Dtos.Courts;

public class CreateCourtDto
{
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Region { get; set; } = string.Empty;
    public int Capacity { get; set; } = 10;
    public TimeSpan OpeningTime { get; set; }
    public TimeSpan ClosingTime { get; set; }
    public int SlotDuration { get; set; } = 60;
    public int CancellationDeadlineHours { get; set; } = 1;
    public string? ImageUrl { get; set; }
}
