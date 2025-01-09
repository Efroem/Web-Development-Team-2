import React, { useEffect, useState } from 'react';
import HeroSection from './HeroSection';
import Header from './Header';
import ShowsCarousel from './ShowsCarousel';
import ShowsOfTheDayCarousel from './ShowOfTheDayCarousel';
import WeeklyShows from './WeeklyShows';
import Footer from './Footer';
import axios from 'axios';
import "./MainPage.css"

interface Show {
  title: string;
  description: string;
  showMood: string;
  price: number;
  theatreShowDates: {
    dateAndTime: string
  } []
}

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

const Home: React.FC = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

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
    <div>
      <Header weatherData={weatherData}/>
      <HeroSection />
      <ShowsCarousel />
      <ShowsOfTheDayCarousel shows={shows} weatherData={weatherData} />
      <WeeklyShows shows={shows} />
      <Footer />
    </div>
  );
};

export default Home;
