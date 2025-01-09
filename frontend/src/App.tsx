import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ShowsCarousel from './components/ShowsCarousel';
import WeeklyShows from './components/WeeklyShows';
import Footer from './components/Footer';
import axios from 'axios';
import './App.css';
import ShowsOfTheDayCarousel from './components/ShowOfTheDayCarousel';

interface Show {
  title: string;
  description: string;
  showMood: string;
  price: number;
  theatreShowDates: {
    dateAndTime: string
  } []
}

// interface ShowWithMood {
//   title: string;
//   description: string;
//   showMood: string;
// }

interface WeatherData {
  name: string;
  weather: {
    main: string
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

const App: React.FC = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

   // Fetch the weather data when the component mounts
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get('http://localhost:5097/api/v1/Weather'); 
        setWeatherData(response.data); 
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeather();
  }, []);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await axios.get<Show[]>('http://localhost:5097/api/v1/TheatreShows');
        setShows(response.data);
      } catch (error) {
        console.error('Error fetching shows:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app">
      <Header weatherData={weatherData} />
      <HeroSection />
      <ShowsCarousel />
      <ShowsOfTheDayCarousel shows={shows} weatherData={weatherData} />
      <WeeklyShows shows={shows} />
      <Footer />
    </div>
  );
};

export default App;
