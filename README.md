# ВСРАТЫЙ ВИШЛИСТ 🐈🧗🏄🪁💻

Vite + React + TypeScript + Firebase Firestore, задеплоенный на GitHub Pages. Сайт нарочно максимально неэстетичный, но бронирование подарков настоящие.

## Запуск

```bash
npm install
cp .env.example .env.local
npm run dev
```

Пока Firebase не настроен, сайт работает в демонстрационном режиме: подарки показываются, но кнопки бронирования отключены.

## Настройка Firebase

1. Создай бесплатный проект на https://console.firebase.google.com/.
2. Создай Web App, скопируй значения конфигурации в `.env.local`.
3. В **Authentication → Sign-in method** включи **Anonymous**.
4. В **Firestore Database** создай базу данных.
5. Примени правила доступа из файла `firestore.rules` через вкладку **Rules**.

Это клиентское приложение; отдельный сервер не нужен. Firebase SDK в браузере обращается к Firestore напрямую, а правила Firestore защищают от двойного бронирования и отмены чужой брони.

**Важно:** если пользователь очистит данные браузера, он потеряет доступ к отмене собственных анонимных броней. Администратор может удалить документ напрямую через Firebase Console.

## GitHub Pages

В GitHub открой **Settings → Pages → Build and deployment** и установи **Source: GitHub Actions**.

В **Settings → Secrets and variables → Actions → New repository secret** добавь:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

Firebase web config не является серверным секретом: эти значения в любом случае попадают в браузер. Безопасность обеспечивают Firestore Rules. Пока секретов нет, сайт всё равно соберётся как демо.

При пуше в `master` workflow `.github/workflows/deploy.yml` автоматически публикует сайт на https://raphickie.github.io/wishlist/.

## Редактирование подарков

Меняй список в `src/gifts.ts`. `id` каждого подарка должен быть уникальным и постоянным после того, как подарок начали бронировать. Сами брони хранятся в коллекции Firestore `reservations`.

## Важные ограничения

- Сайт предназначен для небольшого личного вишлиста; анонимная авторизация не защищает от намеренного спама.
- При отсутствии связи статусы и бронирование могут быть недоступны.
- Брони видны всем посетителям, но отменить чужую бронь клиент не может.
