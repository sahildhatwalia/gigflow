import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { SearchProvider } from "./context/SearchContext";
import { ThemeProvider } from "./context/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
  <BrowserRouter>
  <AuthProvider>
  <ThemeProvider>
   <SearchProvider>
    <App />
   </SearchProvider>
  </ThemeProvider>
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