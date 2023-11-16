import Button from "react-bootstrap/esm/Button";

export function GameTitleTable({ videoGames, onVideoGameGenreDelete }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Remove Genre</th>
        </tr>
      </thead>
      <tbody>
        {videoGames.map((videoGame) => (
          <tr key={videoGame.videoGameId}>
            <td>{videoGame.title}</td>
            <td className="center-content">
              <Button variant="secondary" onClick={() => onVideoGameGenreDelete(videoGame.videoGameId)}>
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
