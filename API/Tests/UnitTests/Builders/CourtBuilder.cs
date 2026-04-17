using Domain.Project.Entities;

namespace UnitTests.Builders;

public class CourtBuilder
{
    private Guid _id = Guid.NewGuid();
    private string _name = "Quadra Teste";
    private string _type = "Futebol";
    private string _region = "Centro";
    private int _capacity = 10;
    private TimeSpan _openingTime = new(8, 0, 0);
    private TimeSpan _closingTime = new(22, 0, 0);
    private int _slotDuration = 60;
    private int _cancellationDeadlineHours = 24;
    private bool _isActive = true;
    private Guid _createdBy = Guid.NewGuid();

    public static CourtBuilder Default() => new();

    public CourtBuilder WithId(Guid id) { _id = id; return this; }
    public CourtBuilder WithName(string name) { _name = name; return this; }
    public CourtBuilder CreatedBy(Guid adminId) { _createdBy = adminId; return this; }
    public CourtBuilder WithCancellationDeadline(int hours) { _cancellationDeadlineHours = hours; return this; }
    public CourtBuilder Inactive() { _isActive = false; return this; }

    public Court Build() => new()
    {
        Id = _id,
        Name = _name,
        Type = _type,
        Region = _region,
        Capacity = _capacity,
        OpeningTime = _openingTime,
        ClosingTime = _closingTime,
        SlotDuration = _slotDuration,
        CancellationDeadlineHours = _cancellationDeadlineHours,
        IsActive = _isActive,
        CreatedBy = _createdBy,
        CreatedAt = DateTime.UtcNow
    };
}
