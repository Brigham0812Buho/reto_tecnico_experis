# Arquitectura del proyecto Task Manager

## 1. Visión general

El repositorio está compuesto por dos piezas independientes pero conectadas:

- Backend: API REST en ASP.NET Core con .NET 8.
- Frontend: aplicación móvil en React Native CLI con TypeScript.

La app permite listar tareas, aplicar filtros por estado o prioridad y consultar el detalle de una tarea. El backend debe encargarse de acceso a datos, reglas y exposición de servicios, mientras que el frontend debe centrarse en la experiencia del usuario, en cómo se ve la información y en cómo se navega entre pantallas.

## 2. Arquitectura del backend

### Capa API

- [BackEnd/src/TaskManager.API/Program.cs](../BackEnd/src/TaskManager.API/Program.cs)
- [BackEnd/src/TaskManager.API/Controllers/TasksController.cs](../BackEnd/src/TaskManager.API/Controllers/TasksController.cs)

Esta capa me sirve como puerta de entrada al sistema. Decidi mantenerla asi, porque no quiero que el controlador sea el lugar donde se mezclen HTTP, reglas de negocio y acceso a datos. Su trabajo es recibir la petición, delegar en la aplicación y devolver una respuesta clara. De esa forma, si mañana cambia el contrato REST, el corazón de la lógica puede seguir igual.

### Capa Application

- [BackEnd/src/TaskManager.Application/Services/TaskService.cs](../BackEnd/src/TaskManager.Application/Services/TaskService.cs)

Aquí es donde yo ubico la lógica de negocio que no pertenece ni al controlador ni a la infraestructura. El service coordina los casos de uso, valida reglas de negocio como un `id` inválido y decide qué repositorio debe resolver la información. Considero que asi si en un proyecto mas grande aparece una regla nueva o una integración distinta, no necesito tocar la API ni la base de datos para adaptarlo.

### Capa Infrastructure

- [BackEnd/src/TaskManager.Infrastructure/Repositories/TaskRepository.cs](../BackEnd/src/TaskManager.Infrastructure/Repositories/TaskRepository.cs)
- [BackEnd/src/TaskManager.Infrastructure/Data/DbConnectionFactory.cs](../BackEnd/src/TaskManager.Infrastructure/Data/DbConnectionFactory.cs)

Aquí todo lo que depende de tecnología concreta. El repositorio conoce cómo consultar la base de datos, y `DbConnectionFactory` me permite obtener conexiones sin repetir la configuración en cada método, asi que solo batsa con llamarla. Además, yo uso Dapper porque el reto exige stored procedures explícitos y Dapper me da un mapeo directo del resultado SQL a DTOs, sin añadir una capa de abstracción demasiado hardcodeada como la que suele traer un ORM completo.

## 3. Arquitectura del frontend

### Estructura por features

- [FrontEnd/src/features/TaskList](../FrontEnd/src/features/TaskList)
- [FrontEnd/src/features/TaskDetail](../FrontEnd/src/features/TaskDetail)
- [FrontEnd/src/features/TaskFilter](../FrontEnd/src/features/TaskFilter)

He organizado el frontend por features porque cada funcionalidad tiene su propio flujo, sus propios datos y su propia interfaz. En lugar de imponer una arquitectura limpia clásica de backend sobre toda la app, aquí prefiero una versión adaptada: cada feature encapsula su dominio, sus repositorios y su presentación, y en [FrontEnd/src/core](../FrontEnd/src/core) dejo todo lo transversal como tema, hooks reutilizables o utilidades compartidas. De esa manera, si el proyecto crece, puedo escalar por funcionalidad sin mezclar responsabilidades ni volver el código inmantenible.
#### Feature TaskList

- [FrontEnd/src/features/TaskList/domain](../FrontEnd/src/features/TaskList/domain)
- [FrontEnd/src/features/TaskList/data](../FrontEnd/src/features/TaskList/data)
- [FrontEnd/src/features/TaskList/presentation](../FrontEnd/src/features/TaskList/presentation)

#### Feature TaskDetail

- [FrontEnd/src/features/TaskDetail/domain](../FrontEnd/src/features/TaskDetail/domain)
- [FrontEnd/src/features/TaskDetail/data](../FrontEnd/src/features/TaskDetail/data)
- [FrontEnd/src/features/TaskDetail/presentation](../FrontEnd/src/features/TaskDetail/presentation)


#### Feature TaskFilter

- [FrontEnd/src/features/TaskFilter/presentation](../FrontEnd/src/features/TaskFilter/presentation)

El filtro tiene una naturaleza más ligera, así que tiene la capa de presentación, con la lógica mínima necesaria para abrir el selector y emitir el estado del filtro. No sigue una arquitectura completa de tres capas porque en este caso no hay una entidad compleja ni un repositorio que justifique un mayor nivel de abstracción. La arquitectura está adaptada a lo necesario en cada feature.
### Tema y diseño reutilizable

