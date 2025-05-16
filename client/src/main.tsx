import { createRoot } from "react-dom/client";
import StaticApp from "./staticApp";
import "./index.css";

// Usamos la versión estática de la aplicación para facilitar el despliegue en Cloudflare
createRoot(document.getElementById("root")!).render(<StaticApp />);
