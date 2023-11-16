-- Group: 27
-- Chris Coley and Daniel Arevalo

-- NOTE: All variables from the backend are denoted by a preceding ":".

-- Customer Table
    -- Select all Customers
        SELECT customerId, name, email FROM Customers;

    -- Insert new customer
        INSERT INTO Customers (name, email)
            VALUES (:name, :email);
        SELECT LAST_INSERT_ID() AS customerId;
    
    -- Update customer
        UPDATE Customers
            SET name = :name, email = :email
        WHERE customerId = :customerId;
    
    -- Do not allow Deletion of customers because we need it for historical data.

-- Rentals Table
    -- Select all Rentals with properties
        SELECT
            r.rentalId,
            vg.title,
            c.name AS customerName,
            c.email,
            r.dueDate
        FROM Rentals r
            INNER JOIN VideoGames vg
                ON vg.videoGameId = r.videoGameId
            INNER JOIN Customers c 
                ON c.customerId = r.customerId
        ORDER BY r.dueDate DESC;

    -- Insert new rental and update video game to checked out.
        INSERT INTO Rentals (videoGameId, customerId, dueDate) VALUES (:videoGameId, :customerId, UTC_TIMESTAMP() + INTERVAL 14 DAY);
        UPDATE VideoGames SET isCheckedOut = 1 WHERE videoGameId = :videoGameId;
    
    -- Do not allow updates to rentals for data integrity.
    -- Do not allow deletion of rentals to keep records.

-- Video Games Table
    -- Select all VideoGames with properties
        SELECT
            vg.videoGameId,
            vg.title,
            r.name AS rating,
            GROUP_CONCAT(g.name SEPARATOR ', ') AS genres,
            vg.price,
            vg.isCheckedOut
        FROM VideoGames vg
            LEFT OUTER JOIN Ratings r
                ON r.ratingId = vg.ratingId
            LEFT OUTER JOIN VideoGamesGenres vgg
                ON vgg.videoGameId = vg.videoGameId
            LEFT OUTER JOIN Genres g
                ON g.genreId = vgg.genreId
        GROUP BY vg.videoGameId
        ORDER BY vg.title;

    -- Select all videoGames without a specific genre
        SELECT
            vg.videoGameId,
            vg.title
        FROM VideoGames vg 
        LEFT JOIN VideoGamesGenres vgg
            ON vgg.videoGameId = vg.videoGameId AND vgg.genreId = :genreId
        WHERE vgg.genreId IS NULL
        ORDER BY vg.title;

    -- Insert new video game and return new videoGameId
        INSERT INTO VideoGames(title, ratingId, price)
        VALUES (:title, :ratingId, :price);
        SELECT LAST_INSERT_ID() AS videoGameId;

    -- Return video game
        UPDATE VideoGames SET isCheckedOut = 0 WHERE videoGameId = :videoGameId; 

    -- Update video game is not currently implemented.
    -- Do not allow deletion of video games for records.

-- VideoGameGenre Table
    -- Insert new video game genre
        INSERT INTO VideoGamesGenres(videoGameId, genreId)
        VALUES (:videoGameId, :genreId);

    -- Delete video game genre
        DELETE FROM VideoGamesGenres
        WHERE videoGameId = :videoGameId AND genreId = :genreId;

-- Ratings Table
    -- Select all ratings
        SELECT ratingId, name, ageRequirement FROM Ratings;

    -- Insert new rating and return the new ratingId.
        INSERT INTO Ratings (name, ageRequirement)
        VALUES (:name, :ageRequirement);
        SELECT LAST_INSERT_ID() AS ratingId;

    -- Do not allow ratings to be updated.
        
    -- Do not allow ratings to be deleted.

-- Genres Table
    -- Read all genres
        SELECT genreId, name FROM Genres;

    -- Read all genres like input
        SELECT genreId, name FROM Genres
        WHERE name LIKE CONCAT('%', :name, '%');

    -- Insert genre
        INSERT INTO Genres (name)
        VALUES (:name);
    
    -- Delete genre
        DELETE FROM Genres
        WHERE genreId = :genreId;