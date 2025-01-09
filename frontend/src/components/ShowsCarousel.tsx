import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
        <div className={styles['carousel-item']} key={show.theatreShowId}>
          <img src={show.image} alt={show.title} />
          <div className={styles['carousel-overlay']}>
            <h3>{show.title}</h3>
            <p>{show.description}</p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default ShowsCarousel;