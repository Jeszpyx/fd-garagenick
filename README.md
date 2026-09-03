# GarageNick — Food Delivery

Современный сайт доставки еды на **Next.js 16**, **PostgreSQL** и **Prisma 7**.

## Возможности

- Каталог товаров и меню по дням недели
- Корзина с сохранением в `localStorage`
- Регистрация/вход по номеру телефона РБ (`+375`)
- Оформление заказов
- Админ-панель с Bearer JWT авторизацией
- CRUD товаров и недельный календарь меню

## Быстрый старт

### 1. Установка зависимостей

```bash
npm install --legacy-peer-deps
```

### 2. Переменные окружения

Скопируйте `.env.example` в `.env`:

```bash
cp .env.example .env
```

### 3. Запуск PostgreSQL

```bash
docker compose up -d
```

### 4. Миграции и seed

```bash
npm run db:migrate
npm run db:seed
```

### 5. Dev-сервер

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000)

## Админ-панель

- URL: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- Login: `admin`
- Password: `admin123`

## Mock OTP (клиент)

1. Перейдите на `/login`
2. Введите белорусский номер (`+375 29/25/33/44`)
3. В dev-режиме код показывается в toast и в консоли сервера

## API

| Endpoint | Auth | Описание |
|----------|------|----------|
| `GET /api/products` | — | Каталог |
| `GET /api/menu?date=2026-09-21` | — | Меню на дату |
| `GET /api/menu?from=&to=` | — | Меню за период |
| `GET /api/menu/today` | — | Меню сегодня |
| `POST /api/auth/send-otp` | — | Отправка OTP |
| `POST /api/auth/verify-otp` | — | Проверка OTP |
| `POST /api/orders` | Cookie session | Создание заказа |
| `GET/POST /api/admin/products` | Bearer | CRUD товаров |
| `GET/POST /api/admin/menu` | Bearer | Календарь меню |

## Деплой на Vercel

Фреймворк: **Next.js**. Команды уже прописаны в проекте — в настройках Vercel их можно не менять.

| Поле | Значение |
|------|----------|
| Framework Preset | Next.js |
| Install Command | `npm install --legacy-peer-deps` (или оставить Auto) |
| Build Command | `npm run build` |
| Output Directory | не трогать (Next.js) |

`npm run build` делает:

1. `prisma generate` — клиент Prisma
2. `prisma migrate deploy` — миграции в прод-БД
3. `next build`

Дополнительно `postinstall` тоже запускает `prisma generate`.

### Переменные окружения (Settings → Environment Variables)

Добавьте для **Production** и **Preview**:

```
DATABASE_URL
JWT_SECRET
ADMIN_LOGIN
ADMIN_PASSWORD
```

`DATABASE_URL` — строка **hosted PostgreSQL** (Neon, Supabase, Vercel Postgres). Локальный Docker с Vercel не достучится.

Пример Neon:

```
postgresql://USER:PASSWORD@HOST/DB?sslmode=require
```

Для serverless лучше pooled-URL провайдера. Миграции на этапе билда требуют, чтобы БД была доступна из интернета.

После первого деплоя при необходимости заполните меню:

```bash
npx prisma db seed
```

локально с `DATABASE_URL` от продакшена — или через `npx prisma db seed` в окружении с этими переменными.

### Важно

- Mock OTP хранится в памяти инстанса: на Vercel код из SMS может не совпасть между запросами. Для продакшена позже нужен Redis/БД.
- Лимит тела запроса Vercel ~4.5 МБ, крупные фото могут не пройти.


- Next.js App Router + TypeScript
- PostgreSQL + Prisma ORM
- Tailwind CSS + shadcn-style UI
- Zustand, Zod, Jose (JWT), Sonner
