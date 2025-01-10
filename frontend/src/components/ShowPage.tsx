import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import axios from 'axios';
import styles from './ShowPage.module.css';

interface TheatreShowDate {
  theatreShowDateId: number;
  dateAndTime: string; // Assuming this is a string formatted as "yyyy-MM-ddTHH:mm:ss"
}

interface TheatreShow {
  theatreShowId: number;
  title: string;
  description: string;
  showMood: string;
  price: number;
  venue: {
    name: string;
    capacity: number;
  };
  theatreShowDates: TheatreShowDate[];
}

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

const ShowPage: React.FC = () => {
  const { showId } = useParams<{ showId: string }>();
  const [show, setShow] = useState<TheatreShow | null>(null);
  const [loading, setLoading] = useState(true);
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
    const fetchShowDetails = async () => {
      try {
        const response = await axios.get<TheatreShow>(`http://localhost:5097/api/v1/TheatreShows/${showId}`);
        setShow(response.data);
      } catch (error) {
        console.error('Error fetching show details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShowDetails();
  }, [showId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!show) {
    return <div>Show not found</div>;
  }

  return (
    <div>
      <Header weatherData={weatherData} />
      <div className={styles['show-page']}>
        <div className={styles['image-container']}>
          <img
            src={`/showImg/${show.theatreShowId}.jpg`}
            onError={(e) => (e.currentTarget.src = '/showImg/default.jpg')}
            alt={show.title}
            className={styles['show-image']}
          />
        </div>
        <div className={styles['show-details']}>
          <h1>{show.title}</h1>
          <div
            dangerouslySetInnerHTML={{ __html: show.description }}
            className={styles['description']}
          />
          <button className={styles['reserve-button']}>Reserveren</button>
        </div>
        <div className={styles['venue-info']}>
          <h2>Locatie Informatie</h2>
          <p><strong>Naam:</strong> {show.venue.name}</p>
          <p><strong>Capaciteit:</strong> {show.venue.capacity}</p>
          <div className={styles['date-container']}>
            <h3>Data en Tijden</h3>
            <div className={styles['scrollable-dates']}>
              <table className={styles['date-table']}>
                <thead>
                  <tr>
                    <th>Datum</th>
                    <th>Tijd</th>
                  </tr>
                </thead>
                <tbody>
                  {show.theatreShowDates.map((date) => {
                    const dateObj = new Date(date.dateAndTime);
                    const datePart = dateObj.toLocaleDateString();
                    const timePart = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    return (
                      <tr key={date.theatreShowDateId}>
                        <td>{datePart}</td>
                        <td>{timePart}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ShowPage;