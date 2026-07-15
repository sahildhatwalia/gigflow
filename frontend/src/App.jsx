import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import CreateProduct from "./pages/CreateProduct";
import EditProduct from "./pages/EditProduct";
import ViewProduct from "./pages/ViewProduct";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        

        <Route path="/" element={<Home />} />

        <Route path="/create" element={<CreateProduct />} />

        <Route path="/edit/:id" element={<EditProduct />} />

        <Route path="/view/:id" element={<ViewProduct />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/profile" element={<Profile />} />

        <Route path="/change-password" element={<ChangePassword />} /> 

      </Routes>

    </>
  );
}

export default App;