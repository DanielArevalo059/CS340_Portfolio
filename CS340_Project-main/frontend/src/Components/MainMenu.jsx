import { Link } from "react-router-dom";
import "./styles.css";

export function MainMenu() {
  return (
    <nav className="navbar-container">
      <Link style={{ padding: "0px 10px", fontSize: "24px" }} to="videogames">
        Video Games
      </Link>
      |
      <Link className="link-spacing" to="genres">
        Genres
      </Link>
      |
      <Link className="link-spacing" to="ratings">
        Ratings
      </Link>
      |
      <Link className="link-spacing" to="rentals">
        Rentals
      </Link>
      |
      <Link className="link-spacing" to="customers">
        Customers
      </Link>
    </nav>
  );
}
