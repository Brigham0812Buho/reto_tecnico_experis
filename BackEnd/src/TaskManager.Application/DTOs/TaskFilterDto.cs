namespace TaskManager.Application.DTOs;

public class TaskFilterDto
{
    public int? StatusId   { get; init; }
    public int? PriorityId { get; init; }
}