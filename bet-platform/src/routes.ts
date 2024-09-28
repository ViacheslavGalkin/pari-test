import { FastifyInstance } from 'fastify';
import { createBet, getBets, getEvents } from './bet-service';

export async function betRoutes(fastify: FastifyInstance) {
  fastify.get('/events', async (request, reply) => {
    const events = await getEvents(true);
    if (Array.isArray(events)) {
      return events;
    } else {
      return reply.status(500).send({ error: 'Failed to fetch events' });
    }
  });

  fastify.post('/bets', async (request, reply) => {
    const { eventId, amount } = request.body as {
      eventId: string;
      amount: number;
    };
    const newBet = await createBet(eventId, amount);
    return newBet;
  });

  fastify.get('/bets', async (request, reply) => {
    const bets = await getBets();
    return bets;
  });
}
