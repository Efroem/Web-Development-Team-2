import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminDashboard.module.css"; // Zorg ervoor dat je de juiste CSS-module importeert

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/adminlogin");
  };

  const handleDeleteShowClick = () => {
    navigate("/delete");
  };

  const handleOverviewClick = () => {
    navigate("/overview");
  };

  return (
    <div className={styles.container}>
      <div className={styles["white-box"]}>
        <h1 className={styles.heading}>Admin Dashboard</h1>
        <button className={styles.createShowButton} onClick={handleDeleteShowClick}>
          Verwijder Shows
        </button>
        <button className={styles.createShowButton} onClick={handleOverviewClick}>
          Lijst van Shows
        </button>

        {/* Logout Button */}
        <button className={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
