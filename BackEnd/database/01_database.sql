
-- ============================================================
-- 01. CREACIÓN DE LA BASE DE DATOS
-- ============================================================
 
USE master;
GO
 
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'TaskManagementDB')
BEGIN
    CREATE DATABASE TaskManagementDB;
END
GO
 