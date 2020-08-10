CREATE TABLE vehicle_events(
    id serial PRIMARY KEY,
	aggregate_id VARCHAR(50),
    aggregate_version INTEGER,
    event_type VARCHAR(50),
    payload jsonb,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (aggregate_id, aggregate_version)
);
