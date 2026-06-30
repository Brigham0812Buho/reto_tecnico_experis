using TaskManager.Domain.Enums;
using TaskManager.Domain.Exceptions;

namespace TaskManager.Domain.Entities;

public class TaskItem
{
    public int        Id          { get; private set; }
    public string     Title       { get; private set; } = string.Empty;
    public string?    Description { get; private set; }
    public Priority   Priority    { get; private set; }
    public StatusType Status      { get; private set; }
    public DateTime   CreatedAt   { get; private set; }
    public DateTime?  UpdatedAt   { get; private set; }

    public TaskItem(
        int id,
        string title,
        string? description,
        Priority priority,
        StatusType status,
        DateTime createdAt,
        DateTime? updatedAt)
    {
        ValidateTitle(title);

        Id          = id;
        Title       = title;
        Description = description;
        Priority    = priority;
        Status      = status;
        CreatedAt   = createdAt;
        UpdatedAt   = updatedAt;
    }

    private static void ValidateTitle(string title)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new DomainException("Task title cannot be empty.");

        if (title.Length > 200)
            throw new DomainException("Task title cannot exceed 200 characters.");
    }
}