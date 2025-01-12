import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios

// Define the interfaces based on your C# model
interface TheatreShowDate {
  TheatreShowDateId: number;
  DateAndTime: string; // ISO string or Date format
}

interface Venue {
  VenueId: number;
  Name: string;
}

interface TheatreShow {
  TheatreShowId: number;
  Title: string;
  Description: string;
  Price: number;
  TheatreShowDates: TheatreShowDate[];
  Venue: Venue;
}

const TheatreShows: React.FC = () => {
  const [shows, setShows] = useState<TheatreShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTheatreShows = async () => {
      try {
        const response = await axios.get('http://localhost:5097/api/v1/TheatreShows'); // Use axios for the GET request
        setShows(response.data); // Set the data in the state
      } catch (error: any) {
        setError(error.message); // Set error if any
      } finally {
        setLoading(false); // Set loading to false after the request completes
      }
    };

    fetchTheatreShows(); // Call the function to fetch the shows
  }, []); // Empty dependency array means it runs once when the component mounts

  // Conditional rendering based on loading and error states
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Theatre Shows</h1>
      {shows.length === 0 ? (
        <p>No shows available</p>
      ) : (
        <ul>
          {shows.map((show) => (
            <li key={show.TheatreShowId}>
              <h2>{show.Title}</h2>
              <p>{show.Description}</p>
              <p>Price: ${show.Price}</p>
              <p>Title: {show.Title}</p>
              <p>Venue: {show.Venue ? show.Venue.Name : 'Not available'}</p>
              <ul>
                {show.TheatreShowDates?.map((date) => (
                  <li key={date.TheatreShowDateId}>
                    <p>Date: {new Date(date.DateAndTime).toLocaleString()}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TheatreShows;
