import { SqlPool } from "./SqlPool.js";

// Genres
export const GetAllGenres = async () =>
  (await SqlPool.query("SELECT genreId, name FROM Genres ORDER BY name;"))[0];

export const GetLikeGenres = async (searchTerm) =>
  (
    await SqlPool.query(
      `SELECT genreId, name FROM Genres
        WHERE name LIKE CONCAT('%', ?, '%')`,
      [searchTerm]
    )
  )[0];

export const GetGamesByGenreId = async (genreId) =>
  (
    await SqlPool.query(
      `SELECT vg.videoGameId, vg.title FROM VideoGames vg INNER JOIN VideoGamesGenres vgg ON vgg.videoGameId = vg.videoGameId WHERE vgg.genreId = ? ORDER BY vg.title;`,
      [genreId]
    )
  )[0];

export const DeleteGenre = async (genreId) =>
  await SqlPool.query(
    `DELETE FROM Genres
     WHERE genreId = ?;`,
    [genreId]
  );

export const CreateGenre = async (genreName) => {
  const genreId = (
    await SqlPool.query(
      "INSERT INTO Genres (name) VALUES (?); SELECT LAST_INSERT_ID() AS genreId;",
      [genreName]
    )
  )[0][1][0].genreId;
  return { genreId, name: genreName };
};

export const DeleteVideoGameGenreRelation = async (genreId, videoGameId) => {
  await SqlPool.execute(
    "DELETE FROM VideoGamesGenres WHERE genreId = ? AND videoGameId = ?;",
    [genreId, videoGameId]
  );
};

export const CreateVideoGameGenreRelation = async (videoGameId, genreId) => {
  await SqlPool.execute(
    "INSERT INTO VideoGamesGenres (videoGameId, genreId) VALUES (?, ?);",
    [videoGameId, genreId]
  );
  return videoGameId;
};

// VideoGames
export const GetVideoGames = async () => {
  const videoGames = (
    await SqlPool.query(`SELECT
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
                        ORDER BY vg.title;`)
  )[0];

  return videoGames.map((r) => ({
    ...r,
    isCheckedOut: convertBufferToBool(r.isCheckedOut),
  }));
};

export const RentVideoGame = async (videoGameId, customerId) => {
  await SqlPool.query(
    `INSERT INTO Rentals (videoGameId, customerId, dueDate) VALUES (?, ?, UTC_TIMESTAMP() + INTERVAL 14 DAY);
    UPDATE VideoGames SET isCheckedOut = 1 WHERE videoGameId = ?;`,
    [videoGameId, customerId, videoGameId]
  );
};

export const ReturnVideoGame = async (videoGameId) => {
  const rowsChanged = (
    await SqlPool.execute(
      "UPDATE VideoGames SET isCheckedOut = 0 WHERE videoGameId = ?;",
      [videoGameId]
    )
  )[0]?.changedRows;
  if (!rowsChanged) throw "An error occurred, no data was updated.";
};

export const CreateVideoGame = async ({ title, ratingId, price }) => {
  const ratingAsNumber = ratingId ? parseInt(ratingId, 10) : ratingId;
  const priceAsFloat = parseFloat(price);
  if (isNaN(priceAsFloat) || isNaN(ratingAsNumber))
    throw "Failed to parse price or ratingId.";

  return (
    await SqlPool.query(
      `INSERT INTO VideoGames(title, ratingId, price)
      VALUES (?, ?, ?); SELECT LAST_INSERT_ID() AS videoGameId;`,
      [title, ratingAsNumber, priceAsFloat]
    )
  )[0][1][0].videoGameId;
};

export const GetVideoGamesWithoutGenre = async (genreId) => {
  return (
    await SqlPool.query(
      `SELECT
        vg.videoGameId,
        vg.title
      FROM VideoGames vg 
      LEFT JOIN VideoGamesGenres vgg
          ON vgg.videoGameId = vg.videoGameId AND vgg.genreId = ?
      WHERE vgg.genreId IS NULL
      ORDER BY vg.title;
      `,
      [genreId]
    )
  )[0];
};

// Rentals
export const GetRentals = async () =>
  (
    await SqlPool.query(`SELECT
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
                          ORDER BY r.dueDate DESC;`)
  )[0];

// Ratings
export const GetRatings = async () =>
  (
    await SqlPool.query("SELECT ratingId, name, ageRequirement FROM Ratings;")
  )[0];

export const CreateRating = async ({ name, age }) => {
  const parsedAge = age ? parseInt(age, 10) : age;
  if (isNaN(parsedAge)) throw "Failed to parse age into a number.";

  return (
    await SqlPool.query(
      `INSERT INTO Ratings(name, ageRequirement)
    VALUES (?, ?); SELECT LAST_INSERT_ID() AS ratingId;`,
      [name, parsedAge]
    )
  )[0][1][0]?.ratingId;
};

// Customers
export const GetCustomers = async () =>
  (await SqlPool.query("SELECT customerId, name, email FROM Customers;"))[0];

export const CreateCustomer = async ({ name, email }) => {
  return (
    await SqlPool.query(
      `INSERT INTO Customers(name, email)
      VALUES (?, ?); SELECT LAST_INSERT_ID() AS customerId;`,
      [name, email]
    )
  )[0][1][0].customerId;
};

export const UpdateCustomer = async (customerId, { name, email }) => {
  const rowsChanged = (
    await SqlPool.query(
      "UPDATE Customers SET name = ?, email = ? WHERE customerId = ?;",
      [name, email, customerId]
    )
  )[0]?.changedRows;
  if (!rowsChanged) throw "An error occurred, no data was updated.";
};

const convertBufferToBool = (value) => {
  return !!Buffer.from(value).readInt8();
};
