import { FastifyInstance } from 'fastify';
import { createEvent, getEvents, updateEventStatus } from './event-service';
import { Status } from './types';

export async function eventRoutes(fastify: FastifyInstance) {
  fastify.get('/events', async (request, reply) => {
    const events = getEvents();
    return events;
  });

  fastify.post('/events', async (request, reply) => {
    const { coefficient, deadline } = request.body as {
      coefficient: number;
      deadline: number;
    };
    const newEvent = createEvent(coefficient, deadline);
    return newEvent;
  });

  fastify.put('/events/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { status } = request.body as { status: Status };
    const updatedEvent = await updateEventStatus(id, status);
    return updatedEvent;
  });
}
