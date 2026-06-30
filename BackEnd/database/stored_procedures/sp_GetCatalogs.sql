-- ============================================================
-- sp_GetCatalogs
-- Obtiene los catálogos de Prioridades y Estados.
-- Usado por el frontend para poblar los controles de filtro.
-- ============================================================

USE TaskManagementDB;
GO

IF OBJECT_ID('dbo.sp_GetCatalogs', 'P') IS NOT NULL DROP PROCEDURE dbo.sp_GetCatalogs;
GO

CREATE PROCEDURE dbo.sp_GetCatalogs
AS
BEGIN
    SET NOCOUNT ON;

    SELECT Id, Name, [Order] FROM dbo.Priorities ORDER BY [Order];
    SELECT Id, Name           FROM dbo.Statuses;
END
GO