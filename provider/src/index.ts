import Fastify from 'fastify';
import { eventRoutes } from './routes';
import { connect } from 'http2';
import { connectRabbitMQ } from './rabbitmq';

const fastify = Fastify({ logger: true });

fastify.register(eventRoutes);
const PORT = Number(process.env.PORT) || 3000;
const start = async () => {
  try {
    await fastify.listen({ port: PORT });
    console.log('Provider is running on http://localhost:3000');
    await connectRabbitMQ();
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
