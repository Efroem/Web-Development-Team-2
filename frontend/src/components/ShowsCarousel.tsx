import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './MainPage.module.css';

interface TheatreShow {
  theatreShowId: number;
  title: string;
  description: string;
  theatreShowDates: {
    dateAndTime: string;
  }[];
  futureDates?: { dateAndTime: string }[];
  image?: string; // Image path for the show
}

const ShowsCarousel: React.FC = () => {
  const [shows, setShows] = useState<TheatreShow[]>([]);
  const [error, setError] = useState<string | null>(null); // State for error handling

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await axios.get<TheatreShow[]>('http://localhost:5097/api/v1/TheatreShows');

        const today = new Date();
        const filteredShows: TheatreShow[] = response.data
          .map((show) => {
            const futureDates = show.theatreShowDates.filter(
              (date) => new Date(date.dateAndTime) >= today
            );
            return { ...show, futureDates }; // Add futureDates dynamically
          })
          .filter((show) => show.futureDates && show.futureDates.length > 0) // Exclude shows without future dates
          .sort((a, b) =>
            new Date(a.futureDates![0].dateAndTime).getTime() -
            new Date(b.futureDates![0].dateAndTime).getTime()
          )
          .slice(0, 3); // Limit to x shows

        setShows(filteredShows);
        setError(null); // Clear any previous errors
      } catch (err) {
        console.error('Failed to fetch shows:', err);
        setError('Failed to load shows. Please try again later.');
      }
    };

    fetchShows();
  }, []);

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  if (shows.length === 0) {
    return <p className={styles.emptyMessage}>No upcoming shows to display.</p>;
  }

  return (
    <section>
      <h2 className={styles.carouselTitle}>Binnenkort</h2> {/* Added title */}
      <div className={styles['carousel']}>
        {shows.map((show) => (
          <Link to={`/show/${show.theatreShowId}`} key={show.theatreShowId}>
            <div className={styles['carousel-item']}>
              <img
                src={`/showImg/${show.theatreShowId}.jpg`}
                alt={show.title}
                onError={(e) => (e.currentTarget.src = '/images/default.jpg')} // Fallback image
              />
              <div className={styles['carousel-overlay']}>
                <h3>{show.title}</h3>
                <p>
                  {new Date(show.futureDates![0].dateAndTime).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ShowsCarousel;
