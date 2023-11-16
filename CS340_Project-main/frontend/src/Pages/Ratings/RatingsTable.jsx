import { RatingsRow } from "./RatingsRow";

export function RatingsTable({ ratings }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Age Requirement</th>
        </tr>
      </thead>
      <tbody>
        {ratings.map((rating) => (
          <RatingsRow
            rating={rating}
            key={rating.ratingId}
          />
        ))}
      </tbody>
    </table>
  );
}
