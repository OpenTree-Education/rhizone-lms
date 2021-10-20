create table principals (
  id bigserial primary key,
  created_at timestamp without time zone not null default current_timestamp,
  updated_at timestamp without time zone not null default current_timestamp
);
