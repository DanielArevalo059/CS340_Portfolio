-- Group 27
-- Members: Chris Coley and Daniel Arevalo

-- Disable foreign checks for importing
SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

-- Drop table if they exist
DROP TABLE IF EXISTS VideoGames;
DROP TABLE IF EXISTS Genres;
DROP TABLE IF EXISTS VideoGamesGenres;
DROP TABLE IF EXISTS Ratings;
DROP TABLE IF EXISTS Rentals;
DROP TABLE IF EXISTS Customers;

-- Create tables
CREATE TABLE VideoGames (
    videoGameId TINYINT NOT NULL AUTO_INCREMENT,
    title VARCHAR(50) NOT NULL,
    ratingId TINYINT NULL,
    price DECIMAL(4,2) NOT NULL,
    isCheckedOut BIT NOT NULL DEFAULT 0,
    PRIMARY KEY (videoGameId),
    FOREIGN KEY (ratingId) REFERENCES Ratings(ratingId)
);

CREATE TABLE Genres (
    genreId TINYINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (genreId),
    CONSTRAINT UNIQUE (name)
);

CREATE TABLE VideoGamesGenres (
    videoGameId TINYINT NOT NULL,
    genreId TINYINT NOT NULL,
    PRIMARY KEY (videoGameId, genreId),
    FOREIGN KEY (videoGameId) REFERENCES VideoGames(videoGameId),
    FOREIGN KEY (genreId) REFERENCES Genres(genreId) ON DELETE CASCADE
);

CREATE TABLE Ratings (
    ratingId TINYINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(4) NOT NULL,
    ageRequirement TINYINT NULL,
    PRIMARY KEY (ratingId),
    CONSTRAINT UNIQUE (name)
);

CREATE TABLE Rentals (
    rentalId INT NOT NULL AUTO_INCREMENT,
    videoGameId TINYINT NOT NULL,
    customerId TINYINT NOT NULL,
    dueDate DATE NOT NULL,
    PRIMARY KEY (rentalId),
    FOREIGN KEY (videoGameId) REFERENCES VideoGames(videoGameId),
    FOREIGN KEY (customerId) REFERENCES Customers(customerId)
);

CREATE TABLE Customers (
    customerId TINYINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    PRIMARY KEY (customerId),
    CONSTRAINT UNIQUE (email)
);

-- Insert data
INSERT INTO Customers (name, email)
VALUES ('Chris', 'Chris@gmail.com'),
       ('Daniel', 'Daniel@gmail.com'),
       ('Dwight', 'Dwight@gmail.com'),
       ('Michael', 'Michael@gmail.com'),
       ('Pam', 'Pam@gmail.com');

INSERT INTO Ratings (name, ageRequirement)
VALUES ('E', NULL),
       ('E10', 10),
       ('T', 13),
       ('M', 17),
       ('AO', 18),
       ('RP', NULL),
       ('RPLM', 17);

INSERT INTO Genres (name)
VALUES ('Action'),
       ('Adventure'),
       ('Horror'),
       ('Puzzle'),
       ('Survival');

INSERT INTO VideoGames (title, ratingId, price, isCheckedOut)
VALUES ('Call of Duty', 4, 8.50, 0), -- 4 is M, is not checked out
       ('ARK: Survival Evolved', 3, 10, 1), -- 3 is T, is checked out
       ('Portal 2', 2 , 4.75, 0), -- 2 is E10, is not checked out
       ('Stardew Valley', 2, 3, 0), -- 2 is E10, is not checked out
       ('Cities: Skylines II', NULL, 12, 1); -- no rating. is checked out

INSERT INTO VideoGamesGenres (videoGameId, genreId)
VALUES (1,1), -- Call of Duty is Action
       (2, 1), -- ARK is Action
       (2,2), -- ARK is Adventure
       (2,5), -- ARK is Survival
       (3, 4), -- Portal 2 is Puzzle
       (4, 1), -- Stardew Valley is Action
       (4, 2), -- Stardew Valley is Adventure
       (5, 4); -- Cities is Puzzle

INSERT INTO Rentals (videoGameId, customerId, dueDate) -- Use backend validation to prevent a video game to be rented out when it is already rented.
VALUES (1, 3, '2023-06-19'), -- Call of Duty, Dwight, due date
       (4, 1, '2023-06-25'), -- Stardew Valley, Chris, due date
       (3, 4, '2023-07-01'), -- Portal 2, Michael, due date
       (2, 5, '2023-07-12'), -- ARK, Pam, due date
       (1, 2, '2023-07-18'); -- Call of Duty, Daniel, due date

-- Enable foreign checks
SET FOREIGN_KEY_CHECKS=1;
COMMIT;
