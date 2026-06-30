# Task Manager — Reto Técnico React Native + .NET

Aplicación móvil de gestión de tareas personales. El usuario puede listar sus tareas, filtrarlas por estado y prioridad, y consultar el detalle de cada una.

## Contenido del repositorio

| Ruta | Descripción |
|---|---|
| `BackEnd/` | API REST en .NET 8 con Clean Architecture |
| `FrontEnd/` | App móvil en React Native CLI con TypeScript |
| `BackEnd/database/` | Scripts SQL para crear la base de datos, tablas, datos de prueba y stored procedures |
| `docs/architecture.md` | Diagrama de arquitectura, flujo de datos y justificación de decisiones técnicas |
| `BackEnd/tests/` | Pruebas unitarias del backend (xUnit + Moq) |
| `FrontEnd/src/**/__tests__/` | Pruebas unitarias del frontend (Jest + Testing Library) |

## Stack técnico

| Capa | Tecnología |
|---|---|
| Backend | .NET 8, ASP.NET Core, Dapper, SQL Server, Stored Procedures |
| Frontend | React Native CLI, TypeScript, React Navigation |
| Pruebas | xUnit, Moq (.NET) / Jest, React Native Testing Library |
| Arquitectura | Clean Architecture adaptada por ecosistema (ver `docs/architecture.md`) |

---

## Requisitos previos

- .NET 8 SDK
- SQL Server (local o remoto)
- Node.js
- JDK 17
- Android Studio con SDK y platform-tools configurados
- Dispositivo Android físico con depuración USB activa, o emulador configurado

---

## Paso 1 — Base de datos

### Opción A — Script único (recomendado)

```bash
sqlcmd -S TU_SERVIDOR -U TU_USUARIO -P TU_PASSWORD -i BackEnd/database/00_setup.sql
```

### Opción B — Scripts individuales en orden

```
BackEnd/database/
├── 01_create_database.sql
├── 02_create_tables.sql
├── 03_seed_data.sql
└── stored_procedures/
    ├── sp_GetTasks.sql
    ├── sp_GetTaskById.sql
    └── sp_GetCatalogs.sql
```

---

## Paso 2 — Backend

Configura la cadena de conexión en `BackEnd/src/TaskManager.API/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=TU_SERVIDOR;Database=TaskManagementDB;User Id=TU_USUARIO;Password=TU_PASSWORD;TrustServerCertificate=True;"
  }
}
```

Levanta la API:

```bash
cd BackEnd/src/TaskManager.API
dotnet restore
dotnet run
```

La API queda disponible en:
- `http://localhost:5139`
- Swagger UI: `http://localhost:5139/swagger`

---

## Paso 3 — Frontend

Copia el archivo de entorno y configura la URL de la API:

```bash
cp FrontEnd/.env.example FrontEnd/.env
```

Edita `FrontEnd/.env` según tu entorno:

```dotenv
# Emulador Android
API_BASE_URL=http://10.0.2.2:5139/api

# Dispositivo físico — reemplaza con tu IP local (ipconfig en Windows)
# API_BASE_URL=http://192.168.1.X:5139/api
```

> Si usas dispositivo físico, el celular y la PC deben estar en la misma red WiFi.

Instala dependencias y ejecuta:

```bash
cd FrontEnd
npm install
npx react-native run-android
```

---

## Paso 4 — Pruebas

### Backend

```bash
cd BackEnd
dotnet test
```

Cubre:
- `Domain` — validaciones de `TaskItem`: título vacío, solo espacios, excede 200 caracteres, límite exacto de 200
- `Application` — `TaskService`: delegación al repositorio, tarea no encontrada, ids inválidos (0 y negativos)

### Frontend

```bash
cd FrontEnd
npm test -- --runInBand
```

Cubre:
- `core/hooks/useAsync` — estados de carga: éxito, error, loading intermedio, reset entre ejecuciones
- `TaskList/data/taskListRepository` — que delega correctamente al datasource con el filtro recibido
- `TaskList/presentation/TaskCard` — renderizado con y sin descripción, respuesta al press

---

## Documentación técnica

La justificación de decisiones arquitectónicas, diagramas de capas y flujo de datos está en [`docs/architecture.md`](docs/architecture.md).

---

## Notas de entorno (Windows)

| Problema | Solución |
|---|---|
| Gradle no encuentra el SDK | Crear `FrontEnd/android/local.properties` con `sdk.dir=RUTA_AL_SDK` |
| JDK incorrecto detectado | Configurar `JAVA_HOME` apuntando al JDK 17 |
| Error de rutas largas | Mover el proyecto a una ruta corta (ej. `C:\Dev\`) o habilitar rutas largas en Windows |
| Instalación bloqueada en Xiaomi | Activar "Instalar vía USB" en Opciones de desarrollador |