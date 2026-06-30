using TaskManager.Application.DTOs;

namespace TaskManager.Application.Interfaces;

public interface ITaskService
{
    Task<IEnumerable<TaskDto>> GetTasksAsync(TaskFilterDto filter);
    Task<TaskDto?>             GetTaskByIdAsync(int id);
}