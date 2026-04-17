using Application.Application.Courts;
using Application.Dto.Dtos.Courts;
using Domain.Project.Entities;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using Repositories.Interfaces.Courts;
using UnitTests.Builders;

namespace UnitTests.Services;

public class CourtServiceTests
{
    private readonly Mock<ICourtRepository> _courtRepoMock;
    private readonly Mock<ILogger<CourtService>> _loggerMock;
    private readonly CourtService _sut;

    public CourtServiceTests()
    {
        _courtRepoMock = new Mock<ICourtRepository>();
        _loggerMock = new Mock<ILogger<CourtService>>();
        _sut = new CourtService(_courtRepoMock.Object, _loggerMock.Object);
    }

    [Fact]
    public async Task GetAllAsync_ReturnsAllCourtsAsDto()
    {
        var courts = new List<Court>
        {
            CourtBuilder.Default().WithName("Quadra A").Build(),
            CourtBuilder.Default().WithName("Quadra B").Build()
        };
        _courtRepoMock.Setup(r => r.GetAllAsync()).ReturnsAsync(courts);

        var result = await _sut.GetAllAsync();

        result.Should().HaveCount(2);
        result.Should().Contain(c => c.Name == "Quadra A");
    }

    [Fact]
    public async Task GetAllByAdminAsync_ReturnsOnlyAdminCourts()
    {
        var adminId = Guid.NewGuid();
        var courts = new List<Court>
        {
            CourtBuilder.Default().CreatedBy(adminId).Build()
        };
        _courtRepoMock.Setup(r => r.GetAllByAdminAsync(adminId)).ReturnsAsync(courts);

        var result = await _sut.GetAllByAdminAsync(adminId);

        result.Should().HaveCount(1);
        _courtRepoMock.Verify(r => r.GetAllByAdminAsync(adminId), Times.Once);
    }

    [Fact]
    public async Task GetByIdAsync_ExistingId_ReturnsCourtDto()
    {
        var court = CourtBuilder.Default().WithName("Quadra Centro").Build();
        _courtRepoMock.Setup(r => r.GetByIdAsync(court.Id)).ReturnsAsync(court);

        var result = await _sut.GetByIdAsync(court.Id);

        result.Should().NotBeNull();
        result!.Name.Should().Be("Quadra Centro");
    }

    [Fact]
    public async Task GetByIdAsync_NotFound_ReturnsNull()
    {
        _courtRepoMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync((Court?)null);

        var result = await _sut.GetByIdAsync(Guid.NewGuid());

        result.Should().BeNull();
    }

    [Fact]
    public async Task CreateAsync_ValidData_ReturnsCreatedCourtDto()
    {
        var adminId = Guid.NewGuid();
        var dto = new CreateCourtDto
        {
            Name = "Nova Quadra",
            Type = "Tênis",
            Region = "Norte",
            Capacity = 4,
            OpeningTime = new TimeSpan(8, 0, 0),
            ClosingTime = new TimeSpan(20, 0, 0),
            SlotDuration = 60,
            CancellationDeadlineHours = 12
        };

        _courtRepoMock
            .Setup(r => r.AddAsync(It.IsAny<Court>()))
            .ReturnsAsync((Court c) => c);

        var result = await _sut.CreateAsync(dto, adminId);

        result.Should().NotBeNull();
        result.Name.Should().Be("Nova Quadra");
        _courtRepoMock.Verify(r => r.AddAsync(It.Is<Court>(c => c.CreatedBy == adminId)), Times.Once);
    }

    [Fact]
    public async Task UpdateAsync_AdminOwnsCourt_UpdatesSuccessfully()
    {
        var adminId = Guid.NewGuid();
        var court = CourtBuilder.Default().CreatedBy(adminId).Build();

        _courtRepoMock.Setup(r => r.GetByIdAndAdminAsync(court.Id, adminId)).ReturnsAsync(court);
        _courtRepoMock.Setup(r => r.UpdateAsync(It.IsAny<Court>())).Returns(Task.CompletedTask);

        var dto = new UpdateCourtDto
        {
            Name = "Quadra Atualizada",
            Type = court.Type,
            Region = court.Region,
            Capacity = court.Capacity,
            OpeningTime = court.OpeningTime,
            ClosingTime = court.ClosingTime,
            SlotDuration = court.SlotDuration,
            CancellationDeadlineHours = court.CancellationDeadlineHours,
            IsActive = court.IsActive
        };

        await _sut.UpdateAsync(court.Id, dto, adminId);

        court.Name.Should().Be("Quadra Atualizada");
        _courtRepoMock.Verify(r => r.UpdateAsync(court), Times.Once);
    }

    [Fact]
    public async Task UpdateAsync_AdminNotOwner_ThrowsUnauthorizedAccessException()
    {
        var otherAdminId = Guid.NewGuid();
        _courtRepoMock.Setup(r => r.GetByIdAndAdminAsync(It.IsAny<Guid>(), otherAdminId))
            .ReturnsAsync((Court?)null);

        var dto = new UpdateCourtDto { Name = "X", Type = "X", Region = "X" };

        var act = () => _sut.UpdateAsync(Guid.NewGuid(), dto, otherAdminId);

        await act.Should().ThrowAsync<UnauthorizedAccessException>();
    }

    [Fact]
    public async Task DeleteAsync_AdminOwnsCourt_CallsDeleteRepository()
    {
        var adminId = Guid.NewGuid();
        var court = CourtBuilder.Default().CreatedBy(adminId).Build();

        _courtRepoMock.Setup(r => r.GetByIdAndAdminAsync(court.Id, adminId)).ReturnsAsync(court);
        _courtRepoMock.Setup(r => r.DeleteAsync(court.Id)).Returns(Task.CompletedTask);

        await _sut.DeleteAsync(court.Id, adminId);

        _courtRepoMock.Verify(r => r.DeleteAsync(court.Id), Times.Once);
    }

    [Fact]
    public async Task DeleteAsync_AdminNotOwner_ThrowsUnauthorizedAccessException()
    {
        var wrongAdminId = Guid.NewGuid();
        _courtRepoMock.Setup(r => r.GetByIdAndAdminAsync(It.IsAny<Guid>(), wrongAdminId))
            .ReturnsAsync((Court?)null);

        var act = () => _sut.DeleteAsync(Guid.NewGuid(), wrongAdminId);

        await act.Should().ThrowAsync<UnauthorizedAccessException>();
    }
}
