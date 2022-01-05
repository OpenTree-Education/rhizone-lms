# Rhizone LMS

This monorepo contains the applications and services that constitute the Rhizone
Learning Management System.

## Getting started

### 1. GitHub authentication

The app uses GitHub as an auth provider. Each dev must create their own GitHub
app to handle authentication.

1. Log into GitHub.
2. Go to [Settings / Developer settings](https://github.com/settings/apps).
3. Click "New OAuth App".
4. Enter the following data.
   - Application name: `Rhizone LMS (Development)`
   - Homepage URL: `http://rhi.zone-development/`
   - Application description: `Rhizone LMS (Development)`
   - Authorization callback URL: `http://api.rhi.zone-development/auth/github/callback`
5. Click "Register application".
6. Click "Generate a new client secret".
7. Make a copy of the `.env.example` file and name it `.env`.
   1. Paste the Client ID from GitHub as the value for `GITHUB_CLIENT_ID`.
   2. Paste the Client Secret from GitHub as the value for `GITHUB_CLIENT_SECRET`.

### 2. Development domain name

The development environment assumes that the domains `rhi.zone-development` and
`api.rhi.zone-development` resolve to your dev machine.

1. Open your `hosts` file for editing. You may need to do this with
    administrator privileges. On macOS and Linux, the file is at `/etc/hosts`.
    On Windows it is at `C:\Windows\System32\drivers\etc\hosts`.
2. Add the following lines to resolve the development domain names to the
    loopback address.

```
127.0.0.1 rhi.zone-development
127.0.0.1 api.rhi.zone-development
```

### 3. Docker Compose

The development environment uses Docker Compose to run all the required services
at once.

1. [Install Docker Compose](https://docs.docker.com/compose/install/). For macOS
    and Windows users, Docker Compose comes with
    [Docker Desktop](https://www.docker.com/products/docker-desktop).
2. Run `docker-compose up` to start the dev environment.
3. Once the containers have started, visit http://rhi.zone-development/ in your
    web browser to use the app.

## Modules

### `/api`

The `/api` folder contains an [Express.js](https://expressjs.com/) server that
exposes an HTTP API that allows other applications to interact with the
database and third-party services like GitHub.

### `/db`

The `/db` folder contains scripts and migrations for the database.

### `/nginx`

The `/nginx` folder contains configuration files for Nginx for different
environments.

### `/webapp`

The `/webapp` folder contains a React app that enables user functionality and
communicates with the api.

### `/website`

The `/website` folder contains a Gatsby site that is published as the marketing
website for OpenTree Education.
