using Microsoft.AspNetCore.Mvc;
using TaskManager.Application.DTOs;
using TaskManager.Application.Interfaces;

namespace TaskManager.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController : ControllerBase
{
    private readonly ITaskService _taskService;

    public TasksController(ITaskService taskService)
    {
        _taskService = taskService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] int? statusId,
        [FromQuery] int? priorityId)
    {
        var filter = new TaskFilterDto
        {
            StatusId   = statusId,
            PriorityId = priorityId
        };

        var tasks = await _taskService.GetTasksAsync(filter);
        return Ok(tasks);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var task = await _taskService.GetTaskByIdAsync(id);

        if (task is null)
            return NotFound(new { message = $"Task with ID {id} was not found." });

        return Ok(task);
    }
}