import React, { useRef } from 'react';

interface Show {
  title: string;
  description: string;
}

const WeeklyShows: React.FC<{ shows: Show[] }> = ({ shows }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    const container = document.querySelector('.shows-grid');
    if (container) {
      container.scrollBy({
        left: -container.clientWidth, // left scroll fix cuz it was fucked for some reason
        behavior: 'smooth',
      });
    }
  };
  

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <section className="weekly-shows">
      <h2>Shows van de week</h2>
      <div className="scroll-container">
        <button className="scroll-button left" onClick={scrollLeft}>
          &#8249;
        </button>
        <div className="shows-grid" ref={scrollRef}>
          {shows.map((show, index) => (
            <div className="show-card" key={index}>
              <h3>{show.title}</h3>
              <p>{show.description}</p>
            </div>
          ))}
        </div>
        <button className="scroll-button right" onClick={scrollRight}>
          &#8250;
        </button>
      </div>
    </section>
  );
};

export default WeeklyShows;
