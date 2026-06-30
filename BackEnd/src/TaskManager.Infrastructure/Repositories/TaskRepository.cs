using Dapper;
using TaskManager.Application.DTOs;
using TaskManager.Application.Interfaces;
using TaskManager.Infrastructure.Data;

namespace TaskManager.Infrastructure.Repositories;

public class TaskRepository : ITaskRepository
{
    private readonly DbConnectionFactory _connectionFactory;

    public TaskRepository(DbConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }

    public async Task<IEnumerable<TaskDto>> GetAllAsync(TaskFilterDto filter)
    {
        using var connection = _connectionFactory.CreateConnection();

        var parameters = new DynamicParameters();
        parameters.Add("@StatusId",   filter.StatusId);
        parameters.Add("@PriorityId", filter.PriorityId);

        return await connection.QueryAsync<TaskDto>(
            "sp_GetTasks",
            parameters,
            commandType: System.Data.CommandType.StoredProcedure
        );
    }

    public async Task<TaskDto?> GetByIdAsync(int id)
    {
        using var connection = _connectionFactory.CreateConnection();

        var parameters = new DynamicParameters();
        parameters.Add("@Id", id);

        return await connection.QueryFirstOrDefaultAsync<TaskDto>(
            "sp_GetTaskById",
            parameters,
            commandType: System.Data.CommandType.StoredProcedure
        );
    }
}