- [FrontEnd/src/core/theme/theme.ts](../FrontEnd/src/core/theme/theme.ts)

Decidi centralizar el diseño en un tema compartido porque eso me da una única fuente de verdad para colores, espaciados, radios, tipografía y tokens de prioridad o estado. En lugar de repetir estilos en cada pantalla, el theme me da un patrón consistente parecido a lo que haría una librería de diseño, y eso ayuda a que el usuario se familiarice más rápido con la interfaz. Me base en lo que se propone en librerias como Material UI que aunque non estan permitidas en este reto tecnico, vi su utilidad para mantener patrones que ayudan a l usuario a familiarizarse aun mas con la app dando sentido a cada cosa, si luego cambia una paleta, un espaciado o un color de estado, lo actualizo en un solo lugar y todo el sistema se modifica al menos en los estilos generales.

### Componentes compartidos

- [FrontEnd/src/shared/components/StatusBadge.tsx](../FrontEnd/src/shared/components/StatusBadge.tsx)
- [FrontEnd/src/shared/components/CenteredState.tsx](../FrontEnd/src/shared/components/CenteredState.tsx)
- [FrontEnd/src/shared/components/SectionCard.tsx](../FrontEnd/src/shared/components/SectionCard.tsx)
- [FrontEnd/src/shared/components/EmptyState.tsx](../FrontEnd/src/shared/components/EmptyState.tsx)

Estos componentes repiten la misma estructura visual: badges, estados de carga, mensajes de error y pantallas vacías. Bueno esto siempre se busca ya que es una forma de evitar divergencias y de hacer que cualquier cambio de diseño se aplique de manera consistente.

## 4. Flujo de datos

### Listado de tareas

1. `TaskListView` dispara `useAsync` para obtener datos.
2. `taskListRepository` delega en el datasource.
3. `taskRemoteDataSource` hace `fetch` a `/api/tasks` con los filtros aplicados.
4. `TasksController` recibe la petición y la entrega a `TaskService`.
5. `TaskRepository` ejecuta `sp_GetTasks`.
6. El resultado vuelve a la UI y se renderiza en la lista.

### Detalle de tarea

1. `TaskDetailView` recibe el `taskId`.
2. `taskDetailRepository` usa el datasource correspondiente.
3. El datasource hace `fetch` a `/api/tasks/{id}`.
4. `TasksController` delega en `TaskService.GetTaskByIdAsync`.
5. `TaskRepository` ejecuta `sp_GetTaskById`.
6. La vista muestra el detalle completo de la tarea.

## 5. Decisiones técnicas clave

- Decidí usar DTOs en lugar de devolver entidades del dominio directamente porque las entidades representan reglas internas del sistema y no todo lo que contienen debería exponerse a la API. Un DTO me permite controlar exactamente qué información sale y qué información se mantiene privada, lo que también me protege frente a cambios internos del dominio.
- Tambien vi que `ITaskRepository` en Application me ayudaba porque ahí defino qué necesita el sistema, mientras que en Infrastructure dejo cómo se implementa. Así, la capa de negocio no depende de Dapper, SQL Server ni stored procedures, y si mañana cambio la fuente de datos, el resto de la aplicación no tiene por qué tocarse. Y `ITaskService` como capa separada porque su responsabilidad es orquestar el caso de uso, aplicar reglas y coordinar repositorios. El repository no debería asumir lógica de negocio compleja; su trabajo es acceso a datos, mientras que el service decide cómo se usan esos datos.
- Inicializo los objetos en los DTOs porque prefiero que esos sean inmutables una vez creados. Alguna vi que eso evita modificaciones accidentales durante el flujo y hace que el código sea más predecible.
- Use `DbConnectionFactory` para centralizar la creación de conexiones. Así los repositorios no necesitan conocer la cadena de conexión ni gestionar el ciclo de vida de la conexión directamente, y además me deja más fácil probar con otras fuentes de datos, solo modificando la conexion al menos en un proyecto grande.
- Tambien use Dapper sobre EF Core porque el reto exige stored procedures explícitos y Dapper me permite mapear directamente el resultado SQL a DTOs eso hace el código más transparente y más cercano a la base de datos.
- La arquitectura que uso no es limpia al 100%  en el frontend porque aquí prefiero organizar por features y dejar en [FrontEnd/src/core](../FrontEnd/src/core) todo lo que se puede reutilizar en otros componentes o features. Esa adaptación encaja mejor en una app móvil porque mantiene el sistema ordenado sin sobrecomplicarlo con varias capas como el BackEnd que si lo necesita.
