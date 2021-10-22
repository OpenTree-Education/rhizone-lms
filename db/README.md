# Rhizone LMS Database

## Getting Started

1. Install MySQL.
2. Create a dev user.
3. Create a development database.
4. Install Flyway.
   1. bash: `docker pull flyway/flyway`
5. Run migrations.
   1. bash: `docker run --rm -v $(pwd):/flyway/sql flyway/flyway -url=jdbc:mysql://dev:dev@host.docker.internal:3306/rhizone_lms_development migrate`
