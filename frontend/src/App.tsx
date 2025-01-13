import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Home from './components/Home';
import Login from './VincentComponents/login';
import ShowPage from './components/ShowPage';
import AdminDashboard from './VincentComponents/AdminDashboard';
import Deleteshows from './VincentComponents/Deleteshows';
import Overview from './VincentComponents/Overview';
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
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/delete" element={<Deleteshows />} />
        <Route path="/overview" element={<Overview />} />
      </Routes>
    </Router>
  );
};

export default App;
