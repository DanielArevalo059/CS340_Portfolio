import { useState, useContext, useRef } from "react";
import AsyncCreatableSelect from "react-select/async-creatable";
import { GameTitleTable } from "./GameTitleTable";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import AsyncSelect from "react-select/async";
import { ToastContext } from "../../Contexts/ToastContext";
import { Delete, Get, Post } from "../../API/RestfulMethods";
import "./styles.css";

export function Genres() {
  const [selectedGenre, setSelectedGenre] = useState(undefined);
  const [gamesWithGenre, setGamesWithGenre] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [videoGame, setVideoGame] = useState(undefined);

  const createToast = useContext(ToastContext);
  const createableSelectRef = useRef();

  const getVideoGames = async () => {
    try {
      // This is a post since Get requests can't have a body.
      return (
        await Post("/videoGamesWithoutGenre", {
          genreId: selectedGenre.value,
        })
      ).map((vg) => ({
        value: vg.videoGameId,
        label: vg.title,
      }));
    } catch (error) {
      createToast.failure(error);
    }
  };

  const getGenres = async (value) => {
    const queryUrl = value
      ? `/searchGenres?searchTerm=${encodeURIComponent(value.trim())}`
      : "/genres";
    try {
      return (await Get(queryUrl)).map((genre) => ({
        value: genre.genreId,
        label: genre.name,
      }));
    } catch (error) {
      createToast.failure(error);
    }
  };

  const handleGenreCreate = async (selection) => {
    const newValue = selection.label.trim();

    try {
      const newGenre = await Post("/genre", { name: newValue });

      setSelectedGenre({
        value: newGenre.genreId,
        label: newGenre.name,
      });

      createToast.success(`Created ${newValue} genre.`);
    } catch (error) {
      createToast.failure(error);
    }
  };

  const handleSelection = async (genre) => {
    if (!genre) {
      setGamesWithGenre([]);
      setSelectedGenre(undefined);
      return;
    }

    const matchingGames = await Get(`/gamesByGenreId?genreId=${genre.value}`);
    setSelectedGenre(genre);
    setGamesWithGenre(matchingGames);
  };

  const handleValueChange = async (selection, actionType) => {
    switch (actionType.action) {
      case "create-option":
        handleGenreCreate(selection);
        break;
      case "select-option":
        handleSelection(selection);
        break;
      case "clear":
        handleSelection(undefined);
        break;
      default:
        createToast.failure("Invalid selection option");
    }
  };

  const handleGenreDelete = async () => {
    try {
      await Delete(`/genre/${selectedGenre.value}`);
      setGamesWithGenre([]);
      setSelectedGenre(undefined);
      createToast.success("Deleted genre.");
      createableSelectRef.current.clearValue();
    } catch (error) {
      createToast.failure(error);
    }
  };

  const handleVideoGameGenreDelete = async (videoGameId) => {
    try {
      await Delete("/deleteVideoGameGenre", {
        genreId: selectedGenre.value,
        videoGameId,
      });
      setGamesWithGenre((prev) =>
        prev.filter((gwg) => gwg.videoGameId !== videoGameId)
      );
      createToast.success("Deleted genre from video game.");
    } catch (error) {
      createToast.failure(error);
    }
  };

  const handleNewGameForGenre = async () => {
    try {
      await Post("/createVideoGameGenre", {
        videoGameId: videoGame.value,
        genreId: selectedGenre.value,
      });

      const newRecord = {
        videoGameId: videoGame.value,
        title: videoGame.label,
      };

      setGamesWithGenre((prev) =>
        [...prev, newRecord].sort((a, b) =>
          a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1
        )
      );
      createToast.success(`Added ${selectedGenre.label} to ${videoGame.label}.`);
      handleCancel();
    } catch (error) {
      createToast.failure(error);
    }
  };

  const handleCancel = () => {
    setIsAddModalOpen(false);
    setVideoGame(undefined);
  };

  return (
    <div>
      <div style={{ display: "inline-flex" }}>
        <h3>Genres</h3>
        <small style={{ alignSelf: "center", paddingLeft: "4px" }}>
          (Searchable)
        </small>
      </div>
      <AsyncCreatableSelect
        ref={createableSelectRef}
        isClearable
        cacheOptions
        defaultOptions
        loadOptions={getGenres}
        onChange={handleValueChange}
        placeholder="Search for an existing genre or create one..."
      />
      {!!selectedGenre && (
        <>
          <div className="genre-button-container">
            <Button variant="danger" onClick={handleGenreDelete}>
              Delete Genre
            </Button>
            <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>
              Add a Video Game to Genre
            </Button>
          </div>
          <div style={{ marginTop: "20px" }}>
            <h3 style={{ paddingRight: "10px" }}>
              Video Games with the {selectedGenre.label} genre:
            </h3>
          </div>
          <GameTitleTable
            videoGames={gamesWithGenre}
            onVideoGameGenreDelete={handleVideoGameGenreDelete}
          />
        </>
      )}
      <Modal
        show={isAddModalOpen}
        onHide={handleCancel}
        backdrop="static"
        keyboard={false}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Add Video Game to the {selectedGenre?.label} genre
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AsyncSelect
            cacheOptions
            loadOptions={getVideoGames}
            defaultOptions
            onChange={setVideoGame}
            placeholder="Select a video game..."
            isClearable
            isSearchable={false}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleNewGameForGenre}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
