import axios from "axios";

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


export const fetchWeather = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5097/api/v1/Weather"
        );
        return response.data;
      } catch (error) {
        console.error("Error fetching weather data:", error);
        return undefined
      }
    };