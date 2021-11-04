ALTER TABLE journal_entries 
    ADD COLUMN reflection_id BIGINT,
    ADD INDEX journal_entries_reflection_id (reflection_id),
    ADD FOREIGN KEY (reflection_id) REFERENCES reflections(id);
