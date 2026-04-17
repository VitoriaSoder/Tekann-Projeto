using Application.Application.Users;
using Application.Dto.Dtos.Users;
using Domain.Project.Entities;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using Project;
using Repositories.Interfaces.Users;
using UnitTests.Builders;

namespace UnitTests.Services;

public class UserServiceTests
{
    private readonly Mock<IUserRepository> _userRepoMock;
    private readonly Mock<ILogger<UserService>> _loggerMock;
    private readonly IOptions<JwtConfiguration> _jwtOptions;
    private readonly UserService _sut;

    public UserServiceTests()
    {
        _userRepoMock = new Mock<IUserRepository>();
        _loggerMock = new Mock<ILogger<UserService>>();
        _jwtOptions = Options.Create(new JwtConfiguration
        {
            Secret = "super-secret-key-for-unit-tests-minimum-32-chars!",
            Issuer = "test-issuer",
            Audience = "test-audience",
            ExpirationHours = 1
        });
        _sut = new UserService(_userRepoMock.Object, _jwtOptions, _loggerMock.Object);
    }

    [Fact]
    public async Task LoginAsync_ValidCredentials_ReturnsAuthResponse()
    {
        var user = UserBuilder.Default()
            .WithEmail("vitoria@test.com")
            .WithPasswordHash("password123")
            .Build();

        _userRepoMock.Setup(r => r.GetByEmailAsync("vitoria@test.com"))
            .ReturnsAsync(user);

        var dto = new LoginDto { Email = "vitoria@test.com", Password = "password123" };

        var result = await _sut.LoginAsync(dto);

        result.Should().NotBeNull();
        result.Token.Should().NotBeNullOrEmpty();
        result.User.Email.Should().Be("vitoria@test.com");
    }

    [Fact]
    public async Task LoginAsync_UserNotFound_ThrowsInvalidOperationException()
    {
        _userRepoMock.Setup(r => r.GetByEmailAsync(It.IsAny<string>()))
            .ReturnsAsync((User?)null);

        var dto = new LoginDto { Email = "notfound@test.com", Password = "any" };

        var act = () => _sut.LoginAsync(dto);

        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("*Credenciais inválidas*");
    }

    [Fact]
    public async Task LoginAsync_WrongPassword_ThrowsInvalidOperationException()
    {
        var user = UserBuilder.Default()
            .WithPasswordHash("correctPassword")
            .Build();

        _userRepoMock.Setup(r => r.GetByEmailAsync(It.IsAny<string>()))
            .ReturnsAsync(user);

        var dto = new LoginDto { Email = user.Email, Password = "wrongPassword" };

        var act = () => _sut.LoginAsync(dto);

        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("*Credenciais inválidas*");
    }

    [Fact]
    public async Task LoginAsync_InactiveUser_ThrowsInvalidOperationException()
    {
        var user = UserBuilder.Default()
            .WithPasswordHash("password123")
            .Inactive()
            .Build();

        _userRepoMock.Setup(r => r.GetByEmailAsync(It.IsAny<string>()))
            .ReturnsAsync(user);

        var dto = new LoginDto { Email = user.Email, Password = "password123" };

        var act = () => _sut.LoginAsync(dto);

        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("*inativo*");
    }

    [Fact]
    public async Task RegisterAsync_NewEmail_ReturnsAuthResponse()
    {
        _userRepoMock.Setup(r => r.GetByEmailAsync(It.IsAny<string>()))
            .ReturnsAsync((User?)null);

        _userRepoMock.Setup(r => r.AddAsync(It.IsAny<User>()))
            .ReturnsAsync((User u) => u);

        var dto = new RegisterDto
        {
            Name = "Vitória",
            Email = "vitoria@new.com",
            Password = "securePass"
        };

        var result = await _sut.RegisterAsync(dto);

        result.Should().NotBeNull();
        result.Token.Should().NotBeNullOrEmpty();
        result.User.Email.Should().Be("vitoria@new.com");
        _userRepoMock.Verify(r => r.AddAsync(It.IsAny<User>()), Times.Once);
    }

    [Fact]
    public async Task RegisterAsync_DuplicateEmail_ThrowsInvalidOperationException()
    {
        var existingUser = UserBuilder.Default().WithEmail("duplicate@test.com").Build();
        _userRepoMock.Setup(r => r.GetByEmailAsync("duplicate@test.com"))
            .ReturnsAsync(existingUser);

        var dto = new RegisterDto
        {
            Name = "Outro",
            Email = "duplicate@test.com",
            Password = "any"
        };

        var act = () => _sut.RegisterAsync(dto);

        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("*E-mail já cadastrado*");
    }

    [Fact]
    public async Task GetAllAsync_ReturnsAllUsersMappedToDto()
    {
        var users = new List<User>
        {
            UserBuilder.Default().WithEmail("a@test.com").Build(),
            UserBuilder.Default().WithEmail("b@test.com").Build()
        };

        _userRepoMock.Setup(r => r.GetAllAsync()).ReturnsAsync(users);

        var result = await _sut.GetAllAsync();

        result.Should().HaveCount(2);
        result.Should().Contain(u => u.Email == "a@test.com");
        result.Should().Contain(u => u.Email == "b@test.com");
    }

    [Fact]
    public async Task UpdateStatusAsync_ValidId_UpdatesIsActive()
    {
        var user = UserBuilder.Default().Build();
        _userRepoMock.Setup(r => r.GetByIdAsync(user.Id)).ReturnsAsync(user);
        _userRepoMock.Setup(r => r.UpdateAsync(It.IsAny<User>())).Returns(Task.CompletedTask);

        await _sut.UpdateStatusAsync(user.Id, false);

        user.IsActive.Should().BeFalse();
        _userRepoMock.Verify(r => r.UpdateAsync(user), Times.Once);
    }

    [Fact]
    public async Task UpdateStatusAsync_UserNotFound_ThrowsInvalidOperationException()
    {
        _userRepoMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>()))
            .ReturnsAsync((User?)null);

        var act = () => _sut.UpdateStatusAsync(Guid.NewGuid(), true);

        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("*não encontrado*");
    }
}
