import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="logo">Altijd Volle Bak Theater</div>
      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="/shows">Shows</Link>
        <Link to="/news">News</Link>
        <Link to="/resources">Resources</Link>
        <Link to="/pricing">Prijslijst</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/adminlogin">Admin Login</Link>
      </nav>
    </header>
  );
};

export default Header;
