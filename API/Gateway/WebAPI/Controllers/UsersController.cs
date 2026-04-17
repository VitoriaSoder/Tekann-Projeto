using Application.Application.Users;
using Application.Dto.Dtos.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Domain.Project.Constants;

namespace WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = RoleConstants.Admin)]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserAdminDto>>> GetAll()
    {
        var result = await _userService.GetAllAsync();
        return Ok(result);
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateUserStatusDto dto)
    {
        await _userService.UpdateStatusAsync(id, dto.IsActive);
        return NoContent();
    }
}
