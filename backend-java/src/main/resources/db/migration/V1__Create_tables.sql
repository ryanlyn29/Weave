-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT RANDOM_UUID(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    avatar VARCHAR(500),
    voice_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    firebase_uid VARCHAR(255) UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Groups table
CREATE TABLE groups (
    id UUID PRIMARY KEY DEFAULT RANDOM_UUID(),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Group members table
CREATE TABLE group_members (
    id UUID PRIMARY KEY DEFAULT RANDOM_UUID(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'MEMBER',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(group_id, user_id)
);

-- Threads table
CREATE TABLE threads (
    id UUID PRIMARY KEY DEFAULT RANDOM_UUID(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    title VARCHAR(500),
    last_activity TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    unread_count INTEGER NOT NULL DEFAULT 0,
    importance_score DOUBLE NOT NULL DEFAULT 0.0,
    ml_summary TEXT,
    unresolved_count INTEGER NOT NULL DEFAULT 0,
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Thread participants table
CREATE TABLE thread_participants (
    id UUID PRIMARY KEY DEFAULT RANDOM_UUID(),
    thread_id UUID NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(thread_id, user_id)
);

-- Messages table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT RANDOM_UUID(),
    thread_id UUID NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    audio_url VARCHAR(500),
    waveform JSON,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT NOT NULL DEFAULT 0
);

-- Message-Entity join table
CREATE TABLE message_entities (
    message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    entity_id UUID NOT NULL,
    PRIMARY KEY (message_id, entity_id)
);

-- Extracted entities table
CREATE TABLE extracted_entities (
    id UUID PRIMARY KEY DEFAULT RANDOM_UUID(),
    type VARCHAR(50) NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'PROPOSED',
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    thread_id UUID NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
    message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    metadata JSON,
    importance_score DOUBLE NOT NULL DEFAULT 0.0,
    voice_summary_url VARCHAR(500),
    last_touched_by_id UUID REFERENCES users(id) ON DELETE SET NULL,
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key for message_entities.entity_id
ALTER TABLE message_entities 
    ADD CONSTRAINT fk_entity_id 
    FOREIGN KEY (entity_id) REFERENCES extracted_entities(id) ON DELETE CASCADE;

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT RANDOM_UUID(),
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    thread_id UUID REFERENCES threads(id) ON DELETE CASCADE,
    entity_id UUID REFERENCES extracted_entities(id) ON DELETE CASCADE,
    read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Activity items table
CREATE TABLE activity_items (
    id UUID PRIMARY KEY DEFAULT RANDOM_UUID(),
    type VARCHAR(50) NOT NULL,
    entity_id UUID REFERENCES extracted_entities(id) ON DELETE SET NULL,
    thread_id UUID NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
    message_id UUID REFERENCES messages(id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    importance DOUBLE NOT NULL DEFAULT 0.0,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_threads_group_id ON threads(group_id);
CREATE INDEX idx_threads_last_activity ON threads(last_activity DESC);
CREATE INDEX idx_messages_thread_id ON messages(thread_id);
CREATE INDEX idx_messages_timestamp ON messages(timestamp);
CREATE INDEX idx_entities_thread_id ON extracted_entities(thread_id);
CREATE INDEX idx_entities_type_status ON extracted_entities(type, status);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read_at ON notifications(read_at);
CREATE INDEX idx_activity_items_thread_id ON activity_items(thread_id);
CREATE INDEX idx_activity_items_timestamp ON activity_items(timestamp DESC);
CREATE INDEX idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX idx_group_members_user_id ON group_members(user_id);
CREATE INDEX idx_thread_participants_user_id ON thread_participants(user_id);
