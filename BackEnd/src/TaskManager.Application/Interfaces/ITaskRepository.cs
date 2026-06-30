using TaskManager.Application.DTOs;

namespace TaskManager.Application.Interfaces;

public interface ITaskRepository
{
    Task<IEnumerable<TaskDto>> GetAllAsync(TaskFilterDto filter);
    Task<TaskDto?>             GetByIdAsync(int id);
}