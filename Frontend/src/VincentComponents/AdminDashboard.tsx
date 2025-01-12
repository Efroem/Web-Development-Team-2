import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminDashboard.module.css"; // Import the CSS module for styling

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleDeleteShowClick = () => {
    navigate("/delete"); // This will navigate to the /create-show route (the Create page)
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Admin Dashboard</h1>
      <button className={styles.createShowButton} onClick={handleDeleteShowClick}>
        Create Show
      </button>
    </div>
  );
};

export default AdminDashboard;
