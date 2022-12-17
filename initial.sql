DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    first VARCHAR(255) NOT NULL,
    last VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS signatures;

CREATE TABLE signatures(
           id SERIAL PRIMARY KEY,
           signature TEXT NOT NULL,
           user_id INTEGER NOT NULL REFERENCES users(id),
           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS users_profiles;

CREATE TABLE users_profiles(
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    age TEXT,
    city TEXT,
    url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);