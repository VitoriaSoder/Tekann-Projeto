using Application.Application.Bookings;
using Application.Dto.Dtos.Bookings;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.Project.Constants;

namespace WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BookingsController : ControllerBase
{
    private readonly IBookingService _bookingService;

    public BookingsController(IBookingService bookingService)
    {
        _bookingService = bookingService;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResult<BookingDto>>> GetAll(
        [FromQuery] string? search = null,
        [FromQuery] int page = 1,
        [FromQuery] int limit = 10,
        [FromQuery] string? sortBy = null,
        [FromQuery] string? order = null)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? Guid.Empty.ToString());
        var role = User.FindFirstValue(ClaimTypes.Role) ?? RoleConstants.User;

        var result = await _bookingService.GetAllAsync(userId, role, search, page, limit, sortBy, order);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<BookingDto>> GetById(Guid id)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? Guid.Empty.ToString());
        var role = User.FindFirstValue(ClaimTypes.Role) ?? RoleConstants.User;

        var result = await _bookingService.GetByIdAsync(id, userId, role);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpGet("court/{courtId}/date/{date}")]
    public async Task<ActionResult<IEnumerable<BookingDto>>> GetByCourtAndDate(Guid courtId, DateTime date)
    {
        var result = await _bookingService.GetByCourtAndDateAsync(courtId, date);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<BookingDto>> Create(CreateBookingDto dto)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? Guid.Empty.ToString());
        var result = await _bookingService.CreateAsync(dto, userId);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateBookingStatusDto dto)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? Guid.Empty.ToString());
        var role = User.FindFirstValue(ClaimTypes.Role) ?? RoleConstants.User;

        await _bookingService.UpdateStatusAsync(id, dto.Status, userId, role);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _bookingService.DeleteAsync(id);
        return NoContent();
    }
}
