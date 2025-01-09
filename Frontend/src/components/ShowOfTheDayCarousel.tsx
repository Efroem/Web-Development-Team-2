import React, { useRef } from 'react';
import styles from './MainPage.module.css';

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

interface Show {
  title: string;
  description: string;
  showMood: string;
}

interface ShowOfTheDay {
  weatherData: WeatherData | null;
  shows: Show[];
}

const ShowsOfTheDayCarousel: React.FC<ShowOfTheDay> = ({ shows, weatherData }) => {
  const filteredShows = shows.filter((show) => {
    if (!weatherData) return true;
    const weatherCondition = weatherData.weather[0]?.main.toLowerCase();

    if (weatherCondition === 'rain') {
      return show.showMood === 'Sad';
    }
    if (weatherCondition === 'clear') {
      return show.showMood === 'Happy';
    }
    return true;
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -scrollRef.current.clientWidth, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <section className={styles['weekly-shows']}>
      <h2>Dagelijke Shows</h2>
      <div className={styles['scroll-container']}>
        <button className={styles['scroll-button']} onClick={scrollLeft}>
          &#8249;
        </button>
        <div className={styles['shows-grid']} ref={scrollRef}>
          {filteredShows.map((show, index) => (
            <div className={styles['show-card']} key={index}>
              <h3>{show.title}</h3>
              <p>{show.description}</p>
              <p>{show.showMood}</p>
            </div>
          ))}
        </div>
        <button className={styles['scroll-button']} onClick={scrollRight}>
          &#8250;
        </button>
      </div>
    </section>
  );
};

export default ShowsOfTheDayCarousel;
