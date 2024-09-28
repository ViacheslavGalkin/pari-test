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

Структура API

Provider
GET /events - Получение списка событий
пример ответа:
[
  {
    "id": "event1",
    "coefficient": 1.75,
    "deadline": 1700000000,
    "status": "pending"
  },
  {
    "id": "event2",
    "coefficient": 2.10,
    "deadline": 1700003600,
    "status": "pending"
  }
]
POST /events - Создание нового события
пример тела запроса:
{
  "coefficient": 1.85,
  "deadline": 1700007200
}
пример ответа:
{
  "id": "event3",
  "coefficient": 1.85,
  "deadline": 1700007200,
  "status": "pending"
}
PUT /events/:id - Обновление события по ID
пример тела запроса:
{
  "status": "first_team_won"
}
пример ответа:
{
  "id": "id",
  "coefficient": 1.85,
  "deadline": 1700007200,
  "status": "pending"
}

Bet-Platform
GET /events - Получение списка событий, на которые можно сделать ставку (события со status === "pending" и deadline меньше currentdate)
пример ответа:
[
  {
    "id": "event2",
    "coefficient": 2.10,
    "deadline": 1700003600
  },
  {
    "id": "event3",
    "coefficient": 1.85,
    "deadline": 1700007200
  }
]
POST /bets - Создание новой ставки
пример тела запроса: 
{
  "eventId": "event2",
  "amount": 100.00
}
пример ответа:
{
  "betId": "bet1",
  "eventId": "event2",
  "amount": 100.00,
  "potentialWin": 210.00,
  "status": "pending"
}
GET /bets - Получение списка ставок
пример ответа:
[
  {
    "betId": "bet1",
    "eventId": "event2",
    "amount": 100.00,
    "potentialWin": 210.00,
    "status": "pending"
  },
  {
    "betId": "bet2",
    "eventId": "event1",
    "amount": 50.00,
    "potentialWin": 87.50,
    "status": "won"
  }
]