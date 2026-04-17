namespace Application.Dto.Dtos.Bookings;

public class CreateBookingDto
{
    public Guid CourtId { get; set; }
    public string ClientName { get; set; } = string.Empty;
    public int NumberOfPeople { get; set; } = 1;
    public DateTime Date { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
}
