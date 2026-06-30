-- ============================================================
-- 02. ESQUEMA: TABLAS E ÍNDICES
-- ============================================================

USE TaskManagementDB;
GO

-- Tabla catálogo: Prioridades
IF OBJECT_ID('dbo.Priorities', 'U') IS NOT NULL DROP TABLE dbo.Priorities;
GO

CREATE TABLE dbo.Priorities (
    Id      INT          NOT NULL CONSTRAINT PK_Priorities PRIMARY KEY,
    Name    NVARCHAR(50) NOT NULL,
    [Order] INT          NOT NULL  -- Para ordenar: Baja=1, Media=2, Alta=3
);
GO

-- Tabla catálogo: Estados
IF OBJECT_ID('dbo.Statuses', 'U') IS NOT NULL DROP TABLE dbo.Statuses;
GO

CREATE TABLE dbo.Statuses (
    Id   INT          NOT NULL CONSTRAINT PK_Statuses PRIMARY KEY,
    Name NVARCHAR(50) NOT NULL
);
GO

-- Tabla principal: Tareas
IF OBJECT_ID('dbo.Tasks', 'U') IS NOT NULL DROP TABLE dbo.Tasks;
GO

CREATE TABLE dbo.Tasks (
    Id          INT            NOT NULL CONSTRAINT PK_Tasks PRIMARY KEY IDENTITY(1,1),
    Title       NVARCHAR(200)  NOT NULL,
    Description NVARCHAR(1000) NULL,
    PriorityId  INT            NOT NULL CONSTRAINT FK_Tasks_Priorities FOREIGN KEY REFERENCES dbo.Priorities(Id),
    StatusId    INT            NOT NULL CONSTRAINT FK_Tasks_Statuses   FOREIGN KEY REFERENCES dbo.Statuses(Id),
    CreatedAt   DATETIME2      NOT NULL CONSTRAINT DF_Tasks_CreatedAt DEFAULT GETUTCDATE(),
    UpdatedAt   DATETIME2      NULL
);
GO

-- Índices para optimizar filtrado
CREATE INDEX IX_Tasks_PriorityId ON dbo.Tasks (PriorityId);
CREATE INDEX IX_Tasks_StatusId   ON dbo.Tasks (StatusId);
GO