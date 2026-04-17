using Application;
using Repositories;
using SqlServer;
using Project;
using WebAPI.Middlewares;
using FluentValidation;
using FluentValidation.AspNetCore;
using Application.Dto.Dtos.Validators;
using SqlServer.Context;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<LoginDtoValidator>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddApplicationDependencyInjection();
builder.Services.AddRepositoryDependencyInjection();
builder.Services.AddSqlServerDbContext(builder.Configuration);
builder.Services.AddProjetoDependencyInjection(builder.Configuration);

builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

app.UseSwagger();
app.UseSwaggerUI();

// app.UseHttpsRedirection(); // Removido para evitar conflito com o Proxy Reverso do Painel
app.UseCors("AllowAll");

app.UseExceptionHandler();

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
public partial class Program { }
