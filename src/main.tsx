import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ConfirmDialogProvider } from "./components/common/ConfirmDialogProvider";
import { registerPwa } from "./services/pwaService";
import "./styles/global.css";
import "./styles/refined.css";
import "./styles/templates.css";
import "./styles/print.css";

createRoot(document.getElementById("root")!).render(<StrictMode><ConfirmDialogProvider><App /></ConfirmDialogProvider></StrictMode>);

registerPwa();
