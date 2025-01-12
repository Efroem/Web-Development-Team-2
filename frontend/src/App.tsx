import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Home from './components/Home';
import Login from './VincentComponents/login';
import ShowPage from './components/ShowPage';
import Create from './VincentComponents/CreateShow';
import AdminDashboard from './VincentComponents/AdminDashboard';
import TheatreShows from './VincentComponents/DeleteShow';
const LocationWatcher: React.FC = () => {
  const location = useLocation();

  React.useEffect(() => {
    console.log("Navigated to:", location.pathname);
  }, [location]);

  return null; 
};

const App: React.FC = () => {
  return (
    <Router>
      <LocationWatcher />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/adminlogin" element={<Login />} />
        <Route path="/show/:showId" element={<ShowPage />} />
        <Route path="/create" element={<Create />} />
        <Route path="/Dashboard" element={<AdminDashboard />} />
        <Route path="/TheaterShow" element={<TheatreShows />} />

=      </Routes>
    </Router>
  );
};

export default App;
