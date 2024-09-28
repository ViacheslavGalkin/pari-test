import Fastify from 'fastify';
import { betRoutes } from './routes';
import { connectRabbitMQ } from './rabbitmq';

const fastify = Fastify({ logger: true });

fastify.register(betRoutes);
const PORT = Number(process.env.PLATFORM_PORT) || 3001;
const start = async () => {
  try {
    await fastify.listen({ port: PORT });
    console.log('Bet-platform is running on http://localhost:3001');
    await connectRabbitMQ();
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
