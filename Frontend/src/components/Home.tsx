import React, { useEffect, useState } from 'react';
import HeroSection from './HeroSection';
import Header from './Header';
import ShowsCarousel from './ShowsCarousel';
import ShowsOfTheDayCarousel from './ShowOfTheDayCarousel';
import WeeklyShows from './WeeklyShows';
import Footer from './Footer';
import axios from 'axios';
import styles from './Mainpage.module.css';

interface Show {
  title: string;
  description: string;
  showMood: string;
  price: number;
  theatreShowDates: {
    dateAndTime: string
  } []
  venue: Venue
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

interface Venue {
  venueId: number
  name: string
  capacity: number
}

const Home: React.FC = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [venues, setVenues] = useState<Venue[]>([]);

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

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await axios.get<Venue[]>('http://localhost:5097/api/v1/TheatreShows/Venues');
        setVenues(response.data);
      } catch (error) {
        console.error('Error fetching shows:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header weatherData={weatherData}/>
      <HeroSection />
      <ShowsCarousel />
      <ShowsOfTheDayCarousel venues={venues} weatherData={weatherData} />
      <WeeklyShows venues={venues}/>
      <Footer />
    </div>
  );
};

export default Home;
