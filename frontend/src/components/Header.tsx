import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="logo">Altijd Volle Bak Theater</div>
      <nav className="nav">
        <a href="#home">Home</a>
        <a href="#shows">Shows</a>
        <a href="#news">News</a>
        <a href="#resources">Resources</a>
        <a href="#pricing">Prijslijst</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>
  );
};

export default Header;
