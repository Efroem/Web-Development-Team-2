import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './MainPage.module.css';

interface TheatreShow {
  theatreShowId: number;
  title: string;
  description: string;
  image?: string; 
}

const ShowsCarousel: React.FC = () => {
  const [theatreShows, setTheatreShows] = useState<TheatreShow[]>([]);

  const specificIds = [13, 14];

  useEffect(() => {
    const fetchTheatreShows = async () => {
      try {
        const response = await axios.get<TheatreShow[]>('http://localhost:5097/api/v1/TheatreShows');
        const filteredShows = response.data.filter((show) => specificIds.includes(show.theatreShowId));
        const showsWithImages = filteredShows.map((show, index) => ({
          ...show,
          image: index === 0 ? '/show1.png' : '/show2.png',
        }));
        setTheatreShows(showsWithImages);
      } catch (error) {
        console.error('Error fetching theatre shows:', error);
      }
    };

    fetchTheatreShows();
  }, []);

  return (
    <section className={styles['carousel']}>
      {theatreShows.map((show) => (
        <Link to={`/show/${show.theatreShowId}`} key={show.theatreShowId}>
          <div className={styles['carousel-item']}>
            <img src={show.image} alt={show.title} />
            <div className={styles['carousel-overlay']}>
              <h3>{show.title}</h3>
            </div>
          </div>
        </Link>
      ))}
    </section>
  );
};

export default ShowsCarousel;