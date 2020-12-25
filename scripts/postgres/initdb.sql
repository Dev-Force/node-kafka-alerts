CREATE TABLE users (
    id serial PRIMARY KEY,
    uuid UUID NOT NULL,
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

CREATE INDEX events_aggregate_uuid_idx ON events(aggregate_uuid);

CREATE TABLE time_windows (
  id SERIAL primary key not null,
  uuid UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(uuid)
);

CREATE TABLE notifications (
    id serial PRIMARY KEY,
    uuid UUID NOT NULL,
    user_uuid UUID NOT NULL,
    message_payload TEXT,
    channel VARCHAR(50) NOT NULL,
    template VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    status TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_uuid
      FOREIGN KEY(user_uuid) 
      REFERENCES users(uuid),

    UNIQUE(uuid)
);


CREATE TABLE notification_time_windows (
  id serial PRIMARY KEY,

  user_uuid UUID NOT NULL,
  notification_uuid UUID NOT NULL,	
  time_window_uuid UUID NOT NULL,	
  unique_group_identifiers JSONB NOT NULL,	

  UNIQUE(unique_group_identifiers, user_uuid, time_window_uuid),	

  CONSTRAINT fk_notification_uuid	
    FOREIGN KEY(notification_uuid) 	
    REFERENCES notifications(uuid),	

  CONSTRAINT fk_time_window_uuid	
    FOREIGN KEY(time_window_uuid) 	
    REFERENCES time_windows(uuid),

  CONSTRAINT fk_user_uuid	
    FOREIGN KEY(user_uuid) 	
    REFERENCES users(uuid)	
); 

INSERT INTO time_windows (uuid) VALUES ('70d0a457-869c-4d22-a3ea-d75ed3404dbb');
INSERT INTO users (uuid, email, phone) VALUES ('70d0a457-869c-4d22-a3ea-d75ed3404dbb', 'test@example.com', 'example_phone');
