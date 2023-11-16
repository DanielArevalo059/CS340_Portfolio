import Button from "react-bootstrap/Button";

export function VideoGameRow({
  videoGame,
  onRentVideoGame,
  onReturnVideoGame,
}) {
  const { functionToCall, buttonText, buttonColor } = videoGame.isCheckedOut
    ? { functionToCall: onReturnVideoGame, buttonText: "Return", buttonColor: "success" }
    : { functionToCall: onRentVideoGame, buttonText: "Rent", buttonColor: "primary" };

  return (
    <tr>
      <td>{videoGame.title}</td>
      <td className="center-content">{videoGame.rating ?? "N/A"}</td>
      <td className="center-content">{videoGame.genres ?? "-"}</td>
      <td>${videoGame.price}</td>
      <td className="center-content">
        <Button
          onClick={() => functionToCall(videoGame)}
          variant={buttonColor}
        >
          {buttonText}
        </Button>
      </td>
    </tr>
  );
}
