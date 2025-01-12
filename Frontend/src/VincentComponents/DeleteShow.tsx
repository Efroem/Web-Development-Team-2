import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Define types for the show
interface Venue {
  Name: string;
}

interface TheatreShowDate {
  DateAndTime: string;
}

interface Show {
  TheatreShowId: number;
  Title: string;
  Description: string;
  Price: number;
  Venue?: Venue;
  TheatreShowDates?: TheatreShowDate[];
}

const TheatreShows: React.FC = () => {
  const [shows, setShows] = useState<Show[]>([]); // State to store shows
  const [error, setError] = useState<string | null>(null); // State to track errors

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await axios.get<Show[]>('http://localhost:5097/api/v1/TheatreShows');
        setShows(response.data); 
      } catch (error) {
        console.error('Error fetching shows:', error);
        setError('Error fetching shows');
      } finally {
      }
    };

    fetchShows();
  }, []); 

 

  // Error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>List of Theatre Shows</h1>
      <ul>
        {shows.length === 0 ? (
          <li>No shows available</li>
        ) : (
          shows.map((show) => (
            <li key={show.TheatreShowId}>
              <h3>{show.Title}</h3>
              <p>{show.Description}</p>
              <p>Location: {show.Venue?.Name}</p>
              <p>Price: ${show.Price}</p>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default TheatreShows;
