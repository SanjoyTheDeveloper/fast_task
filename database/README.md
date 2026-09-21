# FastTask Database Layer (PostgreSQL + Prisma)

This directory defines the database models and configuration for the FastTask application.

## Models
1. **User**: Authentication and account credentials (`id`, `name`, `email`, `password`, `createdAt`, `updatedAt`).
2. **Task**: Task items (`id`, `title`, `description`, `status`, `priority`, `dueDate`, `userId`, `createdAt`, `updatedAt`).

## Enums
- **TaskStatus**: `PENDING`, `IN_PROGRESS`, `COMPLETED`
- **TaskPriority**: `LOW`, `MEDIUM`, `HIGH`

## Commands
```bash
# 1. Generate Prisma Client
npx prisma generate

# 2. Run Database Migrations
npx prisma migrate dev --name init

# 3. Open Prisma Studio (Database GUI)
npx prisma studio
```
