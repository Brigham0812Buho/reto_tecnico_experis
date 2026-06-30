# Task Manager — Reto Técnico React Native + .NET

Aplicación de gestión de tareas compuesta por un backend en .NET 8 con ASP.NET Core y un frontend en React Native CLI con TypeScript. La app permite listar tareas, aplicar filtros y ver el detalle de cada tarea.

## Estructura del repositorio

```
TaskManager/
├── BackEnd/                 API REST en .NET 8
├── FrontEnd/                App móvil en React Native CLI
├── docs/
│   └── architecture.md      Arquitectura, decisiones técnicas y justificación de diseño
└── README.md                Este archivo
```

## Stack técnico

| Capa | Tecnología |
| --- | --- |
| Backend | .NET 8, ASP.NET Core, Dapper, SQL Server, Stored Procedures |
| Frontend | React Native CLI, TypeScript, React Navigation |
| Arquitectura | Clean Architecture adaptada por capas |

## Requisitos previos

- .NET 8 SDK
- SQL Server local o remoto
- Node.js
- JDK 17
- Android Studio con SDK y platform-tools
- Emulador Android o dispositivo físico con depuración USB habilitada

## 1. Base de datos

### Opción A — Script único (recomendado)
```bash
sqlcmd -S TU_SERVIDOR -U TU_USUARIO -P TU_PASSWORD -i BackEnd/database/00_setup.sql
```

### Opción B — Scripts individuales en orden
1. `01_create_database.sql`
2. `02_create_tables.sql`
3. `03_seed_data.sql`
4. `stored_procedures/sp_GetTasks.sql`
5. `stored_procedures/sp_GetTaskById.sql`
6. `stored_procedures/sp_GetCatalogs.sql`

## 2. Ejecutar el backend

```bash
cd BackEnd/src/TaskManager.API
dotnet restore
dotnet run
```

La API quedará disponible en:

- http://localhost:5139
- Swagger: http://localhost:5139/swagger


La cadena de conexión en [BackEnd/src/TaskManager.API/appsettings.json](BackEnd/src/TaskManager.API/appsettings.json) debe apuntar a la instancia de SQL Server.


## 3. Configurar variables de entorno

### Backend
Edita `BackEnd/src/TaskManager.API/appsettings.json` con tu cadena de conexión:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=TU_SERVIDOR;Database=TaskManagementDB;User Id=TU_USUARIO;Password=TU_PASSWORD;TrustServerCertificate=True;"
  }
}
```

### Frontend
Copia el archivo de ejemplo y edítalo:
```bash
cp FrontEnd/.env.example FrontEnd/.env
```

Ajusta `API_BASE_URL` según tu entorno:
- **Emulador Android**: `http://10.0.2.2:5139/api`
- **Dispositivo físico**: `http://TU_IP_LOCAL:5139/api` (obtén tu IP con `ipconfig` en Windows, ambos dispositivos deben estar en la misma red WiFi)

## 4. Ejecutar el frontend

```bash
cd FrontEnd
npm install
npx react-native run-android
```

## 5. Ejecutar pruebas

### Backend

```bash
cd BackEnd
dotnet test
```

Cubre pruebas unitarias en:
- `Domain` — validaciones de la entidad `TaskItem` (título vacío, espacios, límite de caracteres, caso límite exacto de 200 caracteres)
- `Application` — comportamiento de `TaskService` (delegación al repositorio, tarea no encontrada, ids inválidos)

### Frontend

```bash
cd FrontEnd
npm test -- --runInBand
```

Cubre pruebas unitarias en:
- `core/hooks` — máquina de estados de `useAsync` (éxito, error, loading, reset entre ejecuciones)
- `features/TaskList/data` — que `taskListRepository` delega correctamente al datasource
- `features/TaskList/presentation` — que `TaskCard` renderiza correctamente con y sin descripción

## 6. Documentación de arquitectura

La explicación técnica detallada de las decisiones de diseño está en [docs/architecture.md](docs/architecture.md).

## 7. Notas de entorno (Windows)

- Si Gradle no encuentra el SDK, crea [FrontEnd/android/local.properties](FrontEnd/android/local.properties) con la ruta correcta de `sdk.dir`.
- Si tu sistema usa otro JDK, configura `JAVA_HOME` con JDK 17.
- Si aparece un error de rutas largas, se debe mover el proyecto a una ruta corta o habilita soporte para rutas largas en Windows.
