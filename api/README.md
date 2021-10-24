# Rhizone LMS API

## Getting Started

1. Install dependencies with `yarn`.
2. Follow the instructions in `nginx/README.md`.
3. Create a file named `.env`.
4. Set `WEBAPP_ORIGIN` to `http://rhi.zone-development` in `.env`.

### Auth

1. [Create a GitHub OAuth application for development](https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app).
2. Add `GITHUB_REDIRECT_URI`, `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` to
    `.env`.

### Database

1. Follow instructions in `/db/README.md`.
2. Add `MYSQL_DATABASE`, `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_USER`, and
    `MYSQL_PASSWORD` to `.env`.
