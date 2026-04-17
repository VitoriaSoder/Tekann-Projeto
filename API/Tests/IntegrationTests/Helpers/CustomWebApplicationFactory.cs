using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using SqlServer.Context;

namespace IntegrationTests.Helpers;

public class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    private readonly string _dbName = $"TestDb_{Guid.NewGuid()}";

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            var efDescriptors = services.Where(d => d.ServiceType.FullName != null && d.ServiceType.FullName.Contains("EntityFrameworkCore")).ToList();
            foreach (var d in efDescriptors) services.Remove(d);

            var sqlDescriptors = services.Where(d => d.ServiceType.FullName != null && d.ServiceType.FullName.Contains("SqlServer")).ToList();
            foreach (var d in sqlDescriptors) services.Remove(d);

            services.RemoveAll(typeof(System.Data.Common.DbConnection));

            services.AddDbContext<AppDbContext>(options =>
                options.UseInMemoryDatabase(_dbName));
        });

        builder.UseEnvironment("Development");
    }

    /// <summary>
    /// Retorna um escopo de serviço para seed e interação direta com o banco InMemory.
    /// </summary>
    public IServiceScope CreateTestScope() => Services.CreateScope();
}
