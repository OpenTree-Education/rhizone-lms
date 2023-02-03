import { formatDate, formatTime, formatDateTime } from '../dateTime';

describe('dateTime', () => {
  describe('formatDate', () => {
    it('should return a string containing date in en-CA format', () => {
      const result = formatDate('2021-11-04T10:00:00.000Z', 'en-CA');

      expect(result).toBe('November 4, 2021');
    });

    it('should return a string containing date in en-US format', () => {
      const result = formatDate('2021-11-04T10:00:00.000Z', 'en-US');

      expect(result).toBe('November 4, 2021');
    });

    it('should return a string containing date in fr-CA format', () => {
      const result = formatDate('2021-11-04T10:00:00.000Z', 'fr-CA');

      expect(result).toBe('4 novembre 2021');
    });

    it('should return an empty string when passing an undefined value', () => {
      const result = formatDateTime(undefined as any as string);
      expect(result).toBe('');
    });
  });

  describe('formatTime', () => {
    it('should return a string containing time in en-CA format', () => {
      const result = formatTime('2021-11-04T10:00:00.000Z', 'en-CA');

      expect(result).toBe('10:00 a.m.');
    });

    it('should return a string containing time in en-US format', () => {
      const result = formatTime('2021-11-04T10:00:00.000Z', 'en-US');

      expect(result).toBe('10:00 AM');
    });

    it('should return a string containing time in fr-CA format', () => {
      const result = formatTime('2021-11-04T10:00:00.000Z', 'fr-CA');

      expect(result).toBe('10 h 00');
    });

    it('should return an empty string when passing an undefined value', () => {
      const result = formatDateTime(undefined as any as string);
      expect(result).toBe('');
    });
  });

  describe('formatDateTime function', () => {
    it('should return a string containing date and time in en-CA format', () => {
      const result = formatDateTime('2021-11-04T10:00:00.000Z', 'en-CA');

      expect(result).toBe('November 4, 2021, 10:00 a.m.');
    });

    it('should return a string containing date and time in en-US format', () => {
      const result = formatDateTime('2021-11-04T10:00:00.000Z', 'en-US');

      expect(result).toBe('November 4, 2021, 10:00 AM');
    });

    it('should return a string containing date and time in fr-CA format', () => {
      const result = formatDateTime('2021-11-04T10:00:00.000Z', 'fr-CA');

      expect(result).toBe('4 novembre 2021, 10 h 00');
    });

    it('should return an empty string when passing an undefined value', () => {
      const result = formatDateTime(undefined as any as string);
      expect(result).toBe('');
    });
  });
});
