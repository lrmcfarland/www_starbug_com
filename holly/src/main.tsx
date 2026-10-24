import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "primereact/resources/themes/arya-purple/theme.css";
import "primereact/resources/primereact.min.css";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
