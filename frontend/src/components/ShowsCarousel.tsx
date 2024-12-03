import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface TheatreShow {
  theatreShowId: number;
  title: string;
  description: string;
  image?: string; // Optional since we'll add images manually
}

const ShowsCarousel: React.FC = () => {
  const [theatreShows, setTheatreShows] = useState<TheatreShow[]>([]);
  
  // Manually specify the IDs you want to display
  const specificIds = [13, 14]; // Replace with the desired TheatreShowId values

  useEffect(() => {
    const fetchTheatreShows = async () => {
      try {
        const response = await axios.get<TheatreShow[]>('http://localhost:5097/api/v1/TheatreShows');
        const filteredShows = response.data.filter((show) => specificIds.includes(show.theatreShowId));
        const showsWithImages = filteredShows.map((show, index) => ({
          ...show,
          image: index === 0 ? '/show1.png' : '/show2.png', // Assign manual paths
        }));
        setTheatreShows(showsWithImages);
      } catch (error) {
        console.error('Error fetching theatre shows:', error);
      }
    };

    fetchTheatreShows();
  }, []);

  return (
    <section className="carousel">
      {theatreShows.map((show) => (
        <div className="carousel-item" key={show.theatreShowId}>
          <img src={show.image} alt={show.title} />
          <div className="carousel-overlay">
            <h3>{show.title}</h3>
            <p>{show.description}</p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default ShowsCarousel;
