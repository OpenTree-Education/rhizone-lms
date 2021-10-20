# Rhizone LMS Database

## Getting Started

1. Install PostgreSQL.
2. Create a development database.
   1. bash: `psql`
   2. psql: `CREATE DATABASE rhizone_lms_development;`
   3. psql: `\quit`
3. Install Flyway.
   1. bash: `docker pull flyway/flyway`
4. Run migrations.
   1. bash: `docker run --rm -v $(pwd):/flyway/sql flyway/flyway -url=jdbc:postgresql://host.docker.internal:5432/rhizone_lms_development -user=$USER migrate`
