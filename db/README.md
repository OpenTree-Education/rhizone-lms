# `db`

The `db` module contains SQL used by [Flyway](https://flywaydb.org/) to manage
the schema of the database.

## `db/tasks`

The `tasks` directory contains one-off scripts that can be run against the
database for various reasons. They are committed to the repo so that we can
review them before they are run and record a history of tasks run against the
production database.
