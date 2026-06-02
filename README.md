# Економия 2.0

Учёт семейных расходов: **Next.js 15**, **React**, **Tailwind CSS**, **MySQL**, **Prisma**.

Старая версия (HTML + localStorage) — в папке `legacy/`.

## Возможности

- Расходы с комментарием, категории с цветом
- Фильтры: период (месяц / неделя / 3–6–12 мес.), категория
- Статистика: список и кольцевая диаграмма
- Общая база на всех устройствах (MySQL)
- Опциональный пароль (`ACCESS_PASSWORD`) для всей семьи

## Требования

- Node.js 20+
- MySQL 8 (локально, [PlanetScale](https://planetscale.com), [Railway](https://railway.app), Docker и т.д.)

## Установка

```bash
cd c:\projects\ekonomiya
npm install
cp .env.example .env
# Отредактируйте DATABASE_URL в .env
```

### База данных (Docker)

```bash
npm run docker:up
# ждём ~15 сек, пока MySQL поднимется

npm run db:push
```

Либо одной командой: `npm run setup`

`docker-compose.yml` уже настроен: пользователь/пароль `ekonomiya`, порт `3306`.

Без Docker — создайте БД вручную и укажите `DATABASE_URL` в `.env`.

### Запуск

```bash
npm run dev
```

Откройте http://localhost:3000

## Переменные окружения

| Переменная | Описание |
|------------|----------|
| `DATABASE_URL` | `mysql://user:pass@host:3306/ekonomiya` |
| `ACCESS_PASSWORD` | Общий семейный пароль (например `513277`) |

## PWA (установка на телефон)

После деплоя откройте сайт в браузере → «Добавить на главный экран». Приложение откроется в полноэкранном режиме.

Иконки и splash генерируются: `npm run pwa:assets`

## Деплой на VPS

Подробно: [DEPLOY-VPS.md](./DEPLOY-VPS.md)

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

Локально:

```bash
npm run build
npm run start
```

## Стек

| Слой | Технология |
|------|------------|
| UI | React 19, Tailwind |
| Framework | Next.js App Router |
| ORM | Prisma |
| БД | MySQL |
