import {
  GetAllGenres,
  GetLikeGenres,
  DeleteGenre,
  CreateGenre,
  GetGamesByGenreId,
  DeleteVideoGameGenreRelation,
  CreateVideoGameGenreRelation,
  GetVideoGames,
  RentVideoGame,
  ReturnVideoGame,
  GetRentals,
  CreateVideoGame,
  GetRatings,
  CreateRating,
  GetCustomers,
  CreateCustomer,
  GetVideoGamesWithoutGenre,
  UpdateCustomer,
} from "./DbAccessor.js";
import express from "express";
import cors from "cors";

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Genres
app.get("/genres", async (req, res) => {
  res.send(await GetAllGenres());
});

app.get("/searchGenres", async (req, res) => {
  res.send(await GetLikeGenres(req.query.searchTerm));
});

app.get("/gamesByGenreId", async (req, res) => {
  const parsedId = parseInt(req.query.genreId, 10);
  if (isNaN(parsedId)) {
    res.status(400).send("Failed to parse genreId.");
    return;
  }

  res.send(await GetGamesByGenreId(parsedId));
});

app.delete("/deleteVideoGameGenre", async (req, res) => {
  const { genreId, videoGameId } = req.body;
  const parsedGenreId = parseInt(genreId, 10);
  const parsedVideoGameId = parseInt(videoGameId, 10);
  if (isNaN(parsedGenreId) || isNaN(parsedVideoGameId)) {
    res.status(400).send("Failed to parse genreId or videoGameId.");
    return;
  }

  res.send(
    await DeleteVideoGameGenreRelation(parsedGenreId, parsedVideoGameId)
  );
});

app.post("/createVideoGameGenre", async (req, res) => {
  const { videoGameId, genreId } = req.body;
  const parsedVideoGameId = parseInt(videoGameId, 10);
  const parsedGenreId = parseInt(genreId, 10);
  if (isNaN(parsedVideoGameId) || isNaN(parsedGenreId)) {
    res.status(400).send("Failed to parse video gameId or genreId.");
    return;
  }

  try {
    await CreateVideoGameGenreRelation(parsedVideoGameId, parsedGenreId);
    res.send();
  } catch (error) {
    res.status(400).send(error);
  }
});

app.delete("/genre/:genreId", async (req, res) => {
  const parsedId = parseInt(req.params.genreId, 10);
  if (isNaN(parsedId)) {
    res.status(400).send("Failed to parse genreId.");
    return;
  }
  await DeleteGenre(req.params.genreId);
  res.send();
});

app.post("/genre", async (req, res) => {
  res.send(await CreateGenre(req.body.name));
});

// Video Games
app.get("/videoGames", async (req, res) => {
  res.send(await GetVideoGames());
});

app.put("/videoGames/:videoGameId/rent", async (req, res) => {
  const parsedId = parseInt(req.params.videoGameId, 10);
  const customerEmail = parseInt(req.body.customerId, 10);
  if (isNaN(parsedId) || isNaN(customerEmail)) {
    res.status(400).send("Failed to parse videoGameId or customer email.");
    return;
  }

  try {
    res.send(await RentVideoGame(parsedId, customerEmail));
  } catch (error) {
    res.status(400).send(error);
  }
});

app.put("/videoGames/:videoGameId/return", async (req, res) => {
  const parsedId = parseInt(req.params.videoGameId, 10);
  if (isNaN(parsedId)) {
    res.status(400).send("Failed to parse videoGameId.");
    return;
  }

  try {
    await ReturnVideoGame(parsedId);
    res.send();
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post("/videoGames", async (req, res) => {
  try {
    res.send(JSON.stringify(await CreateVideoGame(req.body)));
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post("/videoGamesWithoutGenre", async (req, res) => {
  const parsedId = parseInt(req.body.genreId, 10);
  if (isNaN(parsedId)) {
    res.status(400).send("Failed to parse genreId.");
    return;
  }

  res.send(await GetVideoGamesWithoutGenre(parsedId));
});

// Rentals
app.get("/rentals", async (req, res) => {
  res.send(await GetRentals());
});

// Rating
app.get("/ratings", async (req, res) => {
  res.send(await GetRatings());
});

app.post("/ratings", async(req, res) => {
  
  try {
    res.send(JSON.stringify(await CreateRating(req.body)));
  } catch (error) {
    res.status(400).send(error);
  }
});

// Customers
app.get("/customers", async (req, res) => {
  res.send(await GetCustomers());
});

app.put("/customers/:customerId", async (req, res) => {
  const parsedId = parseInt(req.params.customerId, 10);
  if (isNaN(parsedId)) {
    res.status(400).send("Failed to parse customerId.");
    return;
  }
  try {
    await UpdateCustomer(parsedId, req.body);
    res.send();
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post("/customers", async (req, res) => {
  try {
    res.send(JSON.stringify(await CreateCustomer(req.body)));
  } catch (error) {
    res.status(400).send(error);
  }
});

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
