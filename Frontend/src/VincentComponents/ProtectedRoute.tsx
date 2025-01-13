import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  // Controleer of de gebruiker is ingelogd door het token in localStorage
  const isAuthenticated = localStorage.getItem("adminToken");

  // Als de gebruiker niet is ingelogd, redirect naar /adminlogin
  return isAuthenticated ? children : <Navigate to="/adminlogin" replace />;
};

export default ProtectedRoute;
