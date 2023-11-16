import { useState, useEffect, useContext } from "react";
import { RatingsTable } from "./RatingsTable";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Get, Post } from "../../API/RestfulMethods";
import { ToastContext } from "../../Contexts/ToastContext";

export function Ratings() {
  const [ratings, setRatings] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRatingName, setNewRatingName] = useState("");
  const [newRatingAge, setNewRatingAge] = useState(null);

  useEffect(() => {
    getRatings();
  }, []);

  const handleCancel = () => {
    setIsAddModalOpen(false);
    setNewRatingName("");
    setNewRatingAge(null);
  };

  const createToast = useContext(ToastContext);

  const getRatings = async () => {
    const listOfRatings = await Get("/ratings");
    setRatings(listOfRatings);
  };
  const handleCreateRating = async () => {
    try {
      if (!newRatingName.trim())
        throw "The name cannot be blank or whitespace.";

      const ratingIdString = await Post("/ratings", {
        name: newRatingName,
        age: newRatingAge,
      });

      const ratingId = parseInt(ratingIdString, 10);

      if (isNaN(ratingId)) throw "Failed to parse response.";

      const newRating = {
        ratingId,
        name: newRatingName,
        ageRequirement: newRatingAge,
      };
      setRatings((prev) =>
        [newRating, ...prev].sort((a, b) =>
          a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
        )
      );
      createToast.success(`Successfully created ${newRatingName}.`);
      handleCancel();
    } catch (error) {
      console.log(error);
      createToast.failure(error);
    }
  };
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
          New Rating
        </Button>
      </div>
      <RatingsTable ratings={ratings} />
      <Modal
        show={isAddModalOpen}
        onHide={handleCancel}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>New Rating</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <small>Name (4 Letter maximum)</small>
          <Form.Control
            type="text"
            onChange={(e) => setNewRatingName(e.currentTarget.value)}
            placeholder="Enter name..."
            style={{ marginBottom: "10px" }}
          />
          <small>Age Requirement</small>
          <Form.Control
            type="number"
            onChange={(e) => setNewRatingAge(e.currentTarget.value)}
            placeholder="Enter age..."
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateRating}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
