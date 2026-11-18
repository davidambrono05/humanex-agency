import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../index.css";
import Formular from "./Formular.tsx";
import { Analytics } from "@vercel/analytics/react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Formular />
    <Analytics />
  </StrictMode>,
);
