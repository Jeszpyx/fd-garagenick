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
| `GET /api/menu?day=0` | — | Меню дня |
| `GET /api/menu/today` | — | Меню сегодня |
| `POST /api/auth/send-otp` | — | Отправка OTP |
| `POST /api/auth/verify-otp` | — | Проверка OTP |
| `POST /api/orders` | Cookie session | Создание заказа |
| `GET/POST /api/admin/products` | Bearer | CRUD товаров |
| `GET/POST /api/admin/menu` | Bearer | Календарь меню |

## Стек

- Next.js App Router + TypeScript
- PostgreSQL + Prisma ORM
- Tailwind CSS + shadcn-style UI
- Zustand, Zod, Jose (JWT), Sonner
