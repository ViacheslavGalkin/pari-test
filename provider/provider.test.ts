import { getEvents, createEvent, updateEventStatus } from './src/event-service';
import { Status } from './src/types';

jest.mock('./src/rabbitmq.ts', () => ({
  sendEventStatusUpdate: jest.fn(),
}));

describe('Event Service', () => {
  beforeAll(() => {
    (global as any).events = {};
  });

  describe('getEvents', () => {
    it('должен возвращать пустой список событий, если событий нет', () => {
      const result = getEvents();
      expect(result).toEqual([]);
    });

    it('должен возвращать список событий, если события существуют', () => {
      createEvent(1.75, 1700000000);
      const result = getEvents();
      expect(result.length).toBe(1);
      expect(result[0]).toHaveProperty('id');
      expect(result[0].coefficient).toBe(1.75);
    });
  });

  describe('createEvent', () => {
    it('должен создать событие с правильными значениями', () => {
      const newEvent = createEvent(2.1, 1700003600);
      expect(newEvent).toHaveProperty('id');
      expect(newEvent.coefficient).toBe(2.1);
      expect(newEvent.deadline).toBe(1700003600);
      expect(newEvent.status).toBe('pending');
    });

    it('должен добавлять новое событие в список событий', () => {
      const eventsFirst = getEvents();
      const newEvent = createEvent(1.85, 1700007200);
      const eventsSecond = getEvents();
      expect(eventsSecond.length).toBeGreaterThan(eventsFirst.length);
      expect(newEvent.coefficient).toBe(1.85);
    });
  });

  describe('updateEventStatus', () => {
    it('должен обновить статус события, если событие существует', async () => {
      const newEvent = createEvent(2.1, 1700003600);
      const updatedEvent = await updateEventStatus(
        newEvent.id,
        Status.FirstTeamWon
      );
      expect(updatedEvent.status).toBe('first_team_won');
    });

    it('должен выбрасывать ошибку, если событие не найдено', () => {
      expect(() =>
        updateEventStatus('invalid_id', Status.FirstTeamWon)
      ).rejects.toThrow('Event not found');
    });
  });
});
