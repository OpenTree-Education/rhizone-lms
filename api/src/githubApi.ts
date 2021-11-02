import request from "superagent";
import querystring from "querystring";

export const getGithubAccessToken = async (code: string) => {
  const response = await request.post(
    `https://github.com/login/oauth/access_token?${querystring.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    })}`
  );
  return response.body.access_token;
}

export const getGithubUser = async (accessToken: string) => {
  const response = await request
    .get("https://api.github.com/user")
    .set("User-Agent", "Rhizone LMS")
    .set("Authorization", `token ${accessToken}`);
  return response.body;
};
