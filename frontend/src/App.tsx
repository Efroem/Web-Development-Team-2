import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ShowsCarousel from './components/ShowsCarousel';
import WeeklyShows from './components/WeeklyShows';
import Footer from './components/Footer';
import axios from 'axios';
import './App.css';

interface Show {
  title: string;
  description: string;
}

const App: React.FC = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
      <Header />
      <HeroSection />
      <ShowsCarousel />
      <WeeklyShows shows={shows} />
      <Footer />
    </div>
  );
};

export default App;
