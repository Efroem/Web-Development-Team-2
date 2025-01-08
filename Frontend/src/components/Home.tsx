import React, { useEffect, useState } from 'react';
import Header from './Header';
import HeroSection from './HeroSection';
import ShowsCarousel from './ShowsCarousel';
import WeeklyShows from './WeeklyShows';
import Footer from './Footer';
import axios from 'axios';

interface Show {
  title: string;
  description: string;
}

const Home: React.FC = () => {
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
    return <div>Loading...BHWDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD</div>;
    
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

export default Home;
