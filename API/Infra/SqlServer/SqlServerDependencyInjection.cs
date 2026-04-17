using Microsoft.Extensions.DependencyInjection;

namespace SqlServer;

public static class SqlServerDependencyInjection
{
    public static IServiceCollection AddSqlServerDependencyInjection(this IServiceCollection services)
    {
        // Registre serviços de infraestrutura aqui
        // Exemplo: services.AddScoped<IBlobService, BlobService>();

        return services;
    }
}
