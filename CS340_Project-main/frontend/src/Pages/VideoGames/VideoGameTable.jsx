import { VideoGameRow } from "./VideoGameRow";

export function VideoGamesTable({ videoGames, onRentVideoGame, onReturnVideoGame }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>ESRB Rating</th>
          <th>Genre(s)</th>
          <th>Price</th>
          <th>Rent/Return</th>
        </tr>
      </thead>
      <tbody>
        {videoGames.map((videoGame) => (
          <VideoGameRow
            videoGame={videoGame}
            onRentVideoGame={onRentVideoGame}
            onReturnVideoGame={onReturnVideoGame}
            key={videoGame.videoGameId}
          />
        ))}
      </tbody>
    </table>
  );
}
