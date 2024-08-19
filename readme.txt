# CS340_Project

## To start the frontend:
* CD to the frontend folder.
* Execute `npm i` to install dependencies.
* Execute `npm run dev` to start the frontend and click on the console URL to go to the site.
Reference: https://vitejs.dev/guide/

## To start the backend:
* CD to the backend folder.
* Execute `npm i` to install dependencies.
* Execute `node app.js` to start the backend.
Reference: https://expressjs.com/en/starter/hello-world.html


# Checkers Game

This repository contains a Python implementation of a modified Checkers game, designed for two players. The game follows traditional Checkers rules with some variations, allowing for unique gameplay mechanics like king and triple king promotions.

## Game Overview

The `Checkers` class manages the overall game state, including the board and players. It provides methods for creating players, making moves, checking the status of pieces on the board, and determining the winner.

### Checkers Class

The `Checkers` class represents the game itself. It manages the board, players, and game rules. Here are the key methods:

- **`create_player(player_name, piece_color)`**:
  - Creates a player with a specified name and checker piece color ("Black" or "White").
  - Returns the created `Player` object.

- **`play_game(player_name, starting_square_location, destination_square_location)`**:
  - Moves a piece on the board from the starting square to the destination square.
  - Raises exceptions for invalid moves, such as `OutofTurn`, `InvalidSquare`, or `InvalidPlayer`.
  - Returns the number of captured pieces, or `0` if no pieces were captured.

- **`get_checker_details(square_location)`**:
  - Returns the details of the checker piece at the specified square location.
  - Raises an `InvalidSquare` exception if the location is invalid.
  - Possible return values: `"Black"`, `"White"`, `"Black_king"`, `"White_king"`, `"Black_Triple_King"`, `"White_Triple_King"`, or `None` if no piece is present.

- **`print_board()`**:
  - Prints the current state of the board as an array.

