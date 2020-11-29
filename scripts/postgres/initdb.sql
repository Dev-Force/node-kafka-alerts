CREATE TABLE users (
    id serial PRIMARY KEY,
    uuid UUID,
    email VARCHAR(255),
    phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(uuid)
);

CREATE TABLE events (
  id SERIAL primary key not null,
  aggregate_uuid UUID NOT NULL,
  aggregate_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  payload_type TEXT NOT NULL,
  version INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(aggregate_uuid, version)
);

CREATE INDEX aggregate_uuid_idx ON events(aggregate_uuid);

CREATE TABLE time_windows (
  id SERIAL primary key not null,
  uuid UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(uuid)
);

CREATE TABLE notifications (
    id serial PRIMARY KEY,
    uuid UUID,
    user_uuid UUID,
    message_payload TEXT,
    channel VARCHAR(50),
    template VARCHAR(255),
    subject VARCHAR(255),
    status TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_uuid
      FOREIGN KEY(user_uuid) 
      REFERENCES users(uuid),

    UNIQUE(uuid)
);

CREATE TABLE notification_time_windows (
  id serial PRIMARY KEY,
  notification_uuid UUID NOT NULL,
  time_window_uuid UUID NOT NULL,
  unique_group_identifiers JSONB NOT NULL,
  
  UNIQUE(time_window_uuid, unique_group_identifiers),

  CONSTRAINT fk_notification_uuid
    FOREIGN KEY(notification_uuid) 
    REFERENCES notifications(uuid),

  CONSTRAINT fk_time_window_uuid
    FOREIGN KEY(time_window_uuid) 
    REFERENCES time_windows(uuid)
);