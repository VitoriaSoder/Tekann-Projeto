using System.ComponentModel.DataAnnotations;

namespace Application.Dto.Dtos.Users;

public class UpdateProfileDto
{
    [Required(ErrorMessage = "Name is required")]
    public string Name { get; set; } = string.Empty;
}
