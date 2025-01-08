import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Define types for the weather data response
interface WeatherData {
  name: string;
  weather: {
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

const WeatherComponent: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch weather data on component mount
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        // Make GET request without params (assuming backend provides location)
        const response = await axios.get<WeatherData>('http://localhost:5097/api/v1/Weather');
        setWeatherData(response.data);
      } catch (err) {
        setError('Error fetching weather data' + err);
      }
    };

    fetchWeatherData();
  }, []); // Only run on mount

  // Display error message if there's an error fetching data
  if (error) return <div>{error}</div>;

  // Display loading message if weatherData is null
  if (!weatherData) return <div>Loading weather data...</div>;

  // Return weather data to render
  return (
    <div>
      <h2>{weatherData.name}</h2>
      <p>Weather: {weatherData.weather[0].description}</p>
      <p>Temperature: {Math.round((weatherData.main.temp - 273.15) * 100) / 100}°C</p>
      <p>Feels Like: {weatherData.main.feels_like}°C</p>
      <p>Humidity: {weatherData.main.humidity}%</p>
      <p>Wind Speed: {weatherData.wind.speed} m/s</p>
      <p>Wind Gust: {weatherData.wind.gust} m/s</p>
      {/* Display more data as needed */}
    </div>
  );
};

export default WeatherComponent;
