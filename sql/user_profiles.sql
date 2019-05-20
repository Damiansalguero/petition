DROP TABLE IF EXISTS user_profiles;
CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    age INT,
    city VARCHAR(255),
    homepage VARCHAR(255),
    user_id INTEGER NOT NULL REFERENCES users(id) UNIQUE
);
