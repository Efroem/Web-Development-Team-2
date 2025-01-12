import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ShoppingCartProvider } from "./EfraimComponents/ShoppingCartContext";
import Home from "./components/Home";
import Login from "./VincentComponents/login";
import ShoppingCart from "./EfraimComponents/ShoppingCart";
import ReservationForm from "./EfraimComponents/ReservationForm";

const App: React.FC = () => {
  return (
    <ShoppingCartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/adminlogin" element={<Login />} />
          <Route path="/ShoppingCart" element={<ShoppingCart />} />
          <Route path="/ReservationForm" element={<ReservationForm />} />
        </Routes>
      </Router>
    </ShoppingCartProvider>
  );
};

export default App;
