import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../index.css";
import Formular from "./Formular.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Formular />
  </StrictMode>,
);
