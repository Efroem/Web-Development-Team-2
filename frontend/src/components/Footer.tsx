import React from 'react';
import styles from './MainPage.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles['footer']}>
      <img src="/Voorpagina.png" alt="Theater Logo" />
      <p>
        Altijd Volle Bak Theater is een sprankelende, meeslepende theatershow vol humor, herkenbare verhalen, en verrassende twists.
      </p>
    </footer>
  );
};

export default Footer;