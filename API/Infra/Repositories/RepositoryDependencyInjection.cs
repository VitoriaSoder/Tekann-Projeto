using Microsoft.Extensions.DependencyInjection;
using Repositories.Interfaces.Courts;
using Repositories.Interfaces.Bookings;
using Repositories.Interfaces.Users;
using Repositories.Repositories.Courts;
using Repositories.Repositories.Bookings;
using Repositories.Repositories.Users;

namespace Repositories;

public static class RepositoryDependencyInjection
{
    public static IServiceCollection AddRepositoryDependencyInjection(this IServiceCollection services)
    {
        services.AddScoped<ICourtRepository, CourtRepository>();
        services.AddScoped<IBookingRepository, BookingRepository>();
        services.AddScoped<IUserRepository, UserRepository>();

        return services;
    }
}
