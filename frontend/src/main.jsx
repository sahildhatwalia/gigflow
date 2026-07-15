import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { SearchProvider } from "./context/SearchContext";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>


  <BrowserRouter>
  <AuthProvider>


   <SearchProvider>
    <App />
   </SearchProvider>
     </AuthProvider>
    <Toaster
    position="top-right"
    reverseOrder={false}
    toastOptions={{
      duration: 3000,
    }}
  />
  </BrowserRouter>
  </React.StrictMode>
);