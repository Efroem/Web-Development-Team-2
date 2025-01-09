import React from 'react';
import styles from './MainPage.module.css';

const HeroSection: React.FC = () => {
  return (
    <section className={styles['hero-section']}>
      <h1 className={styles['hero-title']}>ALTIJD VOLLE BAK THEATER</h1>
      <p className={styles['hero-subtitle']}>'Altijd uitverkocht, altijd onvergetelijk'</p>
      <div className={styles['buttons']}>
        <button className={styles['hero-button']}>Reserveren</button>
        <button className={styles['hero-button']}>Bekijk onze shows</button>
      </div>
    </section>
  );
};

export default HeroSection;