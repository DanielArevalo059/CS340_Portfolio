import { RentalsRow } from "./RentalsRow";

export function RentalsTable({ rentals, onEditRental }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Customer Name</th>
          <th>Customer Email</th>
          <th>Due Date</th>
        </tr>
      </thead>
      <tbody>
        {rentals.map((rental) => (
          <RentalsRow
            rental={rental}
            key={rental.rentalId}
          />
        ))}
      </tbody>
    </table>
  );
}