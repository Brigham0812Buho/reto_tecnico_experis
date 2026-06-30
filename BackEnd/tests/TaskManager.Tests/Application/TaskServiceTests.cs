using Moq;
using TaskManager.Application.DTOs;
using TaskManager.Application.Interfaces;
using TaskManager.Application.Services;
using Xunit;

namespace TaskManager.Tests.Application;

/// El repositorio se simula con Moq para probar la lógica del Service
/// de forma aislada, sin depender de una base de datos real. Esto
/// confirma el comportamiento del Service (delegación, validación,
/// manejo de "no encontrado") sin convertir el test en una prueba de
/// integración.
public class TaskServiceTests
{
    private readonly Mock<ITaskRepository> _repositoryMock;
    private readonly TaskService _service;

    public TaskServiceTests()
    {
        _repositoryMock = new Mock<ITaskRepository>();
        _service = new TaskService(_repositoryMock.Object);
    }

    /// Caso ideal: el Service debe delegar el filtro recibido tal
    /// cual al repositorio, sin transformarlo. El Service no contiene
    /// lógica de filtrado propia, solo orquesta.
    
    [Fact]
    public async Task GetTasksAsync_CallsRepositoryWithFilter()
    {
        // Arrange
        var filter = new TaskFilterDto { StatusId = 1, PriorityId = 3 };
        _repositoryMock
            .Setup(r => r.GetAllAsync(filter))
            .ReturnsAsync(new List<TaskDto>());

        // Act
        await _service.GetTasksAsync(filter);

        // Assert
        _repositoryMock.Verify(r => r.GetAllAsync(filter), Times.Once);
    }

    /// Caso ideal: con un id válido y existente, el Service retorna
    /// el DTO que provee el repositorio sin alterarlo.
    
    [Fact]
    public async Task GetTaskByIdAsync_WithValidId_ReturnsTask()
    {
        // Arrange
        var expectedTask = new TaskDto { Id = 1, Title = "Comprar víveres" };
        _repositoryMock
            .Setup(r => r.GetByIdAsync(1))
            .ReturnsAsync(expectedTask);

        // Act
        var result = await _service.GetTaskByIdAsync(1);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Comprar víveres", result!.Title);
    }

    /// Caso edge: el id es válido (positivo) pero no existe ninguna
    /// tarea con ese id en la base de datos. El repositorio devuelve
    /// null y el Service debe propagarlo tal cual, dejando que el
    /// Controller decida el código HTTP (404), no el Service.
    [Fact]
    public async Task GetTaskByIdAsync_WithNonExistentId_ReturnsNull()
    {
        // Arrange
        _repositoryMock
            .Setup(r => r.GetByIdAsync(9999))
            .ReturnsAsync((TaskDto?)null);

        // Act
        var result = await _service.GetTaskByIdAsync(9999);

        // Assert
        Assert.Null(result);
    }

    /// Caso edge: ids cero o negativos no son IDs válidos de negocio,
    /// aunque sean enteros válidos a nivel de tipo de dato. Se prueban
    /// tres valores representativos (0, -1, -100) 
    /// para no repetir el mismo test tres veces.

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    [InlineData(-100)]
    public async Task GetTaskByIdAsync_WithIdZeroOrNegative_ThrowsArgumentException(int invalidId)
    {
        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() => _service.GetTaskByIdAsync(invalidId));

        // Assert adicional: el repositorio nunca debe ser consultado
        // si el id ya es inválido — la validación ocurre antes,
        // evitando una consulta innecesaria a la base de datos.
        _repositoryMock.Verify(r => r.GetByIdAsync(It.IsAny<int>()), Times.Never);
    }
}