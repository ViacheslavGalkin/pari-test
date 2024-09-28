import amqp from 'amqplib';
import { updateBetStatus, updateEventStatus } from './bet-service';

const QUEUE_NAME = 'event_status_updates';
let channel: amqp.Channel;

export const connectRabbitMQ = async () => {
  const connection = await amqp.connect({
    protocol: 'amqp',
    hostname: process.env.RABBITMQ_HOST || 'localhost',
    port: parseInt(process.env.RABBITMQ_PORT || '5672', 10),
    username: process.env.RABBITMQ_USERNAME || 'guest',
    password: process.env.RABBITMQ_PASSWORD || 'guest',
  });

  channel = await connection.createChannel();

  await channel.assertQueue(QUEUE_NAME, { durable: true });

  channel.consume(QUEUE_NAME, (message) => {
    if (message !== null) {
      try {
        const event: { eventId: string; status: string } = JSON.parse(
          message.content.toString()
        );
        console.log('Получено событие:', event);
        receiveEventStatusUpdates(event);
        channel.ack(message);
      } catch (err) {
        console.error('Ошибка при обработке сообщения:', err);
      }
    }
  });

  console.log(`Подписка на очередь ${QUEUE_NAME} начата`);
};

export async function receiveEventStatusUpdates(event: {
  eventId: string;
  status: string;
}) {
  const { eventId, status } = event;
  const betStatus = status === 'first_team_won' ? 'won' : 'lost';

  const savedEvent = await updateEventStatus(eventId, status);

  if (savedEvent) {
    await updateBetStatus(eventId, betStatus);
  }
}
