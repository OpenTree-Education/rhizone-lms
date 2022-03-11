import { compareMeetingNotes } from '../meetingsHelper';
import { MeetingNote } from '../../types/api';

describe('meetingsHelper', () => {
  describe('compareMeetingNotes', () => {
    it('should agenda items (non-null agenda-owning participants) before action items (null agenda-owning participants)', () => {
      expect(
        compareMeetingNotes(
          { agenda_owning_participant_id: 1 } as MeetingNote,
          { agenda_owning_participant_id: null } as MeetingNote
        )
      ).toBeLessThan(0);
    });
    it('should action items (null agenda-owning participants) after agenda items (non-null agenda-owning participants)', () => {
      expect(
        compareMeetingNotes(
          { agenda_owning_participant_id: null } as MeetingNote,
          { agenda_owning_participant_id: 1 } as MeetingNote
        )
      ).toBeGreaterThan(0);
    });
    it('should sort participants with smaller ids first', () => {
      expect(
        compareMeetingNotes(
          { agenda_owning_participant_id: 1 } as MeetingNote,
          { agenda_owning_participant_id: 2 } as MeetingNote
        )
      ).toBeLessThan(0);
    });
    it('should sort participants with larger ids last', () => {
      expect(
        compareMeetingNotes(
          { agenda_owning_participant_id: 2 } as MeetingNote,
          { agenda_owning_participant_id: 1 } as MeetingNote
        )
      ).toBeGreaterThan(0);
    });
    it('should sort notes with smaller sort orders first', () => {
      expect(
        compareMeetingNotes(
          { agenda_owning_participant_id: null, sort_order: 0 } as MeetingNote,
          { agenda_owning_participant_id: null, sort_order: 1 } as MeetingNote
        )
      ).toBeLessThan(0);
    });
    it('should sort notes with larger sort orders last', () => {
      expect(
        compareMeetingNotes(
          { agenda_owning_participant_id: null, sort_order: 1 } as MeetingNote,
          { agenda_owning_participant_id: null, sort_order: 0 } as MeetingNote
        )
      ).toBeGreaterThan(0);
    });
    it('should sort notes with earlier created at dates first', () => {
      expect(
        compareMeetingNotes(
          {
            agenda_owning_participant_id: null,
            sort_order: 0,
            created_at: '1999-12-31T11:59:59Z',
          } as MeetingNote,
          {
            agenda_owning_participant_id: null,
            sort_order: 0,
            created_at: '2000-01-01T00:00:00Z',
          } as MeetingNote
        )
      ).toBeLessThan(0);
    });
    it('should sort notes with later created at dates last', () => {
      expect(
        compareMeetingNotes(
          {
            agenda_owning_participant_id: null,
            sort_order: 0,
            created_at: '2000-01-01T00:00:00Z',
          } as MeetingNote,
          {
            agenda_owning_participant_id: null,
            sort_order: 0,
            created_at: '1999-12-31T11:59:59Z',
          } as MeetingNote
        )
      ).toBeGreaterThan(0);
    });
  });
});
