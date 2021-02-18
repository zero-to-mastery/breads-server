ALTER TABLE reading_tags DROP FOREIGN KEY reading_tags_ibfk_1;
ALTER TABLE reading_tags DROP FOREIGN KEY reading_tags_ibfk_2;
ALTER TABLE reading_tags DROP FOREIGN KEY reading_tags_ibfk_3;
DROP TABLE IF EXISTS reading_tags;

ALTER TABLE favorites DROP FOREIGN KEY favorites_ibfk_1;
ALTER TABLE favorites DROP FOREIGN KEY favorites_ibfk_2;
DROP TABLE IF EXISTS favorites;

ALTER TABLE subscriptions DROP FOREIGN KEY subscriptions_ibfk_1;
ALTER TABLE subscriptions DROP FOREIGN KEY subscriptions_ibfk_2;
DROP TABLE IF EXISTS subscriptions;

DROP TABLE IF EXISTS tags;

ALTER TABLE readings DROP FOREIGN KEY readings_ibfk_1;
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
    url VARCHAR(255) UNIQUE NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY(user_id) REFERENCES users(id)
);

ALTER TABLE readings DROP INDEX url;
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
    FOREIGN KEY(publisher_id) REFERENCES users(id),
    PRIMARY KEY(subscriber_id, publisher_id)
);

ALTER TABLE subscriptions ADD COLUMN isNew INT DEFAULT 1 AFTER created_at;

-- FAVORITES
CREATE TABLE favorites (
    user_id INTEGER NOT NULL,
    reading_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(reading_id) REFERENCES readings(id),
    PRIMARY KEY(user_id, reading_id)
);

-- READING TAGS
CREATE TABLE reading_tags (
    reading_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    FOREIGN KEY(reading_id) REFERENCES readings(id),
    FOREIGN KEY(tag_id) REFERENCES tags(id)
);

-- USER READINGS
CREATE TABLE user_readings (
    user_id integer NOT NULL,
    reading_id integer NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(reading_id) REFERENCES readings(id)
)

-- USER TAGS
CREATE TABLE user_tags (
    user_id integer NOT NULL,
    tag_id integer NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(tag_id) REFERENCES tags(id)
)