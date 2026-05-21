# Messenger

Учебный проект курса «Мидл фронтенд-разработчик» от Яндекс Практикума — веб-мессенджер на TypeScript + Handlebars + SCSS, собирается Vite.

Проект реализует MVC-архитектуру с собственным компонентным слоем `Block`, клиентским роутером и единым механизмом валидации форм.

## Стек

- **TypeScript** (strict) — весь клиентский код типизирован, `tsc --noEmit` входит в `build` и `lint`.
- **[Vite](https://vitejs.dev/)** — dev-сервер с HMR и сборка.
- **[Handlebars](https://handlebarsjs.com/)** — шаблонизатор. Каждый компонент — Block с inline-шаблоном, регистрируемый как Handlebars-helper.
- **SCSS** — стили по БЭМ, общие миксины для брейкпоинтов.
- **ESLint** (`typescript-eslint`) + **Stylelint** + **Prettier** + **EditorConfig** — единый набор проверок.

## Архитектура

```
src/
  assets/        — шрифты и иконки
  components/    — переиспользуемые компоненты (Block-наследники)
    button/      — Button.ts + button.scss
    field/       — Field.ts (label + Input + ошибка, валидация на blur)
    form/        — Form.ts (базовый класс формы с validateAll + collectValues)
    input/       — Input.ts
    back-button/, chat-item/, chat-list/, chat-search/, chat-sidebar/,
    chat-window/, message/, profile-avatar/, profile-field/, error-message/
  controllers/   — связывают вьюхи и сервисы
    AuthController.ts, ChatsController.ts, UserController.ts
  core/          — каркас
    Block.ts                 — базовый класс компонентов с lifecycle и refs
    registerComponent.ts     — регистрация Block как Handlebars-helper
    registerComponents.ts    — единая точка регистрации всех компонентов
    Router.ts + routerInstance.ts — клиентский роутер на pushState
    EventBus.ts, Store.ts    — pub/sub и реактивное состояние
    validators.ts            — единые правила валидации полей
  mocks/         — типы и моковые данные (User, Chat, Message)
  pages/         — страницы как Block-наследники
    home/        — ChatsPage
    login/       — LoginPage
    sign-up/     — SignUpPage
    profile/     — ProfilePage (mode=view|edit|password)
    error/, not-found/, server-error/
  services/      — бизнес-логика и работа с данными
    AuthService.ts, ChatsService.ts, UserService.ts
  styles/        — глобальные стили, переменные, миксины брейкпоинтов
  main.ts        — точка входа: регистрация компонентов и старт роутера
```

## Маршруты

- `/` — список чатов и окно переписки.
- `/login` — авторизация.
- `/sign-up` — регистрация.
- `/profile` — профиль пользователя (`?mode=edit` — редактирование, `?mode=password` — смена пароля).
- `/500` — серверная ошибка.
- любой другой путь — `404`.

## Валидация форм

Единые правила в `src/core/validators.ts` (`first_name`, `second_name`, `login`, `email`, `password`, `phone`, `message`, …). Применяются:

- по `blur` на поле — у `Field` и `ProfileField`,
- перед отправкой — `Form.validateAll()`,
- при отправке сообщения — `ChatWindow` валидирует поле `message`.

На submit формы значения всех полей выводятся в `console.log` объектом.

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
```

## Требования

- Node.js **>= 22**.

## Деплой

Проект развёрнут на Netlify: [ссылка на деплой](https://sergey-shabanov-middle-messenger.netlify.app/).

В ветке `main` хранятся только исходники; ветка спринта — `sprint_2`.
