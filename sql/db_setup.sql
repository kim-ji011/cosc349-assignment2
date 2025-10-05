-- create user
DROP USER IF EXISTS 'cosc349';
CREATE USER 'cosc349' IDENTIFIED BY 'password';

GRANT ALL ON *.* TO 'cosc349' WITH GRANT OPTION;

-- Drop and create database
DROP DATABASE IF EXISTS birds_db;

CREATE DATABASE birds_db;

USE birds_db;

-- Drop tables if they exist
DROP TABLE IF EXISTS Photos;

DROP TABLE IF EXISTS Bird;

DROP TABLE IF EXISTS ConservationStatus;

-- Create tables
CREATE TABLE ConservationStatus (
    status_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    status_name VARCHAR(255) NOT NULL,
    status_colour CHAR(7) NOT NULL
);

CREATE TABLE Bird (
    bird_id INT AUTO_INCREMENT PRIMARY KEY,
    primary_name VARCHAR(50) NOT NULL,
    english_name VARCHAR(50),
    scientific_name VARCHAR(50),
    order_name VARCHAR(50),
    family VARCHAR(50),
    weight NUMERIC(10, 0),
    length NUMERIC(10, 0),
    status_id INT NOT NULL,
    FOREIGN KEY (status_id) REFERENCES ConservationStatus(status_id)
);

CREATE TABLE Photos (
    bird_id INT NOT NULL,
    filename VARCHAR(255),
    photographer VARCHAR(50),
    PRIMARY KEY (bird_id),
    FOREIGN KEY (bird_id) REFERENCES Bird(bird_id)
);

ALTER TABLE
    Bird AUTO_INCREMENT = 69;

-- Create user and grant privileges
CREATE USER IF NOT EXISTS 'birduser' @'%' IDENTIFIED BY 'birdpass';

GRANT ALL PRIVILEGES ON birds_db.* TO 'birduser' @'%';

FLUSH PRIVILEGES;