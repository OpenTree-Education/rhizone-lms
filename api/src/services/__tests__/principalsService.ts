import {
  parsePutSubmission,
  compareAndUpdatePrincipals,
  addSocialProfile,
  modifySocialProfile,
  deleteSocialProfile,
  modifyBio,
  modifyFullName,
  modifyAvatarURL,
  modifyEmailAddress
} from '../principalsService';
import { mockQuery } from '../mockDb';
  
describe('principalsService', () => {
  describe('parsePutSubmission', () => {
    it('should have a test for this function', async () => {
      expect(true).toEqual(false);
    });
  });
  describe('compareAndUpdatePrincipals', () => {
    it('should have a test for this function', async () => {
      expect(true).toEqual(false);
    });
  });
  describe('addSocialProfile', () => {
    it('should have a test for this function', async () => {
      expect(true).toEqual(false);
    });
  });
  describe('modifySocialProfile', () => {
    it('should have a test for this function', async () => {
      expect(true).toEqual(false);
    });
  });
  describe('deleteSocialProfile', () => {
    it('should have a test for this function', async () => {
      expect(true).toEqual(false);
    });
  });
  describe('modifyBio', () => {
    it('should update a bio for an existing user', async () => {
      const principalId = 1;
      const test_bio = "OpenTree Education";
      mockQuery(
        'update `principals` set `bio` = ? where `id` = ?',
        [test_bio, principalId],
        [principalId]
      );
      expect(await modifyBio(principalId, test_bio)).toEqual([principalId]);
    });

    it('should not update a bio for a non-existant user', async () => {
      const principalId = 2;
      const test_bio = "OpenTree Education";
      mockQuery(
        'update `principals` set `bio` = ? where `id` = ?',
        [test_bio, principalId],
        []
      );
      expect(await modifyBio(principalId, test_bio)).toEqual([]);
    });
  });
  describe('modifyFullName', () => {
    it('should update a full name for an existing user', async () => {
      const principalId = 1;
      const test_fname = "OpenTree Education";
      mockQuery(
        'update `principals` set `full_name` = ? where `id` = ?',
        [test_fname, principalId],
        [principalId]
      );
      expect(await modifyFullName(principalId, test_fname)).toEqual([principalId]);
    });

    it('should not update a full name for a non-existant user', async () => {
      const principalId = 2;
      const test_fname = "OpenTree Education";
      mockQuery(
        'update `principals` set `full_name` = ? where `id` = ?',
        [test_fname, principalId],
        []
      );
      expect(await modifyFullName(principalId, test_fname)).toEqual([]);
    });
  });
  describe('modifyAvatarURL', () => {
    it('should update an avatar URL for an existing user', async () => {
      const principalId = 1;
      const test_avatar = "http://example.org";
      mockQuery(
        'update `principals` set `avatar_url` = ? where `id` = ?',
        [test_avatar, principalId],
        [principalId]
      );
      expect(await modifyAvatarURL(principalId, test_avatar)).toEqual([principalId]);
    });

    it('should not update an avatar URL for a non-existant user', async () => {
      const principalId = 2;
      const test_avatar = "http://example.org";
      mockQuery(
        'update `principals` set `avatar_url` = ? where `id` = ?',
        [test_avatar, principalId],
        []
      );
      expect(await modifyAvatarURL(principalId, test_avatar)).toEqual([]);
    });
  });
  describe('modifyEmailAddress', () => {
    it('should update an email address for an existing user', async () => {
      const principalId = 1;
      const test_email = "test@example.org";
      mockQuery(
        'update `principals` set `email_address` = ? where `id` = ?',
        [test_email, principalId],
        [principalId]
      );
      expect(await modifyEmailAddress(principalId, test_email)).toEqual([principalId]);
    });

    it('should not update an email address for a non-existant user', async () => {
      const principalId = 2;
      const test_email = "test@example.org";
      mockQuery(
        'update `principals` set `email_address` = ? where `id` = ?',
        [test_email, principalId],
        []
      );
      expect(await modifyEmailAddress(principalId, test_email)).toEqual([]);
    });
  });
});