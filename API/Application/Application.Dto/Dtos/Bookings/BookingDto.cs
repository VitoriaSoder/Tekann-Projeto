namespace Application.Dto.Dtos.Bookings;

public class BookingDto
{
    public Guid Id { get; set; }
    public Guid CourtId { get; set; }
    public string CourtName { get; set; } = string.Empty;
    public string ClientName { get; set; } = string.Empty;
    public int NumberOfPeople { get; set; }
    public DateTime Date { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public string Status { get; set; } = string.Empty;
}
