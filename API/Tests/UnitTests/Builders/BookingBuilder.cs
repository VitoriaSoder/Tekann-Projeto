using Domain.Project.Entities;
using Domain.Project.Constants;

namespace UnitTests.Builders;

public class BookingBuilder
{
    private Guid _id = Guid.NewGuid();
    private Guid _courtId = Guid.NewGuid();
    private Guid _userId = Guid.NewGuid();
    private Court? _court = null;
    private string _clientName = "Cliente Teste";
    private int _numberOfPeople = 2;
    private DateTime _date = DateTime.UtcNow.Date.AddDays(7);
    private TimeSpan _startTime = new(10, 0, 0);
    private TimeSpan _endTime = new(11, 0, 0);
    private string _status = BookingStatusConstants.Active;

    public static BookingBuilder Default() => new();

    public BookingBuilder WithId(Guid id) { _id = id; return this; }
    public BookingBuilder ForCourt(Guid courtId) { _courtId = courtId; return this; }
    public BookingBuilder ForCourt(Court court) { _courtId = court.Id; _court = court; return this; }
    public BookingBuilder ForUser(Guid userId) { _userId = userId; return this; }
    public BookingBuilder OnDate(DateTime date) { _date = date.Date; return this; }
    public BookingBuilder FromTo(TimeSpan start, TimeSpan end) { _startTime = start; _endTime = end; return this; }
    public BookingBuilder WithStatus(string status) { _status = status; return this; }
    public BookingBuilder Cancelled() { _status = BookingStatusConstants.Cancelled; return this; }

    public Booking Build()
    {
        var booking = new Booking
        {
            Id = _id,
            CourtId = _courtId,
            UserId = _userId,
            ClientName = _clientName,
            NumberOfPeople = _numberOfPeople,
            Date = _date,
            StartTime = _startTime,
            EndTime = _endTime,
            Status = _status,
            CreatedAt = DateTime.UtcNow
        };

        if (_court != null)
            booking.Court = _court;

        return booking;
    }
}
