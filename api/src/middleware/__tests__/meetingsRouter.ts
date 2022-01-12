import { collectionEnvelope } from '../responseEnvelope';
import { countMeetings, listMeetings } from '../../services/meetingsService';
import { createAppAgentForRouter, mockPrincipalId } from '../routerTestUtils';
import meetingsRouter from '../meetingsRouter';

jest.mock('../../services/meetingsService');
const mockCountMeetings = jest.mocked(countMeetings);
const mockListMeetings = jest.mocked(listMeetings);

describe('meetingsRouter', () => {
  const appAgent = createAppAgentForRouter(meetingsRouter);

  describe('GET /', () => {
    it('should respond with a paginated list of the current principals meetings', done => {
      const meetings = [{ id: 3 }];
      const principalId = 2;
      mockPrincipalId(principalId);
      mockCountMeetings.mockResolvedValue(0);
      mockListMeetings.mockResolvedValue(meetings);
      appAgent
        .get('/?page=2&perpage=1')
        .expect(200, collectionEnvelope(meetings, 0), err => {
          expect(mockCountMeetings).toHaveBeenCalledWith(principalId);
          expect(mockListMeetings).toHaveBeenCalledWith(principalId, 1, 1);
          done(err);
        });
    });
  });
});
