-- ============================================================
-- 00. SETUP COMPLETO - Task Management Database
-- Ejecuta todos los scripts en el orden correcto.
-- ============================================================

:r 01_create_database.sql
:r 02_create_tables.sql
:r 03_seed_data.sql
:r stored_procedures\sp_GetTasks.sql
:r stored_procedures\sp_GetTaskById.sql
:r stored_procedures\sp_GetCatalogs.sql

PRINT 'Setup completado exitosamente.'
GO