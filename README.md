# Job Journal — Backend

## Стек

NestJS 11 · TypeScript · Prisma 7 · PostgreSQL · AJV · JWT · bcrypt

## Почему так

- **NestJS** — модульная структура, DI, versioning (`/v1`), удобно масштабировать CRUD-модули
- **Clean Architecture** — слои presentation → application (use cases) → domain → infrastructure; бизнес-логика отделена от Prisma и HTTP
- **Prisma + PostgreSQL** — типобезопасный ORM, миграции, реляционные связи между журналами, пользователями, подразделениями и видами работ
- **AJV** — JSON Schema валидация входящих данных; Мировой стандарт валидации
- **JWT (access + refresh)** — обычная базовая jwt авторизация

## Запуск

переименовать `.env.example` => `.env`

```bash
npm install
npm run docker:prod   # postgres + migrate deploy + app, :7878
```
