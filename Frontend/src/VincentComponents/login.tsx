import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  function SetUserChange(event: React.ChangeEvent<HTMLInputElement>) {
    setUser(event.target.value);
  }

  function SetPasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);
  }

  function handleLogin() {
    const predefinedUsername = "admin";
    const predefinedPassword = "admin123";

    if (user === predefinedUsername && password === predefinedPassword) {
      setIsLoggedIn(true);
      setError("");
      navigate("/MainPage");  // Navigate to MainPage
    } else {
      setIsLoggedIn(false);
      setError("Invalid username or password!");
    }
  }

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
      <button onClick={handleLogin} className="login-button">Login</button>
      {error && <p className="error-message">{error}</p>}
      {isLoggedIn && <p className="welcome-message">Welcome, {user}!</p>}
    </div>
  );
};

export default Login;
