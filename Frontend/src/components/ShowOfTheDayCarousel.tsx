import React, { useRef } from 'react';

// interface Show {
//   title: string;
//   description: string;
// }

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
    title: string;
    description: string;
    showMood: string
}

interface ShowOfTheDay {
    weatherData: WeatherData | null;
    shows: Show[]
}



const ShowsOfTheDayCarousel: React.FC<ShowOfTheDay> = ({ shows, weatherData }) => {
    // Filter shows based on mood or weather conditions

    const filteredShows = shows.filter((show) => {
        if (!weatherData) return true; // If no weather data, show all
        var weatherCondition = weatherData.weather[0]?.main.toLowerCase(); // Example: 'rain', 'clear', etc.
        weatherCondition = 'rain';


        if (weatherCondition === 'rain') {
            return show.showMood === 'Sad'; // Example logic: cozy shows for rainy weather
        }
        if (weatherCondition === 'clear') {
            return show.showMood === 'Happy'; // Example logic: cozy shows for rainy weather
        }
        return true; // Default: Show all
    });


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
        <h2>Dagelijke Shows</h2>
        <div className="scroll-container">
            <button className="scroll-button left" onClick={scrollLeft}>
            &#8249;
            </button>
            <div className="shows-grid" ref={scrollRef}>
            {filteredShows.map((show, index) => (
                <div className="show-card" key={index}>
                <h3>{show.title}</h3>
                <p>{show.description}</p>
                <p>{show.showMood}</p>
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

export default ShowsOfTheDayCarousel;
