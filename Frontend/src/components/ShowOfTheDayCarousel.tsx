import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './MainPage.module.css';
import { applySorting, fetchShowsInMonth, sortShows } from './ShowSorter';

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
  theatreShowId: number;
  title: string;
  description: string;
  showMood: string;
  price: number;
  theatreShowDates: {
    dateAndTime: string
  } []
  venue: Venue
}

interface Venue {
  venueId: number
  name: string
  capacity: number
}
interface ShowOfTheDay {
  weatherData: WeatherData | null;
  shows: Show[];
}

const ShowsOfTheDayCarousel: React.FC<{ weatherData: WeatherData | null, venues: Venue[]} > = ({ weatherData, venues }) => {
  const [filteredShows, setFilteredShows] = useState<Show[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [searchVenue, setSearchVenue] = useState("")
  const [sortTerm, setFilterTerm] = useState("")
  const [filterMonth, setFilterMonth] = useState<number>(-1)

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

  useEffect(() => {
      const loadShows = async () => {
        const shows = await fetchShowsInMonth(filterMonth); // Fetch shows
        setFilteredShows(shows); // Update the filteredShows state
      };
      loadShows()
    }, [filterMonth]); // this code reruns when any of these variables change
  
    useEffect(() => {
      setFilteredShows(applySorting(filteredShows, searchTerm, searchVenue, sortTerm));
  
    }, [searchTerm, searchVenue, filterMonth, sortTerm]); // Dependencies to trigger the effect
  


    useEffect(() => {
      if (weatherData) {
        const weatherCondition = weatherData.weather[0]?.main.toLowerCase();
        setFilteredShows((prevShows) =>
          prevShows.filter((show) => {
            if (weatherCondition === 'rain') {
              return show.showMood === 'Sad';
            }
            if (weatherCondition === 'clear') {
              return show.showMood === 'Happy';
            }
            return true;
          })
        );
      }
    }, [weatherData, filteredShows]); // Re-run when weatherData or filteredShows change

  return (
    <section className={styles['weekly-shows']}>
      <h2>Onze Shows</h2>
      <div className={styles['search-bar']}>
        <input
          type="text"
          placeholder="Search shows..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <select onChange={(e) => setSearchVenue(e.target.value)}>
        <option value="">Search by Venue</option>
        {venues.map((venue) => (
          <option key={venue.venueId} value={venue.name}>
            {venue.name}
          </option>
        ))}
      </select>
      <div className={styles['filter-month']}>
        <select onChange={(e) => setFilterTerm(e.target.value)}>
          <option value="">Set Filter</option>
          <option value="A-Z">A-Z</option>
          <option value="Z-A">Z-A</option>
          <option value="Price Ascending">Price Ascending</option>
          <option value="Price Descending">Price Descending</option>
          <option value="Date Ascending">Date Ascending</option>
          <option value="Date Descending">Date Descending</option>

        </select>
      </div>
      <div className={styles['filter-month']}>
        <select onChange={(e) => setFilterMonth(Number(e.target.value))}>
          <option value="-1">Search by Month</option>
          <option value="0">January</option>
          <option value="1">February</option>
          <option value="2">March</option>
          <option value="3">April</option>
          <option value="4">May</option>
          <option value="5">June</option>
          <option value="6">July</option>
          <option value="7">August</option>
          <option value="8">September</option>
          <option value="9">October</option>
          <option value="10">November</option>
          <option value="11">December</option>
        </select>
      </div>
      <div className={styles['scroll-container']}>
        <button className={styles['scroll-button']} onClick={scrollLeft}>
          &#8249;
        </button>
        <div className={styles['shows-grid']} ref={scrollRef}>
          {filteredShows.map((show, index) => (
            <Link to={`/show/${show.theatreShowId}`} key={show.theatreShowId}>
              <div className={styles['show-card']}>
                <h3>{show.title}</h3>
                <p>{show.showMood}</p>
                <p>€{show.price}</p>
                {show.theatreShowDates.length > 0 && <p>{show.theatreShowDates[0].dateAndTime}</p>}
              </div>
            </Link>
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