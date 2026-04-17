using Application.Application.Bookings;
using Application.Dto.Dtos.Bookings;
using Domain.Project.Entities;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using Repositories.Interfaces.Bookings;
using Repositories.Interfaces.Courts;
using UnitTests.Builders;
using Domain.Project.Constants;

namespace UnitTests.Services;

public class BookingServiceTests
{
    private readonly Mock<IBookingRepository> _bookingRepoMock;
    private readonly Mock<ICourtRepository> _courtRepoMock;
    private readonly Mock<ILogger<BookingService>> _loggerMock;
    private readonly BookingService _sut;

    public BookingServiceTests()
    {
        _bookingRepoMock = new Mock<IBookingRepository>();
        _courtRepoMock = new Mock<ICourtRepository>();
        _loggerMock = new Mock<ILogger<BookingService>>();
        _sut = new BookingService(_bookingRepoMock.Object, _courtRepoMock.Object, _loggerMock.Object);
    }

    [Fact]
    public async Task GetAllAsync_RoleUser_ReturnsOnlyUserBookings()
    {
        var userId = Guid.NewGuid();
        var bookings = new List<Booking>
        {
            BookingBuilder.Default().ForUser(userId).Build()
        };
        _bookingRepoMock.Setup(r => r.GetAllByUserAsync(userId)).ReturnsAsync(bookings);

        var result = await _sut.GetAllAsync(userId, RoleConstants.User);

        result.Should().HaveCount(1);
        _bookingRepoMock.Verify(r => r.GetAllByUserAsync(userId), Times.Once);
        _bookingRepoMock.Verify(r => r.GetAllByAdminAsync(It.IsAny<Guid>()), Times.Never);
    }

    [Fact]
    public async Task GetAllAsync_RoleAdmin_ReturnsAllAdminBookings()
    {
        var adminId = Guid.NewGuid();
        var bookings = new List<Booking>
        {
            BookingBuilder.Default().Build(),
            BookingBuilder.Default().Build()
        };
        _bookingRepoMock.Setup(r => r.GetAllByAdminAsync(adminId)).ReturnsAsync(bookings);

        var result = await _sut.GetAllAsync(adminId, RoleConstants.Admin);

        result.Should().HaveCount(2);
        _bookingRepoMock.Verify(r => r.GetAllByAdminAsync(adminId), Times.Once);
        _bookingRepoMock.Verify(r => r.GetAllByUserAsync(It.IsAny<Guid>()), Times.Never);
    }

    [Fact]
    public async Task GetByIdAsync_OwnerUser_ReturnsBookingDto()
    {
        var userId = Guid.NewGuid();
        var booking = BookingBuilder.Default().ForUser(userId).Build();
        _bookingRepoMock.Setup(r => r.GetByIdAsync(booking.Id)).ReturnsAsync(booking);

        var result = await _sut.GetByIdAsync(booking.Id, userId, RoleConstants.User);

        result.Should().NotBeNull();
        result!.Id.Should().Be(booking.Id);
    }

    [Fact]
    public async Task GetByIdAsync_NotOwnerUser_ThrowsUnauthorizedAccessException()
    {
        var ownerId = Guid.NewGuid();
        var otherUserId = Guid.NewGuid();
        var booking = BookingBuilder.Default().ForUser(ownerId).Build();
        _bookingRepoMock.Setup(r => r.GetByIdAsync(booking.Id)).ReturnsAsync(booking);

        var act = () => _sut.GetByIdAsync(booking.Id, otherUserId, RoleConstants.User);

        await act.Should().ThrowAsync<UnauthorizedAccessException>();
    }

    [Fact]
    public async Task GetByIdAsync_AdminOwnsCourtBooking_ReturnsBookingDto()
    {
        var adminId = Guid.NewGuid();
        var court = CourtBuilder.Default().CreatedBy(adminId).Build();
        var booking = BookingBuilder.Default().ForCourt(court).Build();
        _bookingRepoMock.Setup(r => r.GetByIdAsync(booking.Id)).ReturnsAsync(booking);

        var result = await _sut.GetByIdAsync(booking.Id, adminId, RoleConstants.Admin);

        result.Should().NotBeNull();
    }

