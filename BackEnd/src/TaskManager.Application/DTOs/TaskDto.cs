namespace TaskManager.Application.DTOs;

public class TaskDto
{
    public int     Id           { get; init; }
    public string  Title        { get; init; } = string.Empty;
    public string? Description  { get; init; }
    public int     PriorityId   { get; init; }
    public string  PriorityName { get; init; } = string.Empty;
    public int     StatusId     { get; init; }
    public string  StatusName   { get; init; } = string.Empty;
    public DateTime  CreatedAt  { get; init; }
    public DateTime? UpdatedAt  { get; init; }
}