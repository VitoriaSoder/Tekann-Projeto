using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace Project;

public static class ProjetoDependencyInjection
{
    public static IServiceCollection AddProjetoDependencyInjection(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var jwtConfig = configuration.GetSection("JwtConfiguration").Get<JwtConfiguration>()
            ?? throw new InvalidOperationException("JwtConfiguration não encontrada no appsettings.");

        services.Configure<JwtConfiguration>(configuration.GetSection("JwtConfiguration"));

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = jwtConfig.Issuer,
                ValidAudience = jwtConfig.Audience,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtConfig.Secret))
            };
        });

        return services;
    }
}
