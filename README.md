# pari-test

Запуск приложения:
1) склонировать репозиторий
2) перейти в provider (cd provider)
3) установить зависимости (npm i)
4) создайте и заполните .env файл по примеру: из файла envExample
5) выполнить команду npm run build
6) выполнить команду npm run start
7) перейти в bet-platform (cd ../bet-platform)
8) создайте базу данных postgres
9) выполнить аналогичные действия начиная с шага 4
10) выполните команду prisma migrate deploy

при необходимости установить rabbitmq-server

Использование приложения:
для использования приложения вам понадобится клиент для отправки http запросов (insomnia, postman, thunderclient)
