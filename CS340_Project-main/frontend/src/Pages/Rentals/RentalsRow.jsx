export function RentalsRow({ rental }) {
  return (
    <tr>
      <td>{rental.title}</td>
      <td>{rental.customerName}</td>
      <td>{rental.email}</td>
      <td>{(new Date(rental.dueDate)).toLocaleDateString("en-US")}</td>
    </tr>
  );
}
