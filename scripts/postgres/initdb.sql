CREATE TABLE users (
    id serial PRIMARY KEY,
    uuid UUID,
    email VARCHAR(255),
    phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(uuid)
);

CREATE TABLE notification_events (
  id SERIAL primary key not null,
  uuid UUID NOT NULL,
  type TEXT NOT NULL,
  body JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
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
