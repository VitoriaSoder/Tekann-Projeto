using Domain.Project.Entities;
using Domain.Project.Constants;

namespace UnitTests.Builders;

public class UserBuilder
{
    private Guid _id = Guid.NewGuid();
    private string _name = "Test User";
    private string _email = "test@example.com";
    private string _passwordHash = BCrypt.Net.BCrypt.HashPassword("password123");
    private string _role = RoleConstants.User;
    private bool _isActive = true;

    public static UserBuilder Default() => new();

    public UserBuilder WithId(Guid id) { _id = id; return this; }
    public UserBuilder WithName(string name) { _name = name; return this; }
    public UserBuilder WithEmail(string email) { _email = email; return this; }
    public UserBuilder WithPasswordHash(string plain) { _passwordHash = BCrypt.Net.BCrypt.HashPassword(plain); return this; }
    public UserBuilder WithRole(string role) { _role = role; return this; }
    public UserBuilder AsAdmin() { _role = RoleConstants.Admin; return this; }
    public UserBuilder Inactive() { _isActive = false; return this; }

    public User Build() => new()
    {
        Id = _id,
        Name = _name,
        Email = _email,
        PasswordHash = _passwordHash,
        Role = _role,
        IsActive = _isActive,
        CreatedAt = DateTime.UtcNow
    };
}
