import { tracker } from './mockDb';

jest.mock('./githubApi');

process.env.GITHUB_CLIENT_ID = 'TEST_GITHUB_CLIENT_ID';
process.env.GITHUB_REDIRECT_URI = 'TEST_GITHUB_REDIRECT_URI';
process.env.WEBAPP_ORIGIN = 'TEST_WEBAPP_ORIGIN';
process.env.MOCK_GITHUB_USER_ID = '1000';
process.env.MOCK_PRINCIPAL_ID = '1';
process.env.MOCK_ACCESS_TOKEN = 'MOCK_ACCESS_TOKEN';
process.env.MOCK_REFLECTION_ID = '1'
 
beforeEach(() => {
  tracker.install();
});

afterEach(() => {
  tracker.uninstall();
});
