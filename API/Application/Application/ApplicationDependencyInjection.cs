using Application.Application.Courts;
using Application.Application.Bookings;
using Application.Application.Users;
using Microsoft.Extensions.DependencyInjection;

namespace Application;

public static class ApplicationDependencyInjection
{
    public static IServiceCollection AddApplicationDependencyInjection(this IServiceCollection services)
    {
        services.AddScoped<ICourtService, CourtService>();
        services.AddScoped<IBookingService, BookingService>();
        services.AddScoped<IUserService, UserService>();

        return services;
    }
}
