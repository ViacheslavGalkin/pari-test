import { Bet, Event, PrismaClient } from '@prisma/client';
import axios from 'axios';
import { FastifyInstance } from 'fastify';
import { compareDeadline, validateBetAmount } from './functions';

const prisma = new PrismaClient();

type Error = {
  error: string;
};

export async function getEvents(
  checkStatus: boolean
): Promise<Event[] | Error> {
  try {
    const response = await axios.get(
      `${process.env.PROVIDER_URL}${process.env.PROVIDER_PORT}/events`
    );
    const events = response.data;
    if (!checkStatus) return events;
    const availableEvents = events.filter(
      (event: Event) =>
        compareDeadline(event.deadline) && event.status === 'pending'
    );

    for (let event of availableEvents) {
      await prisma.event.upsert({
        where: { id: event.id },
        update: event,
        create: event,
      });
    }

    return availableEvents;
  } catch (error) {
    return { error: 'Failed to load events' };
  }
}

export async function createBet(eventId: string, amount: number): Promise<Bet> {
  let event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) {
    const events = await getEvents(true);
    if (Array.isArray(events))
      event = events.find((event) => event.id === eventId) || null;
  }
  if (!event || compareDeadline(event.deadline))
    throw new Error('Event not available for betting');

  const isAmountValid = validateBetAmount(amount);
  if (!isAmountValid) throw new Error('Invalid bet amount');

  const potentialWin = amount * event.coefficient;
  const newBet = await prisma.bet.create({
    data: {
      eventId,
      amount,
      potentialWin,
      status: 'pending',
    },
  });

  return newBet;
}

export async function getBets(): Promise<Bet[]> {
  return prisma.bet.findMany();
}

export async function updateBetStatus(eventId: string, status: 'won' | 'lost') {
  const bet = await prisma.bet.findUnique({ where: { id: eventId } });
  if (!bet) throw new Error('Bet not found');

  await prisma.bet.update({
    where: { id: bet.id },
    data: { status },
  });
}

export async function updateEventStatus(eventId: string, status: string) {
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) {
    const events = await getEvents(false);
    if (Array.isArray(events)) {
      const newEvent = events.find((event) => event.id === eventId);
      return newEvent || null;
    }
  }

  await prisma.event.update({
    where: { id: eventId },
    data: { status },
  });
}
