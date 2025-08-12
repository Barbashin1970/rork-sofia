# rork-sofia - Created by Rork

Проект доступен по ссылке: https://rork-sofia.vercel.app/

Описание процесса публикации проекта React Native Web, созданного в Rork/Expo, через GitHub на Vercel:

# Rork Sofia - React Native Web приложение

Этот репозиторий содержит проект приложения, созданного с помощью платформы Rork, основанного на Expo и React Native Web, и опубликованного как веб-сайт через Vercel.

## Публикация приложения из GitHub на Vercel

В этом проекте используется Expo с React Native Web для создания кроссплатформенного приложения, которое можно собрать и развернуть как веб-сайт. Публикация на Vercel осуществляется из репозитория GitHub с помощью стандартного процесса.

### Основные шаги публикации:

1. **Подготовка проекта**

   Убедитесь, что в вашем файле `package.json` в разделе `"scripts"` есть команда для сборки веб-версии:

   ```
   "scripts": {
     "build": "npx expo export -p web"
   }
   ```

   Команда `npx expo export -p web` экспортирует статический веб-сайт в папку `dist`, готовый для публикации.

2. **Подключение репозитория к Vercel**

   - Создайте аккаунт на [Vercel](https://vercel.com/) (если ещё его нет).
   - Нажмите «New Project» и импортируйте ваш GitHub репозиторий `rork-sofia`.
   - Vercel автоматически определит тип проекта.

3. **Настройка параметров сборки на Vercel**

   - *Build Command*: `npm run build`
   - *Output Directory*: `dist`

   Это важно, так как после сборки статические файлы будут находиться именно в папке `dist`.

4. **Деплой**

   - Запустите деплой через интерфейс Vercel.
   - При успешном деплое ваше приложение будет доступно по публичному URL (например, https://rork-sofia.vercel.app/).

5. **Автоматизация через GitHub**

   Каждый пуш в ветку `main` автоматически инициирует новую сборку и деплой на Vercel.

---

## Полезные советы и примечания

- Используется Expo с React Native Web, что позволяет писать общий код UI и логики для iOS, Android и веба.
- Вместо устаревшей команды `expo build:web` в проекте используется современный способ экспорта через `expo export -p web`.
- Важно указывать правильную папку вывода (`dist`) для корректной работы Vercel.
- При разработке можно использовать локальный запуск:
  - `npm run start` для запуска сервера разработки
  - `npm run start-web` для запуска веб-версии с туннелем
- Для SPA-приложений (одностраничных) при необходимости настраивайте редиректы и маршруты в Vercel.

---

## Быстрый старт для разработчиков

1. Клонируйте репозиторий:

   ```
   git clone https://github.com/Barbashin1970/rork-sofia.git
   cd rork-sofia
   ```

2. Установите зависимости:

   ```
   npm install
   ```

3. Запустите приложение в режиме веб:

   ```
   npm run start-web
   ```

4. Соберите веб-версию для продакшена:

   ```
   npm run build
   ```

5. Залейте изменения на GitHub — Vercel автоматически задеплоит проект.

---

## Контакты и поддержка

Если возникнут вопросы или проблемы с деплоем, создайте issue в репозитории или свяжитесь с автором проекта.

---

Автор: Barbashin1970  
Сайт проекта: [https://rork-sofia.vercel.app/](https://rork-sofia.vercel.app/)  
Репозиторий: [https://github.com/Barbashin1970/rork-sofia](https://github.com/Barbashin1970/rork-sofia)
```

Этот README описывает и объясняет процесс публикации вашего Expo React Native Web проекта из GitHub на Vercel, учитывая ваш рабочий скрипт сборки и структуру проекта.

Если хотите, могу помочь добавить в репозиторий этот файл через коммит.

[1] https://github.com/Barbashin1970/ro
[2] https://dev.to/tobidelly/step-by-step-guide-to-deploying-a-project-to-vercel-using-github-actions-for-free-l61
[3] https://techhub.iodigital.com/articles/take-control-over-your-ci-cd-process-with-github-actions-vercel
[4] https://vercel.com/docs/deployments
[5] https://vercel.com/docs/git
[6] https://vercel.com/docs/git/vercel-for-github
[7] https://www.youtube.com/watch?v=E8xaV6fiTaA
[8] https://github.com/vercel/vercel
[9] https://vercel.com/docs/deployments/managing-deployments
[10] https://www.jhkinfotech.com/blog/how-to-deploy-projects-on-vercel-with-github
[11] https://gist.github.com/ky28059/1c9af929a9030105da8cf00006b50484
