export function RatingsRow({ rating, onEditRating }) {
  return (
    <tr>
      <td>{rating.name}</td>
      <td className="center-content">{rating.ageRequirement ?? "N/A"}</td>
    </tr>
  );
}
