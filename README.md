# API Gateway

Punto de entrada HTTP único para todo el sistema de gestión de talento humano. Recibe peticiones REST de los clientes y las enruta a los microservicios correspondientes mediante mensajes NATS.

## Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Arquitectura](#arquitectura)
- [Endpoints REST](#endpoints-rest)
- [Variables de Entorno](#variables-de-entorno)
- [Instalación y Ejecución](#instalación-y-ejecución)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Manejo de Errores](#manejo-de-errores)

---

## Descripción General

El Gateway actúa como la única interfaz pública del sistema. No posee base de datos propia ni lógica de negocio: su responsabilidad es traducir peticiones HTTP entrantes en mensajes NATS que son procesados por los microservicios especializados, y devolver la respuesta al cliente.

**Características:**
- Prefijo global de rutas: `/api`
- CORS habilitado para los orígenes configurados
- Validación de DTOs con `class-validator`
- Proxy transparente hacia microservicios vía NATS `ClientProxy.send()`
- Manejo uniforme de errores RPC para respuestas HTTP consistentes

**Servicios enrutados:**

| Módulo                 | Microservicio destino       |
|------------------------|-----------------------------|
| `AdministrativeDataModule` | `administrative-data-ms` |
| `UsersModule`          | `users-ms`                  |
| `TrajectoryModule`     | `trajectory-ms`             |

---

## Arquitectura

```
Cliente HTTP
     │
     ▼
┌─────────────────────────────────────────┐
│              API Gateway                │
│         (NestJS - Puerto 3000)          │
│                                         │
│  /api/areas        → NATS               │
│  /api/positions    → NATS               │
│  /api/contracts    → NATS               │
│  /api/users        → NATS               │
│  /api/career       → NATS               │
│  /api/evaluations  → NATS               │
└─────────────────────────────────────────┘
     │
     ▼
  NATS Server
  ├── administrative-data-ms
  ├── users-ms
  └── trajectory-ms
```

El gateway también actúa como microservicio NATS (escucha mensajes) para permitir comunicación bidireccional en flujos más complejos si se requiere en el futuro.

---

## Endpoints REST

Todos los endpoints tienen el prefijo `/api`.

### Áreas — `/api/areas`

| Método   | Ruta          | Descripción                     | NATS cmd       |
|----------|---------------|---------------------------------|----------------|
| `POST`   | `/`           | Crear área                      | `createArea`   |
| `GET`    | `/`           | Listar áreas (paginado)         | `findAllAreas` |
| `GET`    | `/:id`        | Obtener área por ID             | `findOneArea`  |
| `PATCH`  | `/:id`        | Actualizar área                 | `updateArea`   |
| `DELETE` | `/:id`        | Eliminar área                   | `removeArea`   |

### Cargos — `/api/positions`

| Método   | Ruta              | Descripción                         | NATS cmd                  |
|----------|-------------------|-------------------------------------|---------------------------|
| `POST`   | `/`               | Crear cargo                         | `createPosition`          |
| `GET`    | `/`               | Listar cargos (paginado)            | `findAllPositions`        |
| `GET`    | `/tree`           | Árbol jerárquico completo           | `positionsTree`           |
| `GET`    | `/:id`            | Obtener cargo por ID                | `findOnePosition`         |
| `PATCH`  | `/:id`            | Actualizar cargo                    | `updatePosition`          |
| `DELETE` | `/:id`            | Eliminar cargo                      | `removePosition`          |
| `DELETE` | `/:id/hierarchy`  | Eliminar cargo y descendencia       | `removePositionHierarchy` |

### Contratos — `/api/contracts`

| Método   | Ruta                         | Descripción                           | NATS cmd                   |
|----------|------------------------------|---------------------------------------|----------------------------|
| `POST`   | `/`                          | Crear contrato                        | `createContract`           |
| `POST`   | `/with-pdf`                  | Crear contrato con PDF (multipart)    | `createContractWithPdf`    |
| `GET`    | `/`                          | Listar contratos (paginado)           | `findAllContracts`         |
| `GET`    | `/:id`                       | Obtener contrato por ID               | `findOneContract`          |
| `GET`    | `/employee/:employeeId`      | Listar contratos de un empleado       | `findContractsByEmployee`  |
| `PATCH`  | `/:id`                       | Actualizar contrato                   | `updateContract`           |
| `PATCH`  | `/:id/renew`                 | Renovar contrato                      | `renewContract`            |
| `DELETE` | `/:id`                       | Eliminar contrato                     | `removeContract`           |

### Usuarios — `/api/users`

| Método   | Ruta              | Descripción                               | NATS cmd       |
|----------|-------------------|-------------------------------------------|----------------|
| `POST`   | `/invite`         | Invitar empleado por correo               | `inviteUser`   |
| `GET`    | `/`               | Listar empleados (paginado)               | `findAllUsers` |
| `GET`    | `/:id`            | Obtener empleado por ID                   | `findUserById` |
| `PATCH`  | `/:id/block`      | Bloquear usuario                          | `blockUser`    |
| `PATCH`  | `/:id/unblock`    | Desbloquear usuario                       | `unblockUser`  |
| `POST`   | `/admin`          | Crear administrador                       | `createAdmin`  |
| `GET`    | `/admins`         | Listar administradores (paginado)         | `findAllAdmins`|
| `GET`    | `/admins/:id`     | Obtener administrador por ID              | `findAdminById`|

### Historial de Carrera — `/api/career-history`

| Método   | Ruta    | Descripción                               | NATS cmd                    |
|----------|---------|-------------------------------------------|-----------------------------|
| `POST`   | `/`     | Registrar evento de carrera               | `createCareerHistory`       |
| `GET`    | `/`     | Listar historial (paginado)               | `findAllCareerHistory`      |
| `GET`    | `/:id`  | Obtener evento por ID                     | `findOneCareerHistory`      |
| `PATCH`  | `/:id`  | Actualizar evento                         | `updateCareerHistory`       |
| `DELETE` | `/:id`  | Eliminar evento                           | `removeCareerHistory`       |

### Evaluaciones de Desempeño — `/api/performance-evaluations`

| Método   | Ruta    | Descripción                               | NATS cmd                           |
|----------|---------|-------------------------------------------|------------------------------------|
| `POST`   | `/`     | Crear evaluación                          | `createPerformanceEvaluation`      |
| `GET`    | `/`     | Listar evaluaciones (paginado)            | `findAllPerformanceEvaluation`     |
| `GET`    | `/:id`  | Obtener evaluación por ID                 | `findOnePerformanceEvaluation`     |
| `POST`   | `/generate-performance-evaluation-report` | Generar reporte consolidado | `generateConsolidatedReport` |
| `PATCH`  | `/:id`  | Actualizar evaluación                     | `updatePerformanceEvaluation`      |
| `DELETE` | `/:id`  | Eliminar evaluación                       | `removePerformanceEvaluation`      |

#### Payload del reporte consolidado

El endpoint acepta un body JSON con este formato:

```json
{
        "employeeIds": [1, 2, 3],
        "startDate": "2025-01-01",
        "endDate": "2025-12-31",
        "export": "json"
}
```

Campos:
- `employeeIds`: opcional. Si se omite, el reporte usa todos los empleados con evaluaciones registradas.
- `startDate` y `endDate`: opcionales. Filtran el rango de fechas de las evaluaciones.
- `export`: opcional. Valores permitidos: `json` o `csv`.

#### Prueba rápida

```bash
curl -X POST http://localhost:3000/api/generate-performance-evaluation-report \
        -H "Content-Type: application/json" \
        -d '{
                "employeeIds": [1, 2],
                "startDate": "2025-01-01",
                "endDate": "2025-12-31",
                "export": "json"
        }'
```

Para exportación CSV, cambia `"export": "csv"`. La respuesta incluirá la cadena CSV dentro del campo `csv`.

### Paginación

Todos los endpoints `GET /` aceptan query params:

| Parámetro | Tipo     | Default | Descripción              |
|-----------|----------|---------|--------------------------|
| `page`    | `number` | `1`     | Número de página         |
| `limit`   | `number` | `10`    | Registros por página     |

---

## Variables de Entorno

| Variable       | Descripción                                            |
|----------------|--------------------------------------------------------|
| `PORT`         | Puerto HTTP del gateway (default: `3000`)              |
| `NATS_SERVERS` | URL del servidor NATS (ej: `nats://nats-server:4222`)  |

El Gateway no requiere credenciales de base de datos ni servicios externos, ya que delega toda la lógica a los microservicios.

---

## Instalación y Ejecución

### Modo desarrollo (local)

```bash
npm install
npm run start:dev
```

### Modo Docker (recomendado)

#### Esto no es necesario si se quiere ejecutar todo el proyecto desde el launcher: **Leer README.md del launcher**

```bash
# Desde la raíz del launcher
docker compose up gateway
```

El gateway expone el puerto configurado en `GATEWAY_PORT` del archivo `.env` del launcher.

---

## Estructura del Proyecto

```
src/
├── main.ts                                  # HTTP server + microservicio NATS
├── app.module.ts                            # Módulo raíz
├── administrative-data/
│   ├── administrative-data.module.ts
│   ├── areas/
│   │   ├── areas.controller.ts              # HTTP → NATS proxy de áreas
│   │   └── dto/
│   ├── positions/
│   │   ├── positions.controller.ts          # HTTP → NATS proxy de cargos
│   │   └── dto/
│   └── contracts/
│       ├── contracts.controller.ts          # HTTP → NATS proxy de contratos
│       └── dto/
├── users/
│   ├── users.module.ts
│   ├── users.controller.ts                  # HTTP → NATS proxy de usuarios
│   └── dto/
├── trajectory/
│   ├── trajectory.module.ts
│   ├── career-history/
│   │   ├── career-history.controller.ts     # HTTP → NATS proxy de historial
│   │   ├── dto/
│   │   └── enum/career_type_change.ts
│   └── performance-evaluation/
│       ├── performance-evaluation.controller.ts
│       └── dto/
├── config/
│   ├── envs.ts                              # Validación de variables (Joi)
│   ├── index.ts
│   └── services.ts                          # Constante NATS_SERVICE
├── transports/
│   └── nats.module.ts                       # ClientsModule NATS
└── common/
    ├── dto/pagination.dto.ts
    ├── exceptions/rpc-custom-exception.filter.ts
    └── index.ts
```

---

## Manejo de Errores

El Gateway implementa un filtro global `RpcCustomExceptionFilter` que intercepta las excepciones `RpcException` lanzadas por los microservicios y las convierte en respuestas HTTP con el código de estado y mensaje apropiados.

```
Microservicio lanza RpcException({ status: 404, message: 'Not found' })
        ↓
RpcCustomExceptionFilter intercepta
        ↓
Cliente recibe HTTP 404 { message: 'Not found' }
```

La validación de DTOs se aplica de forma global con `ValidationPipe` (`whitelist: true`, `forbidNonWhitelisted: true`), rechazando con HTTP 400 cualquier payload con campos no declarados en el DTO.
