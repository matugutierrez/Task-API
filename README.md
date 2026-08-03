# task-api

API de gestion de tareas con autenticacion, CRUD de tareas, chequeo de salud, logging estructurado y configuracion por variables de entorno.

## Stack

- Node.js, TypeScript, Express
- PostgreSQL con Prisma ORM
- JWT para autenticacion
- Zod para validacion de entrada
- Pino para logging estructurado
- Jest y Supertest para testing

## Variables de entorno

Ver `.env.example`:

- `PORT`
- `NODE_ENV`
- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `LOG_LEVEL`

## Correr en modo desarrollo

```bash
npm install
npx prisma migrate dev --name init
npm run dev
```

## Tests

```bash
npm test
```

## Endpoints

### Autenticacion

- `POST /auth/register` - crea un usuario nuevo, devuelve token y datos del usuario.
- `POST /auth/login` - autentica un usuario existente, devuelve token.

### Tareas (requieren header `Authorization: Bearer <token>`)

- `POST /tasks` - crea una tarea.
- `GET /tasks` - lista las tareas del usuario autenticado, admite filtros por `status` y `priority` como query params.
- `GET /tasks/:id` - obtiene una tarea puntual.
- `PUT /tasks/:id` - actualiza una tarea.
- `DELETE /tasks/:id` - elimina una tarea.

### Salud

- `GET /health` - devuelve el estado del servicio y la conectividad con la base de datos.

## Modelo de datos

- `User`: id, name, email, password (hash), tasks, createdAt.
- `Task`: id, title, description, status (`PENDING`, `IN_PROGRESS`, `DONE`), priority (`LOW`, `MEDIUM`, `HIGH`), dueDate, userId, createdAt, updatedAt.
