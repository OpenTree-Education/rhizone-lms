import {
  collectionEnvelope,
  errorEnvelope,
  itemEnvelope,
} from '../responseEnvelope';

describe('responseEnvelope', () => {
  describe('itemEnvelope', () => {
    it('should wrap the item in an object with a data property', () => {
      expect(itemEnvelope({})).toEqual({ data: {} });
    });
  });

  describe('collectionEnvelope', () => {
    it('should wrap the collection in an object with a data property and a summary object with a total count property', () => {
      expect(collectionEnvelope([], 0)).toEqual({
        data: [],
        summary: { total_count: 0 },
      });
    });
  });

  describe('errorEnvelope', () => {
    it('should wrap the error message in an object with an error object with a message property', () => {
      expect(errorEnvelope('test')).toEqual({ error: { message: 'test' } });
    });
  });
});
