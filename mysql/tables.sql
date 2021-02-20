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
  id int(11) NOT NULL AUTO_INCREMENT,
  first_name varchar(255) NOT NULL,
  last_name varchar(255) NOT NULL,
  email varchar(255) NOT NULL,
  username varchar(255) NOT NULL,
  password varchar(255) DEFAULT NULL,
  image varchar(255) DEFAULT NULL,
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY email (email),
  UNIQUE KEY username (username),
  FULLTEXT KEY first_name (first_name,last_name,username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- READINGS
CREATE TABLE readings (
  id int(11) NOT NULL AUTO_INCREMENT,
  title varchar(255) NOT NULL,
  domain varchar(255) NOT NULL,
  description varchar(500) DEFAULT NULL,
  image varchar(500) DEFAULT NULL,
  word_count int(11) NOT NULL,
  url varchar(255) NOT NULL,
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- TAGS
CREATE TABLE tags (
  id int(11) NOT NULL AUTO_INCREMENT,
  tag_name varchar(255) DEFAULT NULL,
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  count int(11) DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY tag_name (tag_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- SUBSCRIPTIONS
CREATE TABLE subscriptions (
  subscriber_id int(11) NOT NULL,
  publisher_id int(11) NOT NULL,
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  isNew int(11) DEFAULT 1,
  PRIMARY KEY (subscriber_id,publisher_id),
  KEY publisher_id (publisher_id),
  CONSTRAINT subscriptions_ibfk_1 FOREIGN KEY (subscriber_id) REFERENCES users (id),
  CONSTRAINT subscriptions_ibfk_2 FOREIGN KEY (publisher_id) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- FAVORITES
CREATE TABLE favorites (
  user_id int(11) NOT NULL,
  reading_id int(11) NOT NULL,
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id,reading_id),
  KEY reading_id (reading_id),
  CONSTRAINT favorites_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (id),
  CONSTRAINT favorites_ibfk_2 FOREIGN KEY (reading_id) REFERENCES readings (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- READING TAGS
CREATE TABLE reading_tags (
  reading_id int(11) NOT NULL,
  tag_id int(11) NOT NULL,
  PRIMARY KEY (reading_id,tag_id),
  KEY tag_id (tag_id),
  CONSTRAINT reading_tags_ibfk_1 FOREIGN KEY (reading_id) REFERENCES readings (id),
  CONSTRAINT reading_tags_ibfk_2 FOREIGN KEY (tag_id) REFERENCES tags (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- USER READINGS
CREATE TABLE user_readings (
  user_id int(11) NOT NULL,
  reading_id int(11) NOT NULL,
  KEY user_id (user_id),
  KEY reading_id (reading_id),
  CONSTRAINT user_readings_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (id),
  CONSTRAINT user_readings_ibfk_2 FOREIGN KEY (reading_id) REFERENCES readings (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- USER TAGS
CREATE TABLE user_tags (
  user_id int(11) NOT NULL,
  tag_id int(11) NOT NULL,
  KEY user_id (user_id),
  KEY tag_id (tag_id),
  CONSTRAINT user_tags_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (id),
  CONSTRAINT user_tags_ibfk_2 FOREIGN KEY (tag_id) REFERENCES tags (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;