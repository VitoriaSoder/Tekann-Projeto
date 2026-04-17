using Domain.Project.Constants;
namespace Domain.Project.Entities;

public class User
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = RoleConstants.User;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Court> CreatedCourts { get; set; } = new List<Court>();
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}
