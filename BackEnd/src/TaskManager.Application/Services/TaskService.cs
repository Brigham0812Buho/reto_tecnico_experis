using TaskManager.Application.DTOs;
using TaskManager.Application.Interfaces;

namespace TaskManager.Application.Services;

public class TaskService : ITaskService
{
    private readonly ITaskRepository _repository;

    public TaskService(ITaskRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<TaskDto>> GetTasksAsync(TaskFilterDto filter)
    {
        return await _repository.GetAllAsync(filter);
    }

    public async Task<TaskDto?> GetTaskByIdAsync(int id)
    {
        if (id <= 0)
            throw new ArgumentException("Task ID must be greater than zero.", nameof(id));

        return await _repository.GetByIdAsync(id);
    }
}