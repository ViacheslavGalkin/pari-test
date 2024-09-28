import amqp from 'amqplib';
import { Status } from './types';

const QUEUE_NAME = 'event_status_updates';
let channel: amqp.Channel;

export async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect({
      protocol: 'amqp',
      hostname: process.env.RABBITMQ_HOST || 'localhost',
      port: parseInt(process.env.RABBITMQ_PORT || '5672', 10),
      username: process.env.RABBITMQ_USERNAME || 'guest',
      password: process.env.RABBITMQ_PASSWORD || 'guest',
    });

    channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });

    console.log('RabbitMQ connected');
  } catch (error) {
    console.error('RabbitMQ connection error: ', error);
    throw error;
  }
}

export async function sendEventStatusUpdate(eventId: string, status: Status) {
  if (!channel) {
    console.error('Channel is not initialized');
    return;
  }

  const message = JSON.stringify({ eventId, status });
  channel.sendToQueue(QUEUE_NAME, Buffer.from(message), { persistent: true });
  
  console.log(`Sent update for event ${eventId} with status ${status}`);
}
