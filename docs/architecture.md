# Arquitectura — Task Manager

## 1. Visión general

El repositorio contiene dos piezas independientes pero conectadas:

- **Backend**: API REST en ASP.NET Core con .NET 8, organizada en capas siguiendo Clean Architecture.
- **Frontend**: aplicación móvil en React Native CLI con TypeScript, organizada por features con capas internas.

La app permite listar tareas, filtrarlas por estado o prioridad y consultar el detalle de cada una.

---

## 2. Diagrama de comunicación

```
┌─────────────────────────────────────────────────────┐
│                  Dispositivo Android                 │
│                                                      │
│  TaskListView / TaskDetailView / TaskFilterView      │
│          ↓ useAsync                                  │
│  taskListRepository / taskDetailRepository           │
│          ↓ fetch                                     │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP (REST)
                       ↓
┌─────────────────────────────────────────────────────┐
│                   TaskManager.API                    │
│           TasksController (ASP.NET Core)             │
│          ↓ ITaskService                              │
│                 TaskManager.Application              │
│                   TaskService                        │
│          ↓ ITaskRepository                           │
│                 TaskManager.Infrastructure           │
│                   TaskRepository (Dapper)            │
│          ↓ Stored Procedure                          │
└──────────────────────┬──────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────┐
│                    SQL Server                        │
│   Priorities / Statuses / Tasks                      │
│   sp_GetTasks / sp_GetTaskById / sp_GetCatalogs      │
└─────────────────────────────────────────────────────┘
```

---

## 3. Arquitectura del backend

El backend sigue Clean Architecture con cuatro proyectos. La regla de dependencia es unidireccional: las capas externas dependen de las internas, nunca al revés.

```
TaskManager.API
    └── TaskManager.Application
            └── TaskManager.Domain
TaskManager.Infrastructure
    └── TaskManager.Application
    └── TaskManager.Domain
```

### Capa Domain

Entidades del negocio sin dependencias externas. `TaskItem` protege su propio estado con setters privados y valida el título en el constructor — ningún objeto puede existir en estado inválido.

> Archivos clave: `Domain/Entities/TaskItem.cs`, `Domain/Enums/`, `Domain/Exceptions/DomainException.cs`

### Capa Application

Interfaces (`ITaskRepository`, `ITaskService`) y servicios que orquestan los casos de uso. Application define qué necesita el sistema pero no sabe cómo se implementa — no conoce Dapper ni SQL Server.

> Archivos clave: `Application/Services/TaskService.cs`, `Application/Interfaces/`, `Application/DTOs/`

### Capa Infrastructure

Implementación concreta del acceso a datos. `TaskRepository` usa Dapper para mapear el resultado de los stored procedures directamente a DTOs. `DbConnectionFactory` centraliza la creación de conexiones.

> Archivos clave: `Infrastructure/Repositories/TaskRepository.cs`, `Infrastructure/Data/DbConnectionFactory.cs`

### Capa API

Punto de entrada HTTP. Los controllers reciben la petición, delegan en `ITaskService` y devuelven la respuesta. `ExceptionMiddleware` intercepta errores y los traduce a códigos HTTP apropiados (`DomainException` → 400, resto → 500).

> Archivos clave: `API/Controllers/TasksController.cs`, `API/Middleware/ExceptionMiddleware.cs`

---

## 4. Arquitectura del frontend

El frontend usa una versión de Clean Architecture adaptada al ecosistema React Native: organización por features, cada una con sus propias capas internas, más un `core/` compartido.

```
src/
├── core/                     Transversal: hooks, theme, componentes base
│   ├── hooks/useAsync.ts     Hook genérico de carga de datos
│   ├── theme/theme.ts        Tokens de diseño centralizados
│   └── components/           CenteredState, EmptyState, StatusBadge, SectionCard
└── features/
    ├── TaskList/
    │   ├── domain/entities/  TaskI, TaskFilterI
    │   ├── data/             datasource + repository
    │   └── presentation/     TaskCard, TaskListView
    ├── TaskDetail/
    │   ├── domain/entities/
    │   ├── data/
    │   └── presentation/     TaskDetailView
    └── TaskFilter/
        └── presentation/     TaskFilterView
```

`TaskFilter` solo tiene capa de presentación porque no tiene entidad propia ni repositorio — su estado es efímero y se resuelve en memoria. La arquitectura se adapta a lo necesario por feature, no se aplica de forma rígida.

---

## 5. Decisiones técnicas clave

### ¿Por qué la organización difiere entre backend y frontend?

