import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './MainPage.module.css';

interface Show {
  title: string;
  showMood: string;
  price: number;
  theatreShowDates: {
    dateAndTime: string;
  }[];
  theatreShowId: number;
}

const WeeklyShows: React.FC<{ shows: Show[] }> = ({ shows }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMonth, setFilterMonth] = useState('');

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

  let filteredShows = shows.filter((show) =>
    show.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <Link to={`/show/${show.theatreShowId}`} key={show.theatreShowId}>
              <div className={styles['show-card']}>
                <h3>{show.title}</h3>
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

export default WeeklyShows;