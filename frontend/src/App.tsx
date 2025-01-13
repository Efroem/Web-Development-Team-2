import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { ShoppingCartProvider } from "./EfraimComponents/ShoppingCartContext";
import Home from "./components/Home";
import Header from "./components/Header";
import Login from "./VincentComponents/login";
import ShoppingCart from "./EfraimComponents/ShoppingCart";
import ReservationForm from "./EfraimComponents/ReservationForm";
import ShowPage from "./components/ShowPage";
import AdminDashboard from './VincentComponents/AdminDashboard';
import Deleteshows from './VincentComponents/Deleteshows';
import Overview from './VincentComponents/Overview';
import axios from "axios";
import ProtectedRoute from "./VincentComponents/ProtectedRoute";

interface WeatherData {
  name: string;
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
}

const LocationWatcher: React.FC = () => {
  const location = useLocation();

  React.useEffect(() => {
    console.log("Navigated to:", location.pathname);
  }, [location]);

  return null;
};

const App: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5097/api/v1/Weather"
        );
        setWeatherData(response.data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeather();
  }, []);

  return (
    <ShoppingCartProvider>
      <Router>
        <LocationWatcher />
        <Header weatherData={weatherData} />
        <Routes>
          <Route path="/" element={<Home weatherData={weatherData} />} />
          <Route path="/adminlogin" element={<Login />} />
          <Route path="/ReservationForm" element={<ReservationForm />} />
          <Route path="/ShoppingCart" element={<ShoppingCart />} />
          <Route path="/show/:showId" element={<ShowPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/delete" element={<Deleteshows />} />
          <Route path="/overview" element={<Overview />} />
        </Routes>
      </Router>
    </ShoppingCartProvider>
  );
};

export default App;
