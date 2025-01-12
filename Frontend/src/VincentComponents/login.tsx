import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./login.module.css";

const Login = () => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
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
      const response = await axios.post(
        "http://localhost:5097/api/v1/Adminlogin/login",
        {
          UserName: user,
          Password: password,
        }
      );

      if (response.status === 200) {
        setError("");
        navigate("/");
      } else {
        setError(response.data.message || "Invalid username or password!");
      }
    } catch (error: any) {
      if (error.response) {
        setError(error.response.data.message || "Invalid username or password!");
      } else if (error.request) {
        setError("Network error. Please check your connection.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className={styles["full-screen-container"]}>
      <div className={styles["login-container"]}>
        <h1>Admin Login System</h1>
        <input
          type="text"
          value={user}
          onChange={SetUserChange}
          placeholder="Enter username"
          className={styles["input-field"]}
        />
        <div className={styles["password-container"]}>
          <input
          type="text"
            value={password}
            onChange={SetPasswordChange}
            placeholder="Enter password"
            className={styles["input-field"]}
          />
        </div>
        <button onClick={handleLogin} className={styles["login-button"]}>
          Login
        </button>
        {error && <p className={styles["error-message"]}>{error}</p>}
      </div>
    </div>
  );
};

export default Login;
