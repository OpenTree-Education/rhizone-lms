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
   - Authorization callback URL:
     `http://api.rhi.zone-development/auth/github/callback`
5. Click "Register application".
6. Click "Generate a new client secret".
7. Make a copy of the `.env.example` file and name it `.env`.
   1. Paste the Client ID from GitHub as the value for `GITHUB_CLIENT_ID`.
   2. Paste the Client Secret from GitHub as the value for
      `GITHUB_CLIENT_SECRET`.

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
4. When finished developing, press `CTRL + C` to stop Docker Compose.

## Common tasks

### Adding dependencies

All Node dependencies are installed and run in the Docker containers—**_not_**
on the Docker host.

To run `yarn` commands against a module, use `docker-compose run`. For example:

```
docker-compose run api yarn add cowsay
```

The above command would install the `cowsay` NPM package to the `api` module.
The package will be installed into the Docker volume for the `api`
`node_modules`, and the `package.json` and `yarn.lock` files will be updated and
synced to the host so that they can be committed.

### Pulling changes from GitHub

If changes are pulled that update `package.json` or `yarn.lock` files,
`yarn install` will need to be run in the appropriate container. For example, if
a change was made to the dependencies of `webapp`, the following command would
update the dependencies in the Docker volume for the `webapp` `node_modules`.

```
docker-compose run webapp yarn install
```

### Running tests

Test are run inside the Docker containers. For example, to run the `api` tests,
the command would be:

```
docker-compose run api yarn test
```

### TypeScript, ESLint, and Prettier

The Node.js modules use TypeScript, ESLint, and Prettier, which many IDEs have
features to integrate with. The IDEs will require some `node_modules` in order
to work. However, the `node_modules` are installed into Docker volumes and not
synced with the host. Unfortunately, that means that the `node_modules` would
have to be installed on the host as well.

If you want to have the packages available for your IDEs integrations, feel free
to run `yarn install` in the relevant module, but keep in mind that dependencies
now need to be installed and updated both inside the containers and also on the
Docker host.

### Automatically fixing files before committing

ESLint and Prettier can automatically fix many mistakes that will cause
automated checks to fail. It is recommended to use the preconfigured
`yarn delint` command before committing to a module that supports it.

### Developing a database migration

Database migrations run automatically when `docker-compose up` is run. However,
while developing a migration, it is sometimes required to run Flyway commands
manually. Those commands can be run with Docker Compose to inherit the
configuration from `docker-compose.yml`. For example, to print info on the
status of migrations, run:

```
docker-compose run flyway info
```

For more commands, see the
[Flyway CLI docs](https://flywaydb.org/documentation/usage/commandline/).

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

## Troubleshooting and tips

### Create an alias for docker-compose

`docker-compose` takes longer to type than `dc`, so add an alias in your shell
to simplify running commands. For example, the following will add a line
aliasing `dc` to `docker-compose` in the `~/.profile` file.

```
echo 'alias dc="docker-compose"' >> ~/.profile
source ~/.profile
```

Then any `docker-compose` command would be able to be run with `dc`. For
example, `docker-compose up`, would be simply `dc up`.
