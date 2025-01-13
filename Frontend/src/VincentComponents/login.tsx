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
      setError("Vul zowel gebruikersnaam als wachtwoord in!");
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
        navigate("/dashboard");
      } else {
        setError("Ongeldige gebruikersnaam of wachtwoord!");
      }
    } catch (error: any) {
      if (error.response) {
        setError("Ongeldige gebruikersnaam of wachtwoord!");
      } else {
        setError("Er is een onverwachte fout opgetreden. Probeer het opnieuw.");
      }
    }
  };

  return (
    <div className={styles["full-screen-container"]}>
      <div className={styles["login-container"]}>
        <h1>Admin Login Systeem</h1>
        <input
          type="text"
          value={user}
          onChange={SetUserChange}
          placeholder="Voer gebruikersnaam in"
          className={styles["input-field"]}
        />
        <input
          type="password"
          value={password}
          onChange={SetPasswordChange}
          placeholder="Voer wachtwoord in"
          className={styles["input-field"]}
        />
        <button onClick={handleLogin} className={styles["login-button"]}>
          Login
        </button>
        {error && <p className={styles["error-message"]}>{error}</p>}
      </div>
    </div>
  );
};

export default Login;
