using Microsoft.Extensions.DependencyInjection;
using TaskManager.Application.Interfaces;
using TaskManager.Application.Services;
using TaskManager.Infrastructure.Data;
using TaskManager.Infrastructure.Repositories;

namespace TaskManager.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        string connectionString)
    {
        services.AddSingleton(new DbConnectionFactory(connectionString));
        services.AddScoped<ITaskRepository, TaskRepository>();
        services.AddScoped<ITaskService,    TaskService>();

        return services;
    }
}