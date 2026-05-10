# Messenger

Учебный проект курса «Мидл фронтенд-разработчик» от Яндекс Практикума — веб-мессенджер, написанный на Handlebars + SCSS + TypeScript с использованием Vite.

## Стек

- **[Vite](https://vitejs.dev/)** — дев-сервер и сборщик.
- **TypeScript** — точка входа и роутинг.
- **JavaScript (ESM)** — страницы и компоненты.
- **[Handlebars](https://handlebarsjs.com/)** — шаблонизатор. Каждый блок и страница — отдельный `.hbs`-файл, регистрируемый как partial.
- **SCSS** — стили компонентов и страниц по методологии БЭМ.

## Структура

```
src/
  assets/       — статические ресурсы (шрифты, изображения)
  components/   — переиспользуемые блоки (button, chat-item, message и т.д.)
  helpers/      — Handlebars-хелперы
  layout/       — общие лейауты страниц
  mocks/        — моковые данные
  pages/        — страницы приложения (home, login, sign-up, profile, 404, 500)
  styles/       — глобальные стили и подключение шрифтов
  main.ts       — точка входа, роутинг по pathname
```

## Страницы

- `/` — список чатов и окно переписки
- `/login` — авторизация
- `/sign-up` — регистрация
- `/profile` — профиль пользователя (`?mode=edit` — редактирование данных, `?mode=password` — смена пароля)
- `/500` — ошибка сервера
- `/404` — страница не найдена (фоллбэк для всех неизвестных путей)

## Команды

Установка зависимостей:

```bash
npm install
```

Запуск дев-сервера ([http://localhost:3000](http://localhost:3000)):

```bash
npm run start
```

Прод-сборка (TypeScript-проверка + Vite build, итог в `dist/`):

```bash
npm run build
```

Превью прод-сборки:

```bash
npm run preview
```

## Требования

- Node.js **>= 22**

## Деплой

Проект развёрнут на Netlify:

[Ссылка на деплой](https://sergey-shabanov-middle-messenger.netlify.app/)
