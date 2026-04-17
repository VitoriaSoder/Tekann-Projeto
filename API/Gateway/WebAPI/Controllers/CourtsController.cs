using Application.Application.Courts;
using Application.Dto.Dtos.Courts;
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
public class CourtsController : ControllerBase
{
    private readonly ICourtService _courtService;

    public CourtsController(ICourtService courtService)
    {
        _courtService = courtService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CourtDto>>> GetAll()
    {
        var role = User.FindFirstValue(ClaimTypes.Role) ?? RoleConstants.User;

        if (role == RoleConstants.Admin)
        {
            var adminId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? Guid.Empty.ToString());
            var adminResult = await _courtService.GetAllByAdminAsync(adminId);
            return Ok(adminResult);
        }

        var result = await _courtService.GetAllAsync();
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<CourtDto>> GetById(Guid id)
    {
        var result = await _courtService.GetByIdAsync(id);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = RoleConstants.Admin)]
    public async Task<ActionResult<CourtDto>> Create(CreateCourtDto dto)
    {
        var adminId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? Guid.Empty.ToString());
        var result = await _courtService.CreateAsync(dto, adminId);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = RoleConstants.Admin)]
    public async Task<IActionResult> Update(Guid id, UpdateCourtDto dto)
    {
        var adminId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? Guid.Empty.ToString());
        await _courtService.UpdateAsync(id, dto, adminId);
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = RoleConstants.Admin)]
    public async Task<IActionResult> Delete(Guid id)
    {
        var adminId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? Guid.Empty.ToString());
        await _courtService.DeleteAsync(id, adminId);
        return NoContent();
    }
}
