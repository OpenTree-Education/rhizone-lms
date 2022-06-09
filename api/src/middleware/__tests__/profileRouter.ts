import profileRouter from '../profileRouter';
import { createAppAgentForRouter, mockPrincipalId } from '../routerTestUtils';
import { getUserProfileData } from '../../services/getUserProfileDataService';
import {
  compareAndUpdatePrincipals,
  parsePutSubmission
} from '../../services/principalsService';
import { collectionEnvelope } from '../responseEnvelope';
import { NotFoundError } from '../httpErrors';

jest.mock('../../services/getUserProfileDataService');
jest.mock('../../services/principalsService');

const mockGetUserProfileData = jest.mocked(getUserProfileData);
const mockCompareAndUpdatePrincipals = jest.mocked(compareAndUpdatePrincipals);
const mockParsePutSubmission = jest.mocked(parsePutSubmission);

describe('profileRouter', () => {
  const appAgent = createAppAgentForRouter(profileRouter);
  const valid_user_principal_id = 1;
  const valid_user_full_name = "OpenTree Education";
  const valid_user_email = "email@example.com";
  const valid_user_github_id = 1000;
  const valid_user_github_username = "OpenTree-Education";
  const valid_user_other_data = "";
  const valid_user_data_same = {
    "id": valid_user_principal_id,
    "full_name": valid_user_full_name,
    "email_address": valid_user_email,
    "bio": valid_user_other_data,
    "github_accounts": [{
      "github_id": valid_user_github_id,
      "username": valid_user_github_username,
      "full_name": valid_user_full_name,
      "bio": valid_user_other_data,
      "avatar_url": valid_user_other_data,
      "principal_id": valid_user_principal_id
    }],
    "social_profiles": [{
      "network_name": "GitHub",
      "user_name": valid_user_github_username,
      "profile_url": `//github.com/${valid_user_github_username}`,
      "public": true
    },{
      "network_name": "email",
      "user_name": valid_user_email,
      "profile_url": `mailto:${valid_user_email}`,
      "public": false
    }]
  };
  const valid_user_data_different = {
    "id": valid_user_principal_id + 1,
    "full_name": valid_user_full_name,
    "email_address": "",
    "bio": valid_user_other_data,
    "github_accounts": [{
      "github_id": valid_user_github_id,
      "username": valid_user_github_username,
      "full_name": valid_user_full_name,
      "bio": valid_user_other_data,
      "avatar_url": valid_user_other_data,
      "principal_id": valid_user_principal_id
    }],
    "social_profiles": [{
      "network_name": "GitHub",
      "user_name": valid_user_github_username,
      "profile_url": `//github.com/${valid_user_github_username}`,
      "public": true
    }]
  };

  describe('GET /', () => {
    it('should reject requests for profiles without specifying a principal ID', done => {
      appAgent.get('/').expect(400, done);
    });
  });

  describe('GET /:id', () => {
    const appAgent = createAppAgentForRouter(profileRouter);

    it('should respond with valid profile data for our own principal ID', done => {
      mockPrincipalId(valid_user_principal_id);
      mockGetUserProfileData.mockResolvedValue(valid_user_data_same);
      appAgent.get('/1').expect(200, collectionEnvelope([valid_user_data_same], 1), err => {
        done(err);
      });
    });

    it('should respect privacy info with profile data for a different principal ID than our own', done => {
      mockPrincipalId(null);
      mockGetUserProfileData.mockResolvedValue(valid_user_data_different);
      appAgent.get('/2').expect(200, collectionEnvelope([valid_user_data_different], 1), err => {
        done(err);
      });
    });

    it('should reject requests for principal IDs that are NaN', done => {
      appAgent.get('/opentree').expect(400, done);
    });

    it('should show errors for non-existent numerical principal IDs', done => {
      mockGetUserProfileData.mockRejectedValue(new NotFoundError());
      appAgent.get('/3').expect(404, done);
    });
  });

  describe('PUT /:id', () => {
    const appAgent = createAppAgentForRouter(profileRouter);

    it('should respond with valid profile data for updates for our own principal ID', done => {
      mockPrincipalId(valid_user_principal_id);
      mockParsePutSubmission.mockReturnValue(valid_user_data_same);
      mockGetUserProfileData.mockResolvedValue(valid_user_data_same);
      mockCompareAndUpdatePrincipals.mockResolvedValue(true);
      appAgent.put('/1').send(collectionEnvelope([valid_user_data_same], 1)).expect(200, collectionEnvelope([valid_user_data_same], 1), err => {
        done(err);
      });
    });
    
    it('should respond with valid profile data for data for our own principal ID that requires no updates', done => {
      mockPrincipalId(valid_user_principal_id);
      mockParsePutSubmission.mockReturnValue(valid_user_data_same);
      mockGetUserProfileData.mockResolvedValue(valid_user_data_same);
      mockCompareAndUpdatePrincipals.mockResolvedValue(false);
      appAgent.put('/1').send(collectionEnvelope([valid_user_data_same], 1)).expect(200, collectionEnvelope([valid_user_data_same], 1), err => {
        done(err);
      });
    });

    it('should reject updates for profile data from unauthenticated users', done => {
      mockPrincipalId(null);
      appAgent.put('/2').send(collectionEnvelope([valid_user_data_same], 1)).expect(401, done);
    });

    it('should reject updates for profile data for a different principal ID than our own', done => {
      mockPrincipalId(valid_user_principal_id);
      appAgent.put('/2').send(collectionEnvelope([valid_user_data_same], 1)).expect(403, done);
    });

    it('should reject requests for principal IDs that are NaN', done => {
      appAgent.put('/opentree').send(collectionEnvelope([valid_user_data_same], 1)).expect(400, done);
    });

    it('should show errors for authorized requests for non-existent numerical principal IDs', done => {
      mockPrincipalId(valid_user_principal_id);
      mockGetUserProfileData.mockRejectedValue(new NotFoundError());
      appAgent.put('/3').send(collectionEnvelope([valid_user_data_same], 1)).expect(403, done);
    });

    it('should show errors for authorized requests not in Entity format', done => {
      mockPrincipalId(valid_user_principal_id);
      appAgent.put('/1').send(valid_user_data_same).expect(400, done);
    });
  });
});
