import { CustomersRow } from "./CustomersRow";
import Button from "react-bootstrap/Button";


export function CustomersTable({ customers, onEditCustomer }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Edit</th>
        </tr>
      </thead>
      <tbody>
        {customers.map((customer) => (
          <CustomersRow
            customer={customer}
            onEditCustomer={onEditCustomer}
            key={customer.customerId}
          />
        ))}
      </tbody>
    </table>
  );
}