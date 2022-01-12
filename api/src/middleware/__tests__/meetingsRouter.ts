import { collectionEnvelope, itemEnvelope } from '../responseEnvelope';
import {
  countMeetings,
  createMeetingNote,
  findMeeting,
  listMeetings,
} from '../../services/meetingsService';
import { createAppAgentForRouter, mockPrincipalId } from '../routerTestUtils';
import meetingsRouter from '../meetingsRouter';

jest.mock('../../services/meetingsService');
const mockCountMeetings = jest.mocked(countMeetings);
const mockCreateMeetingNote = jest.mocked(createMeetingNote);
const mockFindMeeting = jest.mocked(findMeeting);
const mockListMeetings = jest.mocked(listMeetings);

describe('meetingsRouter', () => {
  const appAgent = createAppAgentForRouter(meetingsRouter);

  describe('GET /', () => {
    it('should respond with a paginated list of the current principals meetings', done => {
      const meetings = [{ id: 3 }];
      const meetingsCount = meetings.length;
      const principalId = 2;
      mockPrincipalId(principalId);
      mockCountMeetings.mockResolvedValue(meetingsCount);
      mockListMeetings.mockResolvedValue(meetings);
      appAgent
        .get('/?page=2&perpage=1')
        .expect(200, collectionEnvelope(meetings, meetingsCount), err => {
          expect(mockCountMeetings).toHaveBeenCalledWith(principalId);
          expect(mockListMeetings).toHaveBeenCalledWith(principalId, 1, 1);
          done(err);
        });
    });

    it('should respond with an internal server error if an error was thrown while counting meetings', done => {
      mockCountMeetings.mockRejectedValue(new Error());
      mockListMeetings.mockResolvedValue([]);
      appAgent.get('/').expect(500, done);
    });

    it('should respond with an internal server error if an error was thrown while listing meetings', done => {
      mockCountMeetings.mockResolvedValue(0);
      mockListMeetings.mockRejectedValue(new Error());
      appAgent.get('/').expect(500, done);
    });
  });

  describe('GET /:id', () => {
    it('should respond with the meeting with the given id', done => {
      const meetingId = 1;
      const principalId = 2;
      const meeting = { id: meetingId };
      mockPrincipalId(principalId);
      mockFindMeeting.mockResolvedValue(meeting);
      appAgent.get(`/${meetingId}`).expect(200, itemEnvelope(meeting), err => {
        expect(mockFindMeeting).toHaveBeenCalledWith(meetingId, principalId);
        done(err);
      });
    });

    it('should respond with a bad request error if the given id is not an integer', done => {
      appAgent.get('/invalid').expect(400, done);
    });

    it('should respond with a bad request error if the given id is less than 1', done => {
      appAgent.get('/0').expect(400, done);
    });

    it('should respond with a not found error if no meeting with the given id exists', done => {
      mockFindMeeting.mockResolvedValue(null);
      appAgent.get('/1').expect(404, done);
    });

    it('should respond with an internal server error if an error was thrown while finding the meeting', done => {
      mockFindMeeting.mockRejectedValue(new Error());
      appAgent.get('/1').expect(500, done);
    });
  });

  describe('POST /:id/notes', () => {
    it('should create a meeting note for the given meeting id', done => {
      const meetingId = 1;
      const principalId = 2;
      const meetingNote = { id: 3 };
      mockPrincipalId(principalId);
      mockCreateMeetingNote.mockResolvedValue(meetingNote);
      const agendaOwningParticipantId = 4;
      const noteText = 'test';
      const sortOrder = 0;
      appAgent
        .post(`/${meetingId}/notes`)
        .send({
          agenda_owning_participant_id: agendaOwningParticipantId,
          note_text: noteText,
          sort_order: sortOrder,
        })
        .expect(201, itemEnvelope(meetingNote), err => {
          expect(mockCreateMeetingNote).toHaveBeenCalledWith(
            meetingId,
            principalId,
            agendaOwningParticipantId,
            noteText,
            sortOrder
          );
          done(err);
        });
    });

    it('should respond with a bad request error if the given id is not an integer', done => {
      appAgent
        .post('/invalid/notes')
        .send({
          agenda_owning_participant_id: null,
          note_text: '',
          sort_order: 0,
        })
        .expect(400, done);
    });

    it('should respond with a bad request error if the given id is less than 1', done => {
      appAgent
        .post('/0/notes')
        .send({
          agenda_owning_participant_id: null,
          note_text: '',
          sort_order: 0,
        })
        .expect(400, done);
    });

    it('should respond with a validation error if the note text is not a string', done => {
      appAgent
        .post('/1/notes')
        .send({
          agenda_owning_participant_id: null,
          sort_order: 0,
        })
        .expect(422, done);
    });

    it('should respond with a validation error if the sort order is not a number', done => {
      appAgent
        .post('/1/notes')
        .send({
          agenda_owning_participant_id: null,
          note_text: '',
        })
        .expect(422, done);
    });

    it('should respond with a validation error if the agenda owning participant id is not an integer or null', done => {
      appAgent
        .post('/1/notes')
        .send({
          note_text: '',
          sort_order: 0,
        })
        .expect(422, done);
    });

    it('should respond with a validation error if the agenda owning participant id is not greater than zero or null', done => {
      appAgent
        .post('/1/notes')
        .send({
          agenda_owning_participant_id: 0,
          note_text: '',
          sort_order: 0,
        })
        .expect(422, done);
    });

    it('should respond with a not found error if no meeting with the given id exists', done => {
      mockCreateMeetingNote.mockResolvedValue(null);
      appAgent
        .post('/1/notes')
        .send({
          agenda_owning_participant_id: null,
          note_text: '',
          sort_order: 0,
        })
        .expect(404, done);
    });

    it('should respond with an internal server error if an error was thrown while creating the meeting note', done => {
      mockCreateMeetingNote.mockRejectedValue(new Error());
      appAgent
        .post('/1/notes')
        .send({
          agenda_owning_participant_id: null,
          note_text: '',
          sort_order: 0,
        })
        .expect(500, done);
    });
  });
});
