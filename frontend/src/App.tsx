import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';  
import './components/MainPage.css';



const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/MainPage" element={<Home/>} />
      </Routes>
    </Router>
  );
};

export default App;
