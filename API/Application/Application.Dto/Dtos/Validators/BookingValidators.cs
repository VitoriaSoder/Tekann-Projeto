using FluentValidation;
using Application.Dto.Dtos.Bookings;

namespace Application.Dto.Dtos.Validators;

public class CreateBookingDtoValidator : AbstractValidator<CreateBookingDto>
{
    public CreateBookingDtoValidator()
    {
        RuleFor(x => x.CourtId).NotEmpty().WithMessage("A quadra é obrigatória.");
        RuleFor(x => x.ClientName).NotEmpty().WithMessage("O nome do cliente é obrigatório.");
        RuleFor(x => x.NumberOfPeople).GreaterThan(0).WithMessage("O número de pessoas deve ser maior que zero.");
        RuleFor(x => x.Date).NotEmpty().WithMessage("A data da reserva é obrigatória.");
        RuleFor(x => x.StartTime).NotEmpty().WithMessage("A hora de início é obrigatória.");
        RuleFor(x => x.EndTime).NotEmpty().GreaterThan(x => x.StartTime).WithMessage("A hora de término deve ser posterior à hora de início.");
    }
}
