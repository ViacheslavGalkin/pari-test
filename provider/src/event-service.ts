import amqp from 'amqplib/callback_api';
import { sendEventStatusUpdate } from './rabbitmq';
import { Event, Status } from './types';
import { v4 as uuidv4 } from 'uuid';

let events: { [id: string]: Event } = {};

amqp.connect;
export function createEvent(coefficient: number, deadline: number): Event {
  const id = uuidv4();
  const newEvent: Event = {
    id: id,
    coefficient,
    deadline,
    status: Status.Pending,
  };
  events[id] = newEvent;
  return newEvent;
}

export function getEvents(): Event[] {
  return Object.values(events);
}

export async function updateEventStatus(
  id: string,
  status: Status
): Promise<Event> {
  const event = events[id];
  if (!event) throw new Error('Event not found');
  event.status = status;
  await sendEventStatusUpdate(id, status);
  return event;
}
