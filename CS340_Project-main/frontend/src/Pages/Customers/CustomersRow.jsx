import Button from "react-bootstrap/Button";

export function CustomersRow({ customer, onEditCustomer }) {
  return (
    <tr>
      <td>{customer.name}</td>
      <td className="center-content">{customer.email}</td>
      <td className="center-content">
        {<Button onClick={() => onEditCustomer(customer)}>Edit</Button>}
      </td>
    </tr>
  );
}