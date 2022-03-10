import {
  countMeetings,
  createMeetingNote,
  findMeeting,
  listMeetings,
  participantExists,
} from '../meetingsService';
import { mockQuery } from '../mockDb';

describe('meetingsService', () => {
  describe('countMeetings', () => {
    it('should query for the count of the meetings the principal is participating in', async () => {
      const principalId = 2;
      mockQuery(
        'select count(*) as `total_count` from `meetings` inner join `participants` on `participants`.`meeting_id` = `meetings`.`id` where `participants`.`principal_id` = ?',
        [principalId],
        [{ total_count: 3 }]
      );
      expect(await countMeetings(principalId)).toEqual(3);
    });
  });

  describe('findMeeting', () => {
    it('should query for the meeting with the given id and its participants and meeting notes', async () => {
      const meetingId = 2;
      const principalId = 3;
      const meetingNotes = [
        {
          id: 4,
          note_text: 'test',
          sort_order: 0,
          authoring_participant_id: 5,
          agenda_owning_participant_id: 6,
        },
      ];
      const participants = [
        { id: 5, principal_id: 3 },
        { id: 6, principal_id: 7 },
      ];
      const startsAt = '2000-01-01 00:00:00';
      mockQuery(
        'select `meetings`.`id` as `id`, `starts_at` from `meetings` inner join `participants` on `participants`.`meeting_id` = `meetings`.`id` where `meetings`.`id` = ? and `participants`.`principal_id` = ?',
        [meetingId, principalId],
        [{ id: meetingId, starts_at: startsAt }]
      );
      mockQuery(
        'select `meeting_notes`.`id` as `id`, `note_text`, `sort_order`, `authoring_participant_id`, `agenda_owning_participant_id` from `meeting_notes` inner join `participants` on `participants`.`id` = `meeting_notes`.`authoring_participant_id` where `participants`.`meeting_id` = ? order by agenda_owning_participant_id is null, `agenda_owning_participant_id` asc, `sort_order` asc, `meeting_notes`.`created_at` asc',
        [meetingId],
        meetingNotes
      );
      mockQuery(
        'select `id`, `principal_id` from `participants` where `meeting_id` = ? order by `created_at` asc',
        [meetingId],
        participants
      );
      expect(await findMeeting(meetingId, principalId)).toEqual({
        id: meetingId,
        meeting_notes: meetingNotes,
        participants,
        starts_at: startsAt,
      });
    });

    it('should return null if no meeting with the given id was found', async () => {
      const meetingId = 2;
      const principalId = 3;
      mockQuery(
        'select `meetings`.`id` as `id`, `starts_at` from `meetings` inner join `participants` on `participants`.`meeting_id` = `meetings`.`id` where `meetings`.`id` = ? and `participants`.`principal_id` = ?',
        [meetingId, principalId],
        []
      );
      expect(await findMeeting(meetingId, principalId)).toEqual(null);
    });
  });

  describe('listMeetings', () => {
    it('should query for a page of meetings the specified principal is a participant in, and participants in those meetings', async () => {
      const principalId = 2;
      const limit = 3;
      const offset = 4;
      const meetingId = 5;
      const startsAt = '2000-01-01 00:00:00';
      const participants = [
        { id: 6, meeting_id: meetingId, principal_id: principalId },
      ];
      mockQuery(
        'select `meetings`.`id` as `id`, `starts_at` from `meetings` inner join `participants` on `participants`.`meeting_id` = `meetings`.`id` where `participants`.`principal_id` = ? order by `starts_at` desc, `meetings`.`created_at` asc limit ? offset ?',
        [principalId, limit, offset],
        [{ id: meetingId, starts_at: startsAt }]
      );
      mockQuery(
        'select `id`, `meeting_id`, `principal_id` from `participants` where `meeting_id` in (?) order by `created_at` asc',
        [meetingId],
        participants
      );
      expect(await listMeetings(principalId, limit, offset)).toEqual([
        { id: meetingId, starts_at: startsAt, participants },
      ]);
    });

    it('should not query for participants if no meetings were found', async () => {
      const principalId = 2;
      const limit = 3;
      const offset = 4;
      mockQuery(
        'select `meetings`.`id` as `id`, `starts_at` from `meetings` inner join `participants` on `participants`.`meeting_id` = `meetings`.`id` where `participants`.`principal_id` = ? order by `starts_at` desc, `meetings`.`created_at` asc limit ? offset ?',
        [principalId, limit, offset],
        []
      );
      expect(await listMeetings(principalId, limit, offset)).toEqual([]);
    });
  });

  describe('participantExists', () => {
    it('should query for the participant with the given id and associated meeting with given id', async () => {
      const meetingId = 2;
      const principalId = 3;
      mockQuery(
        'select `id` from `participants` where `meeting_id` = ? and `principal_id` = ?',
        [meetingId, principalId],
        [{ id: 2 }]
      );
      expect(await participantExists(meetingId, principalId)).toEqual(true);
    });
    it('should should not query for participants if no meetings were found', async () => {
      const meetingId = 2;
      const principalId = 3;
      mockQuery(
        'select `id` from `participants` where `meeting_id` = ? and `principal_id` = ?',
        [meetingId, principalId],
        []
      );
      expect(await participantExists(meetingId, principalId)).toEqual(false);
    });
  });

  describe('createMeetingNote', () => {
    it('should insert a meeting note with the authoring participant id of the given principal in the given meeting and returns a complete meeting note object', async () => {
      const meetingId = 2;
      const principalId = 3;
      const agendaOwningParticipantId = 4;
      const noteText = '';
      const sortOrder = 0;
      const meetingNoteId = 5;
      const authoringParticipantId = 6;
      const createdAt = '2000-01-01 00:00:00';
      const meetingNote = {
        id: meetingNoteId,
        agenda_owning_participant_id: agendaOwningParticipantId,
        authoring_participant_id: authoringParticipantId,
        sort_order: sortOrder,
        note_text: noteText,
        created_at: createdAt,
      };
      mockQuery(
        'select `id` from `participants` where `meeting_id` = ? and `principal_id` = ?',
        [meetingId, principalId],
        [{ id: 6 }]
      );
      mockQuery(
        'insert into `meeting_notes` (`agenda_owning_participant_id`, `authoring_participant_id`, `note_text`, `sort_order`) values (?, ?, ?, ?)',
        [agendaOwningParticipantId, 6, noteText, sortOrder],
        [meetingNoteId]
      );
      mockQuery(
        'select `id`, `agenda_owning_participant_id`, `authoring_participant_id`, `sort_order`, `note_text`, `created_at` from `meeting_notes` where `id` = ?',
        [meetingNoteId],
        [meetingNote]
      );
      expect(
        await createMeetingNote(
          meetingId,
          principalId,
          agendaOwningParticipantId,
          noteText,
          sortOrder
        )
      ).toEqual(meetingNote);
    });
    it('should resolve to null when the query to insert a meeting note responds with an empty array', async () => {
      const meetingId = 2;
      const principalId = 3;
      const agendaOwningParticipantId = 4;
      const noteText = '';
      const sortOrder = 0;
      mockQuery(
        'select `id` from `participants` where `meeting_id` = ? and `principal_id` = ?',
        [meetingId, principalId],
        [{ id: 6 }]
      );
      mockQuery(
        'insert into `meeting_notes` (`agenda_owning_participant_id`, `authoring_participant_id`, `note_text`, `sort_order`) values (?, ?, ?, ?)',
        [agendaOwningParticipantId, 6, noteText, sortOrder],
        []
      );
      expect(
        await createMeetingNote(
          meetingId,
          principalId,
          agendaOwningParticipantId,
          noteText,
          sortOrder
        )
      ).toEqual(null);
    });
    it('should return a null value if a meetingNote cannot be found from the meeting note id', async () => {
      const meetingId = 2;
      const principalId = 3;
      const agendaOwningParticipantId = 4;
      const noteText = '';
      const sortOrder = 0;
      const meetingNoteId = 5;
      mockQuery(
        'select `id` from `participants` where `meeting_id` = ? and `principal_id` = ?',
        [meetingId, principalId],
        [{ id: 6 }]
      );
      mockQuery(
        'insert into `meeting_notes` (`agenda_owning_participant_id`, `authoring_participant_id`, `note_text`, `sort_order`) values (?, ?, ?, ?)',
        [agendaOwningParticipantId, 6, noteText, sortOrder],
        [meetingNoteId]
      );
      mockQuery(
        'select `id`, `agenda_owning_participant_id`, `authoring_participant_id`, `sort_order`, `note_text`, `created_at` from `meeting_notes` where `id` = ?',
        [meetingNoteId],
        []
      );
      expect(
        await createMeetingNote(
          meetingId,
          principalId,
          agendaOwningParticipantId,
          noteText,
          sortOrder
        )
      ).toEqual(null);
    });
    it('should resolve to null if the given principal id and meeting id do not refer to an existing participant', async () => {
      const meetingId = 2;
      const principalId = 3;
      mockQuery(
        'select `id` from `participants` where `meeting_id` = ? and `principal_id` = ?',
        [meetingId, principalId],
        []
      );
      expect(
        await createMeetingNote(meetingId, principalId, null, '', 0)
      ).toEqual(null);
    });
  });
});
