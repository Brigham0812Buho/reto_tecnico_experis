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

Ejecuta los scripts en este orden desde [BackEnd/database](BackEnd/database):

1. [BackEnd/database/01_database.sql](BackEnd/database/01_database.sql)
2. [BackEnd/database/02_tables.sql](BackEnd/database/02_tables.sql)
3. [BackEnd/database/03_data.sql](BackEnd/database/03_data.sql)
4. [BackEnd/database/stored_procedures/sp_GetTaks.sql](BackEnd/database/stored_procedures/sp_GetTaks.sql)
5. [BackEnd/database/stored_procedures/sp_GetTaskById.sql](BackEnd/database/stored_procedures/sp_GetTaskById.sql)
6. [BackEnd/database/stored_procedures/sp_GetCatalogs.sql](BackEnd/database/stored_procedures/sp_GetCatalogs.sql)

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

## 3. Configurar la URL del backend en el frontend

En [FrontEnd/src/features/TaskList/data/datasource/taskRemoteDataSource.ts](FrontEnd/src/features/TaskList/data/datasource/taskRemoteDataSource.ts) y en [FrontEnd/src/features/TaskDetail/data/datasources/taskDetailDataSource.ts](FrontEnd/src/features/TaskDetail/data/datasources/taskDetailDataSource.ts), ajusta `BASE_URL`:

- Emulador Android: `http://10.0.2.2:5139/api`
- Dispositivo físico: `http://TU_IP_LOCAL:5139/api`

## 4. Ejecutar el frontend

```bash
cd FrontEnd
npm install
npx react-native run-android
```

## 5. Ejecutar pruebas

```bash
cd FrontEnd
npm test -- --runInBand
```

## 6. Documentación de arquitectura

La explicación técnica detallada de las decisiones de diseño está en [docs/architecture.md](docs/architecture.md).

## 7. Notas de entorno (Windows)

- Si Gradle no encuentra el SDK, crea [FrontEnd/android/local.properties](FrontEnd/android/local.properties) con la ruta correcta de `sdk.dir`.
- Si tu sistema usa otro JDK, configura `JAVA_HOME` con JDK 17.
- Si aparece un error de rutas largas, se debe mover el proyecto a una ruta corta o habilita soporte para rutas largas en Windows.
