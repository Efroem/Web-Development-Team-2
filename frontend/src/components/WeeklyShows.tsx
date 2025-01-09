import React, { useRef, useState } from 'react';
import { sortShows } from './ShowSorter';
import styles from './MainPage.module.css';

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

const WeeklyShows: React.FC<{ shows: Show[], venues: Venue[] }> = ({ shows, venues}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("")
  const [searchVenue, setSearchVenue] = useState("")
  const [sortTerm, setFilterTerm] = useState("")
  const [filterMonth, setFilterMonth] = useState("")

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
  

  let filteredShows: Show[] = shows.filter((show) =>
    show.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    show.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filterMonth != "") {
    filteredShows = filteredShows.filter((show) => {
      // Get the earliest date from the theatreShowDates array
      const earliestDate = show.theatreShowDates
        .map((date) => new Date(date.dateAndTime))
        .sort((a, b) => a.getTime() - b.getTime())[0]; // Get the earliest date
  
      // Check if the earliest date's month matches the filterMonth
      const earliestMonth = new Intl.DateTimeFormat("en-US", { month: "long" }).format(earliestDate);
  
      return earliestMonth === filterMonth;
    });
  }

  if (searchVenue != "") {
    filteredShows = filteredShows.filter((show) => show.venue.name == searchVenue)
  }
  

  let sortField: keyof Show = 'title'; // Default to 'title'
  let sortOrder: 'ascending' | 'descending' = 'ascending'; // Default to 'ascending'
  
  switch (sortTerm) {
    case "A-Z":
      sortField = 'title';
      sortOrder = 'ascending';
      break;
    case "Z-A":
      sortField = 'title';
      sortOrder = 'descending';
      break;
    case "Price Ascending":
      sortField = 'price';
      sortOrder = 'ascending';
      break;
    case "Price Descending":
      sortField = 'price';
      sortOrder = 'descending';
      break;
    case "Date Ascending":
      sortField = 'theatreShowDates'; // Special case for sorting by date
      sortOrder = 'ascending';
      break;
    case "Date Descending":
      sortField = 'theatreShowDates'; // Special case for sorting by date
      sortOrder = 'descending';
      break;
    default:
      // Fallback if no valid case is matched
      sortField = 'title';
      sortOrder = 'ascending';
      break;
  }
  
  // Apply the sorting
  filteredShows = sortShows(filteredShows, sortField, sortOrder);
  
    

  if (filterMonth) {
    filteredShows = filteredShows.filter((show) =>
      show.theatreShowDates.some((date) =>
        new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(date.dateAndTime)) === filterMonth
      )
    );
  }

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
        <select onChange={(e) => setFilterMonth(e.target.value)}>
          <option value="">Select a month</option>
          <option value="January">January</option>
          <option value="February">February</option>
          <option value="March">March</option>
          <option value="April">April</option>
          <option value="May">May</option>
          <option value="June">June</option>
          <option value="July">July</option>
          <option value="August">August</option>
          <option value="September">September</option>
          <option value="October">October</option>
          <option value="November">November</option>
          <option value="December">December</option>
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