CREATE TYPE entity_type AS ENUM ('user', 'service');

ALTER TABLE principals ADD COLUMN entity_type entity_type;
