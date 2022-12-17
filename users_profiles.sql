DROP TABLE IF EXISTS users_profiles;

CREATE TABLE users_profiles(
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    age TEXT,
    city TEXT,
    url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);