import { createRoot } from "react-dom/client";
import "./index.css";
import "semantic-ui-css/semantic.min.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/index.jsx";

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
