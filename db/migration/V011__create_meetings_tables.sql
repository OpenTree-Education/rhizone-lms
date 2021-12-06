CREATE TABLE meetings (
  id BIGINT NOT NULL AUTO_INCREMENT,
  starts_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE participants (
  id BIGINT NOT NULL AUTO_INCREMENT,
  meeting_id BIGINT NOT NULL,
  principal_id BIGINT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX participants_meeting_id (meeting_id),
  FOREIGN KEY (meeting_id) REFERENCES meetings(id),
  INDEX participants_principal_id (principal_id),
  FOREIGN KEY (principal_id) REFERENCES principals(id),
  UNIQUE (meeting_id, principal_id)
);

CREATE TABLE meeting_notes (
  id BIGINT NOT NULL AUTO_INCREMENT,
  note_text TEXT NOT NULL,
  sort_order DOUBLE NOT NULL DEFAULT 0,
  authoring_participant_id BIGINT NOT NULL,
  agenda_owning_participant_id BIGINT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX meeting_notes_authoring_participant_id (authoring_participant_id),
  FOREIGN KEY (authoring_participant_id) REFERENCES participants(id),
  INDEX meeting_notes_agenda_owning_participant_id (agenda_owning_participant_id),
  FOREIGN KEY (agenda_owning_participant_id) REFERENCES participants(id)
);
