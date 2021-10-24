# Rhizone LMS

This monorepo contains the applications and services that constitute the Rhizone
Learning Management System.

## `/api`

The `/api` folder contains an [Express.js](https://expressjs.com/) server that
exposes an HTTP API that allows other applications to interact with the
database and third-party services like GitHub.

## `/db`

The `/db` folder contains scripts and migrations for the database.

## `/nginx`

The `/nginx` folder contains configuration files for Nginx for different
environments.

## `/webapp`

The `/webapp` folder contains a React app that enables user functionality and
communicates with the api.

## Hints and troubleshooting

1. `cd` into each module's directory before running commands. They won't work
    the same from the project root.
