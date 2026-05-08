# Vue Fintech Dashboard

Компактный pet-проект на Vue 3 + TypeScript. Приложение показывает список операций, фильтрует и сортирует их, открывает детальную страницу операции и демонстрирует базовую работу с состояниями загрузки, ошибки и пустого результата.

## Стек

- Vue 3, Composition API
- TypeScript
- Vite
- Pinia
- Vue Router
- Vitest
- Playwright
- Scoped CSS

## Что умеет проект

- Dashboard со списком финтех-операций.
- Таблица операций: `id`, `amount`, `currency`, `status`, `type`, `createdAt`, `userName`.
- Поиск по имени пользователя или id операции.
- Фильтры по `status` и `type`.
- Сортировка по дате и сумме.
- Детальная страница операции со всей информацией и историей изменения статуса.
- Mock API с задержкой и имитацией ошибки.
- Pinia store с `loading`, `error`, empty/no-results состояниями и filtered/sorted selectors.
- Unit-тесты для фильтрации, сортировки и Pinia store.
- E2E-тест Playwright для пользовательского сценария dashboard -> filter -> detail page.

## Команды

```bash
npm install
npm run dev
npm run test
npm run test:e2e
npm run typecheck
```

## Навыки, которые демонстрирует

- Проектирование Vue 3 приложения с Composition API.
- Типизация доменной модели и фильтров.
- Управление состоянием через Pinia.
- Разделение UI, store, mock API и чистой бизнес-логики.
- Настройка роутинга и динамических страниц.
- Покрытие логики unit-тестами.
- Проверка основного пользовательского сценария через Playwright.
- Работа с loading/error/empty состояниями в интерфейсе.

## Что можно улучшить

- Добавить пагинацию и серверные query-параметры.
- Синхронизировать фильтры с URL.
- Добавить графики по объему операций и статусам.
- Добавить MSW для более реалистичного API mocking.
- Расширить e2e-покрытие на error и empty states.
