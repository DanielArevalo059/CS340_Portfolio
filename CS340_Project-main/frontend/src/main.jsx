import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrorPage } from "./Pages/ErrorPage";
import { Root } from "./Pages/Root";
import { Home } from "./Pages/Home/Home";
import { Customers } from "./Pages/Customers/Customers";
import { Rentals } from "./Pages/Rentals/Rentals";
import { VideoGames } from "./Pages/VideoGames/VideoGames";
import { Genres } from "./Pages/Genres/Genres";
import { Ratings } from "./Pages/Ratings/Ratings";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "customers",
        element: <Customers />,
      },
      {
        path: "rentals",
        element: <Rentals />,
      },
      {
        path: "Ratings",
        element: <Ratings />,
      },
      {
        path: "videogames",
        element: <VideoGames />,
      },
      {
        path: "genres",
        element: <Genres />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