    [Fact]
    public async Task GetByIdAsync_AdminNotOwner_ThrowsUnauthorizedAccessException()
    {
        var ownerAdminId = Guid.NewGuid();
        var otherAdminId = Guid.NewGuid();
        var court = CourtBuilder.Default().CreatedBy(ownerAdminId).Build();
        var booking = BookingBuilder.Default().ForCourt(court).Build();
        _bookingRepoMock.Setup(r => r.GetByIdAsync(booking.Id)).ReturnsAsync(booking);

        var act = () => _sut.GetByIdAsync(booking.Id, otherAdminId, RoleConstants.Admin);

        await act.Should().ThrowAsync<UnauthorizedAccessException>();
    }

    [Fact]
    public async Task GetByCourtAndDateAsync_ReturnsOnlyActiveBookingsForCourtAndDate()
    {
        var courtId = Guid.NewGuid();
        var date = DateTime.UtcNow.Date.AddDays(3);

        var bookings = new List<Booking>
        {
            BookingBuilder.Default().ForCourt(courtId).OnDate(date).WithStatus(BookingStatusConstants.Active).Build(),
            BookingBuilder.Default().ForCourt(courtId).OnDate(date).Cancelled().Build(),
            BookingBuilder.Default().ForCourt(Guid.NewGuid()).OnDate(date).WithStatus(BookingStatusConstants.Active).Build(), // outra quadra
            BookingBuilder.Default().ForCourt(courtId).OnDate(date.AddDays(1)).WithStatus(BookingStatusConstants.Active).Build(), // outro dia
        };

        _bookingRepoMock.Setup(r => r.GetAllAsync()).ReturnsAsync(bookings);

        var result = await _sut.GetByCourtAndDateAsync(courtId, date);

        result.Should().HaveCount(1);
    }

    //  CreateAsync — conflitos de horário

    [Fact]
    public async Task CreateAsync_NoConflict_ReturnsBookingDto()
    {
        var courtId = Guid.NewGuid();
        var existingBookings = new List<Booking>
        {
            BookingBuilder.Default().ForCourt(courtId)
                .OnDate(DateTime.UtcNow.Date.AddDays(7))
                .FromTo(new TimeSpan(8, 0, 0), new TimeSpan(9, 0, 0))
                .Build()
        };

        _bookingRepoMock.Setup(r => r.GetAllAsync()).ReturnsAsync(existingBookings);
        _bookingRepoMock.Setup(r => r.AddAsync(It.IsAny<Booking>()))
            .ReturnsAsync((Booking b) => b);

        var dto = new CreateBookingDto
        {
            CourtId = courtId,
            ClientName = "Cliente",
            NumberOfPeople = 2,
            Date = DateTime.UtcNow.Date.AddDays(7),
            StartTime = new TimeSpan(10, 0, 0), // após a reserva existente
            EndTime = new TimeSpan(11, 0, 0)
        };

        var result = await _sut.CreateAsync(dto, Guid.NewGuid());

        result.Should().NotBeNull();
        result.Status.Should().Be(BookingStatusConstants.Active);
    }

    [Theory]
    [InlineData(9, 0, 10, 0, 9, 30, 10, 30)]  // Novo início dentro do existente
    [InlineData(9, 0, 10, 0, 8, 0, 9, 30)]    // Novo fim dentro do existente
    [InlineData(9, 0, 10, 0, 8, 0, 11, 0)]    // Novo engloba o existente
    [InlineData(9, 0, 10, 0, 9, 15, 9, 45)]   // Existente engloba o novo
    public async Task CreateAsync_TimeConflict_ThrowsInvalidOperationException(
        int existStartH, int existStartM, int existEndH, int existEndM,
        int newStartH, int newStartM, int newEndH, int newEndM)
    {
        var courtId = Guid.NewGuid();
        var date = DateTime.UtcNow.Date.AddDays(7);

        var existingBookings = new List<Booking>
        {
            BookingBuilder.Default()
                .ForCourt(courtId)
                .OnDate(date)
                .FromTo(new TimeSpan(existStartH, existStartM, 0), new TimeSpan(existEndH, existEndM, 0))
                .Build()
        };

        _bookingRepoMock.Setup(r => r.GetAllAsync()).ReturnsAsync(existingBookings);

        var dto = new CreateBookingDto
        {
            CourtId = courtId,
            ClientName = "Conflito",
            NumberOfPeople = 1,
            Date = date,
            StartTime = new TimeSpan(newStartH, newStartM, 0),
            EndTime = new TimeSpan(newEndH, newEndM, 0)
        };

        var act = () => _sut.CreateAsync(dto, Guid.NewGuid());

        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("*Conflito de horário*");
    }

