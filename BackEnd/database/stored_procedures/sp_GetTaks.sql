-- ============================================================
-- sp_GetTasks
-- Obtiene todas las tareas, con filtros opcionales por estado y prioridad.
-- ============================================================

USE TaskManagementDB;
GO

IF OBJECT_ID('dbo.sp_GetTasks', 'P') IS NOT NULL DROP PROCEDURE dbo.sp_GetTasks;
GO

CREATE PROCEDURE dbo.sp_GetTasks
    @StatusId   INT = NULL,
    @PriorityId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        t.Id,
        t.Title,
        t.Description,
        p.Id   AS PriorityId,
        p.Name AS PriorityName,
        s.Id   AS StatusId,
        s.Name AS StatusName,
        t.CreatedAt,
        t.UpdatedAt
    FROM dbo.Tasks t
    INNER JOIN dbo.Priorities p ON t.PriorityId = p.Id
    INNER JOIN dbo.Statuses   s ON t.StatusId   = s.Id
    WHERE
        (@StatusId   IS NULL OR t.StatusId   = @StatusId)
        AND (@PriorityId IS NULL OR t.PriorityId = @PriorityId)
    ORDER BY
        p.[Order] DESC,  -- Alta primero
        t.CreatedAt DESC;
END
GO