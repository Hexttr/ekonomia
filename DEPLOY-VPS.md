# Деплой на VPS

## Требования

- Docker и Docker Compose
- Домен (опционально) + HTTPS через Caddy/Nginx

## Быстрый старт

1. Склонируйте репозиторий на сервер.
2. Создайте `.env` в корне проекта:

```env
MYSQL_ROOT_PASSWORD=сложный_root_пароль
MYSQL_USER=ekonomiya
MYSQL_PASSWORD=сложный_пароль_бд
ACCESS_PASSWORD=513277
APP_PORT=3000
```

3. Соберите и запустите:

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

Приложение: `http://IP:3000`

## Текущий деплой (178.170.165.78)

- Приложение: **http://178.170.165.78:3010**
- Порт **3010** — отдельно от med-ava (3000 + nginx)
- Пароль входа: `513277` (в `.env` на сервере `~/ekonomiya/.env`)
- Обновление с ПК: `DEPLOY_SSH_PASS=... python scripts/deploy_vps.py deploy`

### PWA и HTTPS

Для установки на главный экран **нужен HTTPS** (или localhost). По IP по HTTP PWA ограничена.

1. Заведите поддомен (например `ekonomiya.ваш-домен.ru`) → A-запись на IP сервера.
2. Скопируйте `deploy/nginx-ekonomiya.conf.example` в nginx, получите сертификат:
   ```bash
   sudo certbot --nginx -d ekonomiya.ваш-домен.ru
   ```

## HTTPS (пример Caddy)

```
your.domain.com {
  reverse_proxy localhost:3000
}
```

## PWA на телефоне

1. Откройте сайт в Chrome/Safari.
2. «Добавить на главный экран».
3. Приложение откроется в полноэкранном режиме (`display: standalone`).

Иконки и splash: `npm run pwa:assets` (нужен dev-зависимость `sharp`).

## Обновление

```bash
git pull
docker compose -f docker-compose.prod.yml up -d --build
```

## Без Docker

```bash
npm ci
npm run build
DATABASE_URL=... ACCESS_PASSWORD=513277 npm run start
```

Перед первым запуском: `npx prisma db push`.