    //  UpdateStatusAsync — cancelamento

    [Fact]
    public async Task UpdateStatusAsync_Cancel_BeforeDeadline_UpdatesStatus()
    {
        var userId = Guid.NewGuid();
        // Reserva daqui a 48h, prazo de cancelamento = 24h → dentro do prazo
        var futureDate = DateTime.UtcNow.AddHours(48).Date;
        var startTime = new TimeSpan(10, 0, 0);
        var court = CourtBuilder.Default().WithCancellationDeadline(24).Build();
        var booking = BookingBuilder.Default()
            .ForUser(userId)
            .ForCourt(court)
            .OnDate(futureDate)
            .FromTo(startTime, startTime.Add(TimeSpan.FromHours(1)))
            .Build();

        _bookingRepoMock.Setup(r => r.GetByIdAsync(booking.Id)).ReturnsAsync(booking);
        _courtRepoMock.Setup(r => r.GetByIdAsync(booking.CourtId)).ReturnsAsync(court);
        _bookingRepoMock.Setup(r => r.UpdateAsync(It.IsAny<Booking>())).Returns(Task.CompletedTask);

        await _sut.UpdateStatusAsync(booking.Id, BookingStatusConstants.Cancelled, userId, RoleConstants.User);

        booking.Status.Should().Be(BookingStatusConstants.Cancelled);
        _bookingRepoMock.Verify(r => r.UpdateAsync(booking), Times.Once);
    }

    [Fact]
    public async Task UpdateStatusAsync_Cancel_AfterDeadline_ThrowsInvalidOperationException()
    {
        var userId = Guid.NewGuid();
        // Reserva daqui a 2h, prazo = 24h → fora do prazo
        var nearDate = DateTime.UtcNow.AddHours(2).Date;
        var startTime = DateTime.UtcNow.AddHours(2).TimeOfDay;
        var court = CourtBuilder.Default().WithCancellationDeadline(24).Build();
        var booking = BookingBuilder.Default()
            .ForUser(userId)
            .ForCourt(court)
            .OnDate(nearDate)
            .FromTo(startTime, startTime.Add(TimeSpan.FromHours(1)))
            .Build();

        _bookingRepoMock.Setup(r => r.GetByIdAsync(booking.Id)).ReturnsAsync(booking);
        _courtRepoMock.Setup(r => r.GetByIdAsync(booking.CourtId)).ReturnsAsync(court);

        var act = () => _sut.UpdateStatusAsync(booking.Id, BookingStatusConstants.Cancelled, userId, RoleConstants.User);

        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("*Cancelamento não permitido*");
    }

    [Fact]
    public async Task UpdateStatusAsync_NotOwnerUser_ThrowsUnauthorizedAccessException()
    {
        var ownerId = Guid.NewGuid();
        var otherId = Guid.NewGuid();
        var booking = BookingBuilder.Default().ForUser(ownerId).Build();
        _bookingRepoMock.Setup(r => r.GetByIdAsync(booking.Id)).ReturnsAsync(booking);

        var act = () => _sut.UpdateStatusAsync(booking.Id, BookingStatusConstants.Cancelled, otherId, RoleConstants.User);

        await act.Should().ThrowAsync<UnauthorizedAccessException>();
    }

    [Fact]
    public async Task DeleteAsync_ValidId_CallsDeleteRepository()
    {
        var bookingId = Guid.NewGuid();
        _bookingRepoMock.Setup(r => r.DeleteAsync(bookingId)).Returns(Task.CompletedTask);

        await _sut.DeleteAsync(bookingId);

        _bookingRepoMock.Verify(r => r.DeleteAsync(bookingId), Times.Once);
    }
}
