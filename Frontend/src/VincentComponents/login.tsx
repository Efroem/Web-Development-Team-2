import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const SetUserChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUser(event.target.value);
  };

  const SetPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleLogin = async () => {
    if (!user || !password) {
      setError("Please enter both username and password!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5097/api/v1/Adminlogin/login", {
        UserName: user,
        Password: password,
      });

      if (response.status === 200) {
        setIsLoggedIn(true);
        setError("");
        navigate("/");
      } else {
        setIsLoggedIn(false);
        setError(response.data.message || "Invalid username or password!");
      }
    } catch (error: any) {
      setIsLoggedIn(false);
      if (error.response) {
        setError(error.response.data.message || "Invalid username or password!");
      }
      else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="login-container">
      <h1>Admin Login System</h1>
      <input
        type="text"
        value={user}
        onChange={SetUserChange}
        placeholder="Enter username"
        className="input-field"
      />
      <input
        type="password"
        value={password}
        onChange={SetPasswordChange}
        placeholder="Enter password"
        className="input-field"
      />
      <button onClick={handleLogin} className="login-button">
        Login
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Login;
