import { CustomersTable } from "./CustomersTable.jsx";
import { useState, useEffect, useContext } from "react";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Get, Post, Put } from "../../API/RestfulMethods";
import { ToastContext } from "../../Contexts/ToastContext";

export function Customers() {
  const [customers, setCustomers] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(undefined);
  const [updateCustomerName, setUpdateCustomerName] = useState("");
  const [updateCustomerEmail, setUpdateCustomerEmail] = useState("");
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerEmail, setNewCustomerEmail] = useState("");

  const createToast = useContext(ToastContext);

  const handleEditConfirm = async () => {
    try {
      if (!updateCustomerName.trim())
        throw "The name cannot be blank or whitespace.";

      if (!updateCustomerEmail.trim()) throw "Please enter a valid email.";
      await Put(`/customers/${selectedCustomer.customerId}`, {
        name: updateCustomerName,
        email: updateCustomerEmail,
      });
      setCustomers((prev) =>
        prev.map((customer) =>
          customer.customerId === selectedCustomer.customerId
            ? {
                ...customer,
                name: updateCustomerName,
                email: updateCustomerEmail,
              }
            : customer
        )
      );
      createToast.success(`Successfully updated ${selectedCustomer.name}.`);
      handleEditCancel();
    } catch (error) {
      createToast.failure(error);
    }
  };

  const getCustomers = async () => {
    const listOfCustomers = await Get("/customers");
    setCustomers(listOfCustomers);
  };

  const handleCreateCustomer = async () => {
    try {
      if (!newCustomerName.trim())
        throw "The name cannot be blank or whitespace.";

      if (!newCustomerEmail.trim()) throw "Please enter a valid email.";

      const customerIdString = await Post("/customers", {
        name: newCustomerName,
        email: newCustomerEmail,
      });

      const customerId = parseInt(customerIdString, 10);

      if (isNaN(customerId)) throw "Failed to parse response.";

      const newCustomer = {
        customerId,
        name: newCustomerName,
        email: newCustomerEmail,
      };
      setCustomers((prev) =>
        [newCustomer, ...prev].sort((a, b) =>
          a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
        )
      );
      createToast.success(`Successfully created ${newCustomerName}.`);
      handleAddCancel();
    } catch (error) {
      console.log(error);
      createToast.failure(error);
    }
  };

  const handleAddCancel = () => {
    setIsAddModalOpen(false);
    setNewCustomerName("");
    setNewCustomerEmail(undefined);
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    setSelectedCustomer(undefined);
    setUpdateCustomerName("");
    setUpdateCustomerEmail(undefined);
  };

  const handleEditCustomer = (customerToEdit) => {
    setIsEditModalOpen(true);
    setSelectedCustomer(customerToEdit);
  };

  useEffect(() => {
    getCustomers();
  }, []);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingBottom: "20px",
        }}
      >
        <Button
          style={{ display: "flex", justifyContent: "center", width: "25%" }}
          variant="primary"
          onClick={() => setIsAddModalOpen(true)}
        >
          New Customer
        </Button>
      </div>
      <CustomersTable
        customers={customers}
        onEditCustomer={handleEditCustomer}
      />
      <Modal
        show={isEditModalOpen}
        onHide={handleEditCancel}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit {selectedCustomer?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <small>Name</small>
          <Form.Control
            type="text"
            onChange={(e) =>
              setUpdateCustomerName(e.currentTarget.value)
            }
            defaultValue={selectedCustomer?.name}
            style={{ marginBottom: "10px" }}
          />
          <small>Email</small>
          <Form.Control
            type="text"
            onChange={(e) =>
              setUpdateCustomerEmail(e.currentTarget.value)
            }
            defaultValue={selectedCustomer?.email}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleEditCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditConfirm}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={isAddModalOpen}
        onHide={handleAddCancel}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>New Customer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <small>Name</small>
          <Form.Control
            type="text"
            onChange={(e) => setNewCustomerName(e.currentTarget.value.trim())}
            placeholder="Enter name..."
            style={{ marginBottom: "10px" }}
          />
          <small>Email</small>
          <Form.Control
            type="text"
            onChange={(e) => setNewCustomerEmail(e.currentTarget.value.trim())}
            placeholder="Enter email..."
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleAddCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateCustomer}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
