export const getGithubAccessToken = jest.fn(
  () => process.env.MOCK_ACCESS_TOKEN
);
export const getGithubUser = jest.fn(() => ({
  id: process.env.MOCK_GITHUB_USER_ID,
}));
