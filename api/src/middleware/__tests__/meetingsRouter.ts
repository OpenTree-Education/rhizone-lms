import { collectionEnvelope, itemEnvelope } from '../responseEnvelope';
import {
  countMeetings,
  findMeeting,
  listMeetings,
} from '../../services/meetingsService';
import { createAppAgentForRouter, mockPrincipalId } from '../routerTestUtils';
import meetingsRouter from '../meetingsRouter';

jest.mock('../../services/meetingsService');
const mockCountMeetings = jest.mocked(countMeetings);
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
  });
});
