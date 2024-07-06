import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./router.jsx";
import { ArticuloProvider } from "./context/ArticuloProvider.jsx";
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'; 
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ArticuloProvider>
      <RouterProvider router={router} />
      <ToastContainer />
    </ArticuloProvider>
  </React.StrictMode>
);
