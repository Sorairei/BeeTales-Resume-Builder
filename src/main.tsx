import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { registerPwa } from "./services/pwaService";
import "./styles/global.css";
import "./styles/print.css";

createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);

registerPwa();
