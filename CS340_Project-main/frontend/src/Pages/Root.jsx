import { Outlet } from "react-router-dom";
import { MainMenu } from "../Components/MainMenu";
import ToastContainer from "react-bootstrap/ToastContainer";
import Toast from "react-bootstrap/Toast";
import { useState } from "react";
import { ToastContext } from "../Contexts/ToastContext";
import "./styles.css";

export function Root() {
  const [toasts, setToasts] = useState([]);

  const createToast = {
    success: (message) => {
      const cleanedMessage = typeof message === "string" ? message : message?.toString() ?? "Unable to parse message"
      const id = Date.now();
      const toastData = { id, message: cleanedMessage, wasSuccessful: true };
      setToasts((prevToasts) => [...prevToasts, toastData]);
    },
    failure: (message) => {
      const cleanedMessage = typeof message === "string" ? message : message?.toString() ?? "Unable to parse message"
      const id = Date.now();
      const toastData = { id, message: cleanedMessage, wasSuccessful: false };
      setToasts((prevToasts) => [...prevToasts, toastData]);
    },
  };

  const hideToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <>
      <ToastContext.Provider value={createToast}>
        <div
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <MainMenu />
          <Outlet />
        </div>
      </ToastContext.Provider>
      <ToastContainer
        className="p-3"
        position="bottom-end"
        style={{ zIndex: 1 }}
      >
        {toasts.map((t) => (
          <Toast
            key={t.id}
            bg={t.wasSuccessful ? "info" : "danger"}
            onClose={() => hideToast(t.id)}
            delay={3000}
            autohide
            show
          >
            <Toast.Header>
              <strong className="me-auto" />
            </Toast.Header>
            <Toast.Body>{t.message}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </>
  );
}
