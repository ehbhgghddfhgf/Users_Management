# Users Management

Модуль управления пользователями на Vue 3 + TypeScript.

## Архитектура

- `src/app` — инициализация приложения и роутинг.
- `src/entities/user` — доменная модель, API-слой, DTO/mapper и store.
- `src/features/user-form` — переиспользуемая форма создания и редактирования пользователя.
- `src/pages` — route-level страницы.
- `src/shared` — общие стили, HTTP client и utility composables.
- `scripts/mock-server.mjs` + `mock/users.json` — локальный mock API на Bun.

## Что реализовано

- `/users` — список пользователей.
- `/users/new` — создание пользователя.
- `/users/:id/edit` — редактирование пользователя.
- серверная пагинация и поиск.
- синхронизация `page`, `limit`, `search` с URL.
- изоляция API от компонентов.
- переиспользуемая валидация через `useValidate`.
- локальный mock API и Docker-запуск.

## Локальный запуск

Требуется [bun](https://bun.com/docs/installation).

В одном терминале:

```bash
bun run mock
```

Во втором терминале:

```bash
bun run dev
```

Frontend в режиме разработки обслуживается только Vite: отдельный backend-framework для клиентской части не используется, а запросы на `/api` проксируются на локальный mock API.

## Docker

Скопируйте `.example.env` в `.env` и при необходимости поправьте значения.

Запуск:

```bash
docker compose up --build
```

После старта будут доступны:

- frontend: `http://localhost:5173`
- mock API: `http://localhost:3001`

## Сборка

```bash
bun run build
```

## Mock API

Mock API реализован без `json-server`: это небольшой локальный сервер на `Bun.serve(...)` в `scripts/mock-server.mjs`.
При этом приложение в режиме разработки обслуживается только Vite: сам Vite отвечает за клиентское приложение, а запросы на `/api` проксируются в отдельный Bun-based mock API.
В качестве простого хранилища используется файл `mock/users.json`, который читается при запросах и обновляется при `POST`/`PATCH`.

Поддерживаются методы:

- `GET /api/users?page=1&limit=40&search=...`
- `GET /api/users/:id`
- `POST /api/users`
- `PATCH /api/users/:id`