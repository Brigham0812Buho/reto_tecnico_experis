-- ============================================================
-- 03. DATOS POR DEFECTO Y DATOS DE PRUEBA
-- ============================================================

USE TaskManagementDB;
GO

-- ============================================================
-- Catálogos
-- ============================================================

INSERT INTO dbo.Priorities (Id, Name, [Order]) VALUES
    (1, 'Baja', 1),
    (2, 'Media', 2),
    (3, 'Alta', 3);
GO

INSERT INTO dbo.Statuses (Id, Name) VALUES
    (1, 'Pendiente'),
    (2, 'En progreso'),
    (3, 'Completada');
GO

-- ============================================================
-- Datos de prueba: Tareas
-- ============================================================

INSERT INTO dbo.Tasks (Title, Description, PriorityId, StatusId) VALUES
    (
        'Pagar el recibo de luz',
        'El recibo vence a fin de mes, pagar antes para evitar corte de servicio.',
        3, 1
    ),
    (
        'Comprar víveres de la semana',
        'Lista pendiente: arroz, aceite, verduras y frutas para la semana.',
        2, 1
    ),
    (
        'Llevar el auto al taller',
        'Revisión de frenos y cambio de aceite, agendar cita con el mecánico.',
        2, 2
    ),
    (
        'Estudiar para el examen de certificación',
        'Repasar los temas 3 y 4 del material de estudio antes del examen del viernes.',
        3, 2
    ),
    (
        'Organizar el armario',
        'Separar ropa de invierno y verano, donar lo que ya no se usa.',
        1, 1
    ),
    (
        'Renovar el seguro del hogar',
        'La póliza actual vence en dos semanas, comparar cotizaciones antes de renovar.',
        3, 1
    ),
    (
        'Preparar presentación para el equipo',
        'Resumen de avances del trimestre para la reunión del lunes.',
        3, 2
    ),
    (
        'Agendar cita con el dentista',
        'Pendiente desde hace dos meses, llamar para confirmar disponibilidad.',
        2, 1
    ),
    (
        'Actualizar el currículum',
        'Agregar el último proyecto y certificaciones recientes.',
        1, 1
    ),
    (
        'Hacer mantenimiento de la laptop',
        'Liberar espacio en disco y actualizar el sistema operativo.',
        1, 3
    ),
    (
        'Reservar boletos para el viaje',
        'Comparar precios de vuelos antes de que suban por temporada alta.',
        2, 3
    ),
    (
        'Leer el libro pendiente del mes',
        'Avanzar al menos tres capítulos para terminarlo antes de fin de mes.',
        1, 2
    );
GO