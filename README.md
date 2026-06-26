# Messenger

Учебный проект курса «Мидл фронтенд-разработчик» от Яндекс Практикума — веб-мессенджер на TypeScript + Handlebars + SCSS, собирается Vite.

Проект реализует MVC-архитектуру с собственным компонентным слоем `Block`, клиентским роутером с guard-ами и единым механизмом валидации форм. Все данные поступают с реального API (`ya-praktikum.tech/api/v2`).

## Стек

- **TypeScript** (strict) — весь клиентский код типизирован, `tsc --noEmit` входит в `build` и `lint`.
- **[Vite](https://vitejs.dev/)** — dev-сервер с HMR и сборка.
- **[Handlebars](https://handlebarsjs.com/)** — шаблонизатор. Каждый компонент — Block с inline-шаблоном, регистрируемый как Handlebars-helper.
- **SCSS** — стили по БЭМ, общие миксины для брейкпоинтов.
- **ESLint** (`typescript-eslint`) + **Stylelint** + **Prettier** + **EditorConfig** — единый набор проверок.
- **Vitest** — юнит-тесты (jsdom-окружение). Файлы тестов хранятся рядом с тестируемыми модулями.
- **Husky** — pre-commit хук запускает тесты и линтеры перед каждым коммитом.

## Архитектура

```
src/
  assets/        — шрифты и иконки
  components/    — переиспользуемые компоненты (Block-наследники)
    button/      — Button.ts + button.scss
    field/       — Field.ts (label + Input + ошибка, валидация на blur)
    form/        — Form.ts (базовый класс формы с validateAll + collectValues)
    input/       — Input.ts
    user-modal/  — UserModal.ts (модальное окно: текстовый ввод + загрузка файла)
    back-button/, chat-item/, chat-list/, chat-search/, chat-sidebar/,
    chat-window/, message/, profile-avatar/, profile-field/, error-message/
  controllers/   — связывают вьюхи и сервисы
    AuthController.ts   — логин, регистрация, logout, checkAuth (обновляет Store)
    ChatsController.ts  — загрузка чатов, выбор чата, участники, создание/удаление
    UserController.ts   — обновление профиля, смена пароля, смена аватара
  core/          — каркас
    Block.ts                 — базовый класс компонентов с lifecycle и refs
    registerComponent.ts     — регистрация Block как Handlebars-helper
    registerComponents.ts    — единая точка регистрации всех компонентов
    Router.ts + routerInstance.ts — клиентский роутер на pushState с guard-ом
    HTTPTransport.ts         — XHR-обёртка с ApiError и типизированными ошибками
    WebSocketTransport.ts    — обёртка над WebSocket: ping/pong, переподключение, история
    Store.ts                 — реактивное состояние (pub/sub)
    appStore.ts              — singleton-стор приложения (user, chats, activeChatId)
    EventBus.ts, validators.ts
  api/           — типы API-ответов (ApiUser, ApiChat, …)
  mocks/         — типы доменных моделей (User, Chat, Message) + маппер apiUserToUser
  pages/         — страницы как Block-наследники
    home/        — ChatsPage (список чатов + окно переписки)
    login/       — LoginPage
    sign-up/     — SignUpPage
    profile/     — ProfilePage (mode=view|edit|password)
    not-found/, server-error/
  services/      — HTTP-запросы к API
    AuthService.ts, ChatsService.ts, UserService.ts
  styles/        — глобальные стили, переменные, миксины брейкпоинтов
  main.ts        — точка входа: checkAuth → guard → регистрация компонентов → старт роутера
```

## Маршруты

| Путь         | Страница                                 | Доступ                  |
| ------------ | ---------------------------------------- | ----------------------- |
| `/`          | Вход (LoginPage)                         | только неавторизованным |
| `/sign-up`   | Регистрация                              | только неавторизованным |
| `/messenger` | Чаты                                     | только авторизованным   |
| `/settings`  | Профиль (`?mode=edit`, `?mode=password`) | только авторизованным   |
| `/404`       | Страница не найдена                      | все                     |
| `/500`       | Серверная ошибка                         | все                     |
| любой другой | редирект на `/404`                       | —                       |

Авторизованный пользователь, зашедший на `/` или `/sign-up`, `/login`, автоматически перенаправляется на `/messenger`. Неавторизованный — с любой защищённой страницы на `/`.

## Функциональность

### Авторизация и регистрация

- Вход по логину и паролю; после успеха — редирект на `/messenger`.
- Регистрация нового аккаунта; после успеха — редирект на `/`.
- Logout — очищает стор, редирект на `/`.
- При старте приложения выполняется `checkAuth` — восстановление сессии без перезагрузки.

### Чаты (ChatsPage)

- Список чатов загружается с API при открытии страницы.
- Поиск по названию чата (клиентская фильтрация).
- Создание нового чата — кнопка «+», модальное окно с вводом названия.
- Выбор чата открывает WebSocket-соединение и загружает историю сообщений.
- Отправка и получение сообщений в реальном времени через WebSocket.
- При перезагрузке страницы история сообщений восстанавливается.
- Список участников чата загружается при выборе чата.
- Добавление участника по логину через модальное окно.
- Удаление участника из чата через модальное окно.

### Профиль (ProfilePage)

- Просмотр данных профиля (`/settings`).
- Редактирование данных профиля (`?mode=edit`): кнопка «Сохранить» активна только при наличии изменений; после сохранения — возврат в режим просмотра.
- Смена пароля (`?mode=password`): отдельная форма со старым и новым паролем.
- Кнопка «Отменить» — возврат в режим просмотра без сохранения.
- Смена аватара: клик по аватару открывает модальное окно с выбором файла и превью; после загрузки аватар обновляется на странице немедленно.

### Модальное окно (UserModal)

Переиспользуемый компонент с двумя режимами:

- **Текстовый** (`show`) — поле ввода с лейблом и валидацией.
- **Файловый** (`showFile`) — выбор изображения, превью 96×96, загрузка через API.

## Валидация форм

Единые правила в `src/core/validators.ts` (`first_name`, `second_name`, `login`, `email`, `password`, `phone`, `message`, …). Применяются:

- по `blur` на поле — у `Field` и `ProfileField`,
- перед отправкой — `Form.validateAll()`,
- при отправке сообщения — `ChatWindow` валидирует поле `message`.

## Работа с API

`HTTPTransport` (`src/core/HTTPTransport.ts`) — обёртка над XHR:

- базовый URL `https://ya-praktikum.tech/api/v2`, `withCredentials: true`
- методы `get`, `post`, `put`, `delete`; поддержка `FormData` (без `Content-Type`)
- типизированные ошибки: `ApiError`, `UnauthorizedError`, `ForbiddenError`, `NotFoundError`, `ValidationError`, `ConflictError`

`WebSocketTransport` (`src/core/WebSocketTransport.ts`) — обёртка над WebSocket:

- подключение по `wss://ya-praktikum.tech/ws/chats/{userId}/{chatId}/{token}`
- автоматический ping каждые 30 секунд для поддержания соединения
- переподключение при обрыве (до 3 попыток с экспоненциальной задержкой)
- загрузка истории сообщений через `get old`

## Команды

```bash
npm install        # установка зависимостей

npm run dev        # vite-dev с HMR, http://localhost:3000
npm run start      # build + vite preview, http://localhost:3000
npm run build      # tsc --noEmit + vite build, итог в dist/
npm run preview    # превью прод-сборки

npm run type:check # tsc --noEmit
npm run lint       # type:check + eslint + stylelint + prettier --check
npm run lint:fix   # автофикс всего, что чинится автоматически
npm run lint:js    # eslint .
npm run lint:css   # stylelint src/**/*.{css,scss}
npm run format     # prettier --check .
npm run format:fix # prettier --write .

npm run test       # vitest (watch-режим)
npm run test:run   # vitest run (однократный прогон — используется в CI и pre-commit)
npm run test:ui    # vitest с браузерным UI
```

## Требования

- Node.js **>= 22**.

## Деплой

Проект развёрнут на Netlify: [ссылка на деплой](https://sergey-shabanov-middle-messenger.netlify.app/).

В ветке `main` хранятся только исходники; текущая ветка спринта — `sprint_4`.
