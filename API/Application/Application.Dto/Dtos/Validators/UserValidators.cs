using FluentValidation;
using Application.Dto.Dtos.Users;

namespace Application.Dto.Dtos.Validators;

public class LoginDtoValidator : AbstractValidator<LoginDto>
{
    public LoginDtoValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress().WithMessage("Um e-mail válido é obrigatório.");
        RuleFor(x => x.Password).NotEmpty().WithMessage("A senha é obrigatória.");
    }
}

public class RegisterDtoValidator : AbstractValidator<RegisterDto>
{
    public RegisterDtoValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MinimumLength(3).WithMessage("O nome deve ter no mínimo 3 caracteres.");
        RuleFor(x => x.Email).NotEmpty().EmailAddress().WithMessage("Um e-mail válido é obrigatório.");
        RuleFor(x => x.Password).NotEmpty().MinimumLength(6).WithMessage("A senha deve ter no mínimo 6 caracteres.");
    }
}
