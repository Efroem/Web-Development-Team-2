import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminDashboard.module.css"; // Import the CSS module for styling

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleDeleteShowClick = () => {
    navigate("/delete");
  };
  const HandleOverviewClick = () => {
    navigate("/overview");
  };

  return (
    <div className={styles.container}>
      <div className={styles["white-box"]}> {/* White box container */}
        <h1 className={styles.heading}>Admin Dashboard</h1>
        <button className={styles.createShowButton} onClick={handleDeleteShowClick}>
          Verwijder Shows
        </button>
        <button className={styles.createShowButton} onClick={HandleOverviewClick}>
          Lijst van Shows
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
