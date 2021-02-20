ALTER TABLE reading_tags DROP FOREIGN KEY reading_tags_ibfk_1;
ALTER TABLE reading_tags DROP FOREIGN KEY reading_tags_ibfk_2;
DROP TABLE IF EXISTS reading_tags;

ALTER TABLE favorites DROP FOREIGN KEY favorites_ibfk_1;
ALTER TABLE favorites DROP FOREIGN KEY favorites_ibfk_2;
DROP TABLE IF EXISTS favorites;

ALTER TABLE subscriptions DROP FOREIGN KEY subscriptions_ibfk_1;
ALTER TABLE subscriptions DROP FOREIGN KEY subscriptions_ibfk_2;
DROP TABLE IF EXISTS subscriptions;

ALTER TABLE user_readings DROP FOREIGN KEY user_readings_ibfk_1;
ALTER TABLE user_readings DROP FOREIGN KEY user_readings_ibfk_2;
DROP TABLE IF EXISTS user_readings;

ALTER TABLE user_tags DROP FOREIGN KEY user_tags_ibfk_1;
ALTER TABLE user_tags DROP FOREIGN KEY user_tags_ibfk_2;
DROP TABLE IF EXISTS user_tags;

DROP TABLE IF EXISTS tags;

DROP TABLE IF EXISTS readings;

DROP TABLE IF EXISTS users;

-- USERS
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE users ADD FULLTEXT (first_name, last_name, username);

-- READINGS
CREATE TABLE readings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    domain VARCHAR(255) NOT NULL,
    word_count INT NOT NULL,
    url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE readings ADD COLUMN description varchar(500) AFTER domain;
ALTER TABLE readings ADD COLUMN image varchar(255) AFTER description;
ALTER TABLE readings MODIFY image varchar(500);

-- TAGS
CREATE TABLE tags (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  tag_name VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE tags ADD COLUMN count INTEGER DEFAULT 1;

-- SUBSCRIPTIONS
CREATE TABLE subscriptions (
    subscriber_id INT NOT NULL,
    publisher_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY(subscriber_id) REFERENCES users(id),
    FOREIGN KEY(publisher_id) REFERENCES users(id)
);

ALTER TABLE subscriptions ADD COLUMN isNew INT DEFAULT 1 AFTER created_at;

-- FAVORITES
CREATE TABLE favorites (
    user_id INT NOT NULL,
    reading_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(reading_id) REFERENCES readings(id)
);

-- READING TAGS
CREATE TABLE reading_tags (
    reading_id INT NOT NULL,
    tag_id INT NOT NULL,
    FOREIGN KEY(reading_id) REFERENCES readings(id),
    FOREIGN KEY(tag_id) REFERENCES tags(id)
);

-- USER READINGS
CREATE TABLE user_readings (
    user_id INT NOT NULL,
    reading_id INT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(reading_id) REFERENCES readings(id)
);

-- USER TAGS
CREATE TABLE user_tags (
    user_id INT NOT NULL,
    tag_id INT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(tag_id) REFERENCES tags(id)
);