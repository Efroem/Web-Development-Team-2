import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MainPage.module.css";

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  const handleReserveClick = () => {
    navigate("/ReservationForm");
  };

  const handleScrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <section className={styles["hero-section"]}>
      <h1 className={styles["hero-title"]}>ALTIJD VOLLE BAK THEATER</h1>
      <p className={styles["hero-subtitle"]}>
        'Altijd uitverkocht, altijd onvergetelijk'
      </p>
      <div className={styles["buttons"]}>
        <button
          className={styles["hero-button"]}
          onClick={handleReserveClick}
        >
          Reserveren
        </button>
        <button
          className={styles["hero-button"]}
          onClick={handleScrollToBottom}
        >
          Bekijk onze shows
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
