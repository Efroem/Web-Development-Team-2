import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Login from './VincentComponents/login';
import ShowPage from './components/ShowPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/adminlogin" element={<Login />} />
        <Route path="/show/:showId" element={<ShowPage />} />
      </Routes>
    </Router>
  );
};

export default App;