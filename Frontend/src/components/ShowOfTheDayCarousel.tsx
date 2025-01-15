import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './MainPage.module.css';
import { sortAndFilterShows} from './ShowSorter';
import { fetchWeather } from './WeatherLoader';

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


const ShowsOfTheDayCarousel: React.FC<{venues: Venue[]} > = ({ venues }) => {
  const [filteredShows, setFilteredShows] = useState<Show[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [searchVenue, setSearchVenue] = useState("")
  const [sortTerm, setFilterTerm] = useState("")
  const [filterMonth, setFilterMonth] = useState<number>(-1)
  const [discountMood, setDiscountMood] = useState("");

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

  // useEffect(() => {
  //   const setMood = async () => {
  //     if (weatherData) {
  //       const weatherCondition = weatherData.weather[0]?.main.toLowerCase();

  //       if (weatherCondition === "rain" || weatherCondition === "clouds") {
  //         setDiscountMood("Sad");
  //       }
  //       if (weatherCondition === "clear") {
  //         setDiscountMood("Happy");
  //       }
  //     }
  //   };
  //   setMood();
  // }, []);

  useEffect(() => {
    const fetchAndSetMood = async () => {
      const loadedWeatherData = await fetchWeather();
      if (loadedWeatherData) {
        const weatherCondition = loadedWeatherData.weather[0]?.main.toLowerCase();
        if (weatherCondition === "rain" || weatherCondition === "clouds" || weatherCondition === "fog" || weatherCondition === "mist") {
          setDiscountMood("Sad");
        } else if (weatherCondition === "clear") {
          setDiscountMood("Happy");
        }
      }
    };
    fetchAndSetMood();
  }, []);
  
  useEffect(() => {
    const loadShows = async () => {
      const shows = await sortAndFilterShows(sortTerm, filterMonth, searchTerm, searchVenue);
      if (shows) {
        const currentDate = new Date();
        const upcomingShows = shows.filter((show) =>
          show.theatreShowDates.some((date) => new Date(date.dateAndTime) > currentDate)
        );
  
        const actualShowsOfTheDay = upcomingShows.filter(
          (show) => show.showMood?.trim() === discountMood && show.showMood !== null
        );
  
        setFilteredShows(actualShowsOfTheDay);
      }
    };
    loadShows();
  }, [searchTerm, searchVenue, filterMonth, sortTerm, discountMood]);
    
  // useEffect(() => {
  //   if (weatherData) {
  //     const weatherCondition = weatherData.weather[0]?.main.toLowerCase();
  //     setFilteredShows((prevShows) =>
  //       prevShows.filter((show) => {
  //         if (weatherCondition === 'rain') {
  //           return show.showMood === 'Sad';
  //         }
  //         if (weatherCondition === 'clear') {
  //           return show.showMood === 'Happy';
  //         }
  //         return true;
  //       })
  //     );
  //   }
  // }, [weatherData, filteredShows]); // Re-run when weatherData or filteredShows change

  return (
    <section className={styles['weekly-shows']}>
      <h2>Uitgelichte Shows</h2>
      <div className={styles['search-bar']}>
        <input
          type="text"
          placeholder="Zoek shows..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <select onChange={(e) => setSearchVenue(e.target.value)}>
        <option value="">Zoek op Locatie</option>
        {venues.map((venue) => (
          <option key={venue.venueId} value={venue.name}>
            {venue.name}
          </option>
        ))}
      </select>
      <div className={styles['filter-month']}>
        <select onChange={(e) => setFilterTerm(e.target.value)}>
          <option value="">Selecteer Filter</option>
          <option value="A-Z">A-Z</option>
          <option value="Z-A">Z-A</option>
          <option value="Price Ascending">Price Oplopend</option>
          <option value="Price Descending">Price Aflopend</option>
          <option value="Date Ascending">Date Oplopend</option>
          <option value="Date Descending">Date Aflopend</option>

        </select>
      </div>
      <div className={styles['filter-month']}>
        <select onChange={(e) => setFilterMonth(Number(e.target.value))}>
          <option value="-1">Zoek bij Maand</option>
          <option value="0">Januari</option>
          <option value="1">Februari</option>
          <option value="2">Maart</option>
          <option value="3">April</option>
          <option value="4">Mei</option>
          <option value="5">Juni</option>
          <option value="6">Juli</option>
          <option value="7">Augustus</option>
          <option value="8">September</option>
          <option value="9">Oktober</option>
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
                {show.showMood.trim() === discountMood && (
                  <p className={styles.cartField}>
                  <span style={{ textDecoration: 'line-through' }}>
                    €{show.price.toFixed(2)}
                  </span>{" "}
                    €{(show.price * 0.85).toFixed(2)}
                </p>
                )}
                
                {show.theatreShowDates.length > 0 && ( // Code to Show the first date in the future
                  <p>
                    {show.theatreShowDates
                      .map((date) => new Date(date.dateAndTime)) // Convert all dates to Date objects
                      .filter((date) => date.getTime() > Date.now()) // Keep only dates in the future
                      .sort((a, b) => a.getTime() - b.getTime()) // Sort dates by their timestamp
                      .slice(0, 1) // Take the first date
                      .map((date) => date.toLocaleString()) // Format the date as a string
                    }
                  </p>
                )}
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