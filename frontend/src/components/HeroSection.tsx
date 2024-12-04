import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="hero-section">
      <h1 className="hero-title">ALTIJD VOLLE BAK THEATER</h1>
      <p className="hero-subtitle">'Altijd uitverkocht, altijd onvergetelijk'</p>
      <div className="buttons">
        <button className="hero-button">Reserveren</button>
        <button className="hero-button">Bekijk onze shows</button>
      </div>
    </section>
  );
};

export default HeroSection;
