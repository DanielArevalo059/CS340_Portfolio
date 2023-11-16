import { useState, useEffect, useContext, useRef } from "react";
import { VideoGamesTable } from "./VideoGameTable";
import { ToastContext } from "../../Contexts/ToastContext";
import { Get, Post, Put } from "../../API/RestfulMethods";
import AsyncSelect from "react-select/async";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const moneyRegex = /^\d+(?:\.\d{2})?$/;

export function VideoGames() {
  const [videoGames, setVideoGames] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRentModalOpen, setIsRentModalOpen] = useState(false);
  const [selectedVideoGame, setSelectedVideoGame] = useState(undefined);
  const [customerId, setCustomerId] = useState(undefined);
  const [newVideoGameName, setNewVideoGameName] = useState("");
  const [newVideoGameRating, setNewVideoGameRating] = useState(null);
  const [newVideoGamePrice, setNewVideoGamePrice] = useState(undefined);

  const hasMounted = useRef(false);
  const createToast = useContext(ToastContext);

  const getCustomers = async () => {
    try {
      return (await Get("/customers")).map((c) => ({
        value: c.customerId,
        label: c.email,
      }));
    } catch (error) {
      createToast.failure(error);
    }
  };

  const getRatings = async () => {
    try {
      return (await Get("/ratings")).map((r) => ({
        value: r.ratingId,
        label: r.name,
      }));
    } catch (error) {
      createToast.failure(error);
    }
  };

  const getVideoGames = async () => {
    try {
      const response = await Get("/videoGames");
      setVideoGames(response);
    } catch (error) {
      console.log(error);
      createToast.failure(error);
    }
  };

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      getVideoGames();
    }
  }, []);

  const handleRentVideoGame = (rentVideoGame) => {
    setIsRentModalOpen(true);
    setSelectedVideoGame(rentVideoGame);
  };

  const handleRentalCheckout = async () => {
    try {
      await Put(`/videoGames/${selectedVideoGame.videoGameId}/rent`, {
        customerId,
      });
      setVideoGames((prev) =>
        prev.map((vg) =>
          vg.videoGameId === selectedVideoGame.videoGameId
            ? { ...vg, isCheckedOut: true }
            : vg
        )
      );
      createToast.success(`Successfully rented ${selectedVideoGame.title}.`);
      handleRentCancel();
    } catch (error) {
      createToast.failure(error);
    }
  };

  const handleReturnVideoGame = async (returnVideoGame) => {
    try {
      await Put(`/videoGames/${returnVideoGame.videoGameId}/return`);
      setVideoGames((prev) =>
        prev.map((vg) =>
          vg.videoGameId === returnVideoGame.videoGameId
            ? { ...vg, isCheckedOut: false }
            : vg
        )
      );
      createToast.success(`Successfully returned ${returnVideoGame.title}.`);
    } catch (error) {
      createToast.failure(error);
    }
  };

  const handleCreateVideoGame = async () => {
    try {
      if (!moneyRegex.test(newVideoGamePrice))
        throw "Price is in a invalid format.";

      if (!newVideoGameName.trim())
        throw "The name cannot be blank or whitespace.";

      const videoGameIdString = await Post("/videoGames", {
        title: newVideoGameName,
        ratingId: newVideoGameRating?.value ?? null,
        price: newVideoGamePrice,
      });

      const videoGameId = parseInt(videoGameIdString, 10);

      if (isNaN(videoGameId)) throw "Failed to parse response.";

      const newVideoGame = {
        videoGameId,
        title: newVideoGameName,
        rating: newVideoGameRating?.label ?? null,
        genres: null,
        price: newVideoGamePrice,
        isCheckedOut: false,
      };
      setVideoGames((prev) =>
        [newVideoGame, ...prev].sort((a, b) =>
          a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1
        )
      );
      createToast.success(`Successfully created ${newVideoGameName}.`);
      handleAddCancel();
    } catch (error) {
      console.log(error);
      createToast.failure(error);
    }
  };

  const handleRentCancel = () => {
    setIsRentModalOpen(false);
    setSelectedVideoGame(undefined);
    setCustomerId(undefined);
  };

  const handleAddCancel = () => {
    setIsAddModalOpen(false);
    setNewVideoGameName("");
    setNewVideoGameRating(null);
    setNewVideoGamePrice(undefined);
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
          New Video Game
        </Button>
      </div>
      <VideoGamesTable
        videoGames={videoGames}
        onRentVideoGame={handleRentVideoGame}
        onReturnVideoGame={handleReturnVideoGame}
      />
      <Modal
        show={isRentModalOpen}
        onHide={handleRentCancel}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Renting {selectedVideoGame?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <small>Email Address</small>
          <AsyncSelect
            cacheOptions
            loadOptions={getCustomers}
            defaultOptions
            onChange={(customer) => setCustomerId(customer?.value ?? null)}
            placeholder="Select an email..."
            isClearable
            isSearchable={false}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleRentCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleRentalCheckout}>
            Checkout
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
          <Modal.Title>New Video Game</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <small>Name</small>
          <Form.Control
            type="text"
            onChange={(e) => setNewVideoGameName(e.currentTarget.value.trim())}
            placeholder="Enter name..."
            style={{ marginBottom: "10px" }}
          />
          <small>Rating (optional)</small>
          <AsyncSelect
            cacheOptions
            loadOptions={getRatings}
            defaultOptions
            onChange={(rating) => setNewVideoGameRating(rating)}
            placeholder="Select a rating..."
            isClearable
            isSearchable={false}
          />
          <small>Price</small>
          <Form.Control
            type="number"
            onChange={(e) => setNewVideoGamePrice(e.currentTarget.value.trim())}
            placeholder="Enter price..."
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleAddCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCreateVideoGame}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
