-- ============================================================
-- sp_GetTaskById
-- Obtiene el detalle de una tarea específica por su Id.
-- ============================================================

USE TaskManagementDB;
GO

IF OBJECT_ID('dbo.sp_GetTaskById', 'P') IS NOT NULL DROP PROCEDURE dbo.sp_GetTaskById;
GO

CREATE PROCEDURE dbo.sp_GetTaskById
    @Id INT
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
    WHERE t.Id = @Id;
END
GO