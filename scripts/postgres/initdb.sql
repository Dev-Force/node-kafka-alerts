CREATE TABLE users (
    id serial PRIMARY KEY,
    uuid UUID,
    email VARCHAR(255),
    phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notification_events (
    id serial PRIMARY KEY,
    notification_uuid UUID,
    group_id UUID,
    user_id INTEGER,
    message_payload TEXT,
    channel VARCHAR(50),
    template VARCHAR(255),
    subject VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user
      FOREIGN KEY(user_id) 
      REFERENCES user_settings(id),

    UNIQUE(notification_uuid)
);