El backend protege un dominio de negocio único y compartido — la separación por capa técnica global es la forma idiomática en .NET y es reconocida por cualquier desarrollador C# como Clean Architecture estándar.

El frontend necesita escalar en número de pantallas. En una app real con muchas vistas, organizar por capa global (`components/`, `hooks/`, `views/` todos mezclados) produce carpetas inmanejables. Organizar por feature significa que eliminar o agregar una funcionalidad completa es tocar una sola carpeta, sin cazar archivos dispersos.

Forzar paridad estructural entre backend y frontend hubiera priorizado la simetría visual sobre la resolución real del problema de cada capa.

### ¿Por qué Dapper y no Entity Framework?

El reto exige stored procedures explícitos. EF puede llamarlos pero agrega una capa de abstracción que oculta lo que ocurre en la base de datos. Dapper mapea el resultado del SP directamente al DTO — lo que se ve en el código es exactamente lo que se ejecuta en SQL Server. Para un sistema orientado a SPs, Dapper es la elección más honesta.

### ¿Por qué DTOs y no devolver entidades del dominio?

Las entidades tienen setters privados y representan reglas internas. Exponer una entidad directamente en la API acoplaría el contrato REST a la estructura interna del dominio. Un DTO permite controlar exactamente qué se expone y protege al sistema frente a cambios internos del modelo.

### ¿Por qué `ITaskRepository` vive en Application y no en Infrastructure?

Application define qué necesita (el contrato), Infrastructure define cómo lo hace (la implementación). Así Application no depende de Dapper ni de SQL Server. Si mañana se cambia a PostgreSQL o a una API externa, solo cambia Infrastructure — Application y Domain no se tocan.

### ¿Por qué `useAsync` como hook genérico?

Todas las vistas necesitan manejar los mismos estados: loading, error, data. Sin un hook centralizado, esa lógica se repetiría en cada vista con ligeras variaciones que eventualmente divergen. `useAsync` encapsula la máquina de estados una sola vez y cualquier vista la usa pasándole la función async correspondiente.

### ¿Por qué `theme.ts` como única fuente de verdad de estilos?

Inspirado en el enfoque de librerías de diseño como Material UI (que aunque no está permitida en este reto, su utilidad como referencia es válida): centralizar colores, espaciados, tipografía y tokens semánticos (colores por prioridad y estado) en un solo lugar garantiza consistencia visual y hace que un cambio de paleta se aplique en toda la app modificando un solo archivo.

### ¿Por qué `DbConnectionFactory`?

Los repositorios no deberían conocer la cadena de conexión ni gestionar el ciclo de vida de la conexión. La factory centraliza esa responsabilidad y facilita pruebas — en un contexto de integración se puede reemplazar la factory por una que apunte a otra base de datos sin tocar los repositorios.

---

## 6. Estrategia de pruebas

Se priorizaron pruebas unitarias en las capas con lógica de negocio pura, evitando dependencias de red o base de datos real.

### Backend (xUnit + Moq)

| Clase | Qué cubre |
|---|---|
| `TaskItemTests` | Reglas del constructor: título vacío, solo espacios, excede 200 chars, límite exacto de 200 |
| `TaskServiceTests` | Delegación al repositorio, tarea no encontrada, ids inválidos (0 y negativos) |

El repositorio se simula con Moq para probar el Service de forma completamente aislada.

### Frontend (Jest + React Native Testing Library)

| Archivo | Qué cubre |
|---|---|
| `useAsync.test.ts` | Éxito, error, loading intermedio, reset de estado entre ejecuciones |
| `taskListRepository.test.ts` | Que delega el filtro al datasource sin transformarlo |
| `TaskCard.test.tsx` | Renderizado con descripción, sin descripción, respuesta al press |

---

## 7. Casos edge cubiertos

| Caso | Dónde se maneja |
|---|---|
| `GET /api/tasks/{id}` con id inexistente | `TaskService` devuelve `null`, controller responde `404` |
| `GET /api/tasks/{id}` con id negativo o cero | `TaskService` lanza `ArgumentException` antes de consultar la DB |
| `GET /api/tasks/{id}` con id no numérico (ej. `/tasks/abc`) | ASP.NET rechaza automáticamente por la restricción `{id:int}` en la ruta |
| Base de datos no disponible | `ExceptionMiddleware` atrapa la excepción y responde `500` con mensaje genérico |
| Lista vacía tras aplicar filtros | Frontend muestra `EmptyState` en lugar de lista vacía sin mensaje |
| Tarea sin descripción | `TaskCard` y `TaskDetailView` omiten la sección de descripción condicionalmente |