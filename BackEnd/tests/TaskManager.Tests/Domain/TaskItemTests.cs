using TaskManager.Domain.Entities;
using TaskManager.Domain.Enums;
using TaskManager.Domain.Exceptions;
using Xunit;

namespace TaskManager.Tests.Domain;

/// Pruebas de la entidad <see cref="TaskItem"/>.
/// Cubren las reglas de negocio que protege el constructor mediante
/// <c>ValidateTitle</c>, garantizando que ningún TaskItem pueda existir
/// en un estado inválido (regla central de Domain-Driven Design).
public class TaskItemTests
{
    /// Caso ideal: con datos válidos, el TaskItem se crea sin lanzar
    /// excepciones y sus propiedades quedan correctamente asignadas.

    [Fact]
    public void Constructor_WithValidData_CreatesTaskItem()
    {
        // Arrange & Act
        var task = new TaskItem(
            id: 1,
            title: "Pagar el recibo de luz",
            description: "Pagar antes de fin de mes.",
            priority: Priority.High,
            status: StatusType.Pending,
            createdAt: DateTime.UtcNow,
            updatedAt: null
        );

        // Assert
        Assert.Equal(1, task.Id);
        Assert.Equal("Pagar el recibo de luz", task.Title);
        Assert.Equal(Priority.High, task.Priority);
    }

    /// Caso edge: un título vacío viola la regla de negocio y debe
    /// rechazarse antes de que el objeto exista, no después.
    [Fact]
    public void Constructor_WithEmptyTitle_ThrowsDomainException()
    {
        // Act & Assert
        var exception = Assert.Throws<DomainException>(() =>
            new TaskItem(
                id: 1,
                title: "",
                description: null,
                priority: Priority.Medium,
                status: StatusType.Pending,
                createdAt: DateTime.UtcNow,
                updatedAt: null
            )
        );

        Assert.Equal("Task title cannot be empty.", exception.Message);
    }

    /// Caso edge: un título compuesto solo por espacios en blanco
    /// pasaría una validación ingenua de "no vacío" pero sigue sin
    /// tener contenido real. <c>string.IsNullOrWhiteSpace</c> lo cubre.
    
    [Fact]
    public void Constructor_WithWhitespaceTitle_ThrowsDomainException()
    {
        // Act & Assert
        Assert.Throws<DomainException>(() =>
            new TaskItem(
                id: 1,
                title: "   ",
                description: null,
                priority: Priority.Medium,
                status: StatusType.Pending,
                createdAt: DateTime.UtcNow,
                updatedAt: null
            )
        );
    }

    /// Caso edge: un título que excede el límite máximo de 200
    /// caracteres definido por la regla de negocio debe rechazarse.
    /// 
    [Fact]
    public void Constructor_WithTitleExceeding200Characters_ThrowsDomainException()
    {
        // Arrange
        var longTitle = new string('a', 201);

        // Act & Assert
        var exception = Assert.Throws<DomainException>(() =>
            new TaskItem(
                id: 1,
                title: longTitle,
                description: null,
                priority: Priority.Medium,
                status: StatusType.Pending,
                createdAt: DateTime.UtcNow,
                updatedAt: null
            )
        );

        Assert.Equal("Task title cannot exceed 200 characters.", exception.Message);
    }

    /// Caso límite (boundary test): exactamente 200 caracteres es el
    /// borde permitido por la regla, no debe lanzar excepción. Probar
    /// el límite exacto, y no solo "muy corto" / "muy largo", evita que
    /// un error de un solo carácter (ej. &lt;= en vez de &lt;) pase desapercibido.
    [Fact]
    public void Constructor_WithTitleAt200Characters_DoesNotThrow()
    {
        // Arrange
        var titleAt200 = new string('a', 200);

        // Act
        var task = new TaskItem(
            id: 1,
            title: titleAt200,
            description: null,
            priority: Priority.Low,
            status: StatusType.Pending,
            createdAt: DateTime.UtcNow,
            updatedAt: null
        );

        // Assert
        Assert.Equal(200, task.Title.Length);
    }
}