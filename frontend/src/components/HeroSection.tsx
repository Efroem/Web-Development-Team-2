import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="hero-section">
      <h1>ALTJD VOLLE BAK THEATER</h1>
      <p>'Altijd uitverkocht, altijd onvergetelijk'</p>
      <div className="buttons">
        <button>Reserveren</button>
        <button>Bekijk onze shows</button>
      </div>
    </section>
  );
};

export default HeroSection;
