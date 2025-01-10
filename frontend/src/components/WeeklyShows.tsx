import React, { useRef, useState, useEffect } from 'react';
import { applySorting, fetchShowsInMonth, sortShows } from './ShowSorter';
import styles from './MainPage.module.css';
import axios from 'axios';

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
interface Venue {
  venueId: number
  name: string
  capacity: number
}

const WeeklyShows: React.FC<{ venues: Venue[] }> = ({ venues}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [filteredShows, setFilteredShows] = useState<Show[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [searchVenue, setSearchVenue] = useState("")
  const [sortTerm, setFilterTerm] = useState("")
  const [filterMonth, setFilterMonth] = useState<number>(-1)

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
            <div className={styles['show-card']} key={index}>
              <h3>{show.title}</h3>
              <p>{show.description}</p>
              <p>{show.price}</p>
              <p>{show.venue.name}</p>
              {Array.isArray(show.theatreShowDates) && show.theatreShowDates.length > 0 && (
              
              <p>
                Earliest Date: <br />
                {
                  // Sort the dates in ascending order (earliest first)
                  show.theatreShowDates
                    .sort((a, b) => new Date(a.dateAndTime).getTime() - new Date(b.dateAndTime).getTime())
                    .map((date, index) => index === 0 && <span key={date.dateAndTime}>{date.dateAndTime}</span>) // Only show the earliest date
                }
              </p>
            )}

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


export default WeeklyShows;