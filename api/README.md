# API

## Getting Started

1. Add a line in `/etc/hosts` that resolves the domain `api.development.rhizone`
    to `127.0.0.1`
2. Create a file named `.env`
3. Add `WEBAPP_ORIGIN` to `.env`

### Auth

1. Create a GitHub OAuth application for development
2. Add `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` to `.env`

### Database

1. Follow instructions in `/db/README.md`
2. Add `MYSQL_DATABASE`, `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_USER`, and
    `MYSQL_PASSWORD` to `.env`
