import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Login from './VincentComponents/login';

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/adminlogin" element={<Login/>} />

      </Routes>
    </Router>
  );
};

export default App;
