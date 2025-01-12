import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Home from './components/Home';
import Login from './VincentComponents/login';
import ShowPage from './components/ShowPage';

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
<<<<<<< HEAD
=======
        <Route path="/show/:showId" element={<ShowPage />} />
>>>>>>> main
      </Routes>
    </Router>
  );
};

<<<<<<< HEAD
export default App;
=======
export default App;
>>>>>>> main
