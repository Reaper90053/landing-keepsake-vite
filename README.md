# Keepsake — Адаптивний лендінг (Лабораторна робота №9)

Адаптивна вебсторінка портфоліо-агенції **Keepsake**, зібрана за принципом **Mobile-First** на сучасному фронтенд-стеку.

- **Живе демо (GitHub Pages):** https://reaper90053.github.io/landing-keepsake-vite/

---

## Вимоги до середовища та команди

Для запуску потрібен **Node.js** (версії 20 LTS або новішої) та **npm**.

| Команда           | Призначення                                                |
| :---------------- | :--------------------------------------------------------- |
| `npm install`     | Встановлення всіх залежностей                              |
| `npm run dev`     | Запуск локального сервера розробки Vite                    |
| `npm run build`   | Продакшн-збірка у папку `dist/`                            |
| `npm run preview` | Попередній перегляд зібраного проєкту                      |
| `npm run images`  | Генерація AVIF, WebP та JPG (`400w`, `800w`) через `sharp` |
| `npm run format`  | Форматування файлів через Prettier                         |
| `npm run lint`    | Перевірка SCSS (Stylelint) та форматування (Prettier)      |

---

## Структура проєкту та архітектура Pug і SCSS

```text
landing-keepsake-vite/
├── .github/workflows/deploy.yml  # Деплой на GitHub Pages
├── .husky/pre-commit             # Pre-commit хук для lint-staged
├── scripts/optimize-images.js    # Оптимізація зображень через sharp
├── src/
│   ├── assets/images/            # Оптимізовані зображення (AVIF, WebP, JPG)
│   ├── components/               # Pug-компоненти та секції сторінки
│   ├── data/data.pug             # Масиви даних (меню, портфоліо, журнал)
│   ├── includes/                 # Head, meta, шрифти, SVG-спрайт
│   ├── layouts/main.pug          # Базовий шаблон сторінки
│   ├── mixins/                   # Міксини (+btn, +icon, +picture, +work-card)
│   ├── pages/index.pug           # Головна сторінка
│   └── styles/
│       ├── base/                 # Reset та базові стилі
│       ├── components/           # БЕМ-стилі компонентів
│       ├── layout/               # Сітка та відступи секцій
│       ├── utils/                # Змінні, функція rem(), міксини медіазапитів
│       └── main.scss             # Головний файл стилів
├── .browserslistrc               # Цільові браузери для Autoprefixer
├── .prettierrc                   # Налаштування Prettier
├── .stylelintrc.json             # Правила Stylelint під БЕМ
├── postcss.config.js             # Налаштування PostCSS
└── vite.config.js                # Конфігурація Vite
```

- **Pug:** використано наслідування шаблонів (`extends` / `block`), відокремлення даних (`data.pug`) і міксини (`+picture`, `+icon`).
- **SCSS:** модульна архітектура на `@use` / `@forward`, функція `rem()` і медіазапити **Mobile-First**.

---

## Використані інструменти

- **Vite + Vituum (`@vituum/vite-plugin-pug`)** — збірка проєкту, компіляція Pug і мініфікація через `esbuild`.
- **Sass (SCSS)** — препроцесор стилів за методологією БЕМ.
- **PostCSS + Autoprefixer + Browserslist** — автоматичні вендорні префікси.
- **Sharp** — генерація адаптивних зображень у форматах AVIF і WebP.
- **Prettier (`@prettier/plugin-pug`)** — автоформатування коду.
- **Stylelint** — перевірка БЕМ-класів і правил SCSS.
- **Husky + lint-staged** — автоматична перевірка коду перед комітом.
- **GitHub Actions + GitHub Pages** — автоматичний деплой при пуші в `main`.

---

## Цільові браузери та результати оптимізації

Цільові браузери (`.browserslistrc`): останні 2 версії **Chrome, Firefox, Edge, Safari та iOS Safari**.

| Ресурс                        | До оптимізації          | Після оптимізації                                 | Економія                |
| :---------------------------- | :---------------------- | :------------------------------------------------ | :---------------------- |
| **CSS-бандл**                 | ~24.8 kB                | **15.66 kB** (`3.10 kB` gzip)                     | **-37%**                |
| **Картка портфоліо (`800w`)** | ~65–90 kB (JPG)         | **1.69–2.22 kB** (AVIF) / **2.34–2.78 kB** (WebP) | **>90%**                |
| **Мобільна картка (`400w`)**  | вантажився великий файл | **0.82–1.47 kB** (AVIF)                           | Точний розмір під екран |
