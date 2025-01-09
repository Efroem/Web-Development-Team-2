import React from 'react';
import { Link } from 'react-router-dom';
import scatteredCloudsImg from './../scatteredclouds.png';
import eyeOfRahImg from './../eye-of-rah.png';
import hotdayImg from './../hotday.png';
import rainImg from './../rain.png';

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

interface HeaderProps {
  weatherData: WeatherData | null;
}

const Header: React.FC<HeaderProps> = ({ weatherData }) => {
  // Accessing description from weatherData
  // const getBackgroundImage = (description: string) => {
  //   switch (description.toLowerCase()) {
  //     case 'clear sky':
  //       return 'url(/src/clear-sky.jpg)';
  //     case 'rain':
  //       return 'url(/src/rainy.jpg)';
  //     case 'snow':
  //       return 'url(/src/snowy.jpg)';
  //     case 'clouds':
  //       return 'url(/src/cloudy.jpg)';
  //     case 'scattered clouds':
  //       return 'url(/src/scatteredclouds.jpg)';
  //     case 'moderate rain':
  //       return 'url(/src/rainy.jpg)';
  //     case 'light rain':
  //       return 'url(/src/rainy.jpg)';
  //     default:
  //       return 'url(/src/eye-of-rah.jpg)';
  //   }
  // };

  // const getTestTxt = (description:string) => {
  //   if (description == 'scattered clouds') {
  //     return "YESSSSS"
  //   }
  // }

  // const testTxt = weatherData ? getTestTxt(weatherData.weather[0].description) : "Failed"

  // Check if weatherData is available
  // const backgroundImage = weatherData ? getBackgroundImage(weatherData.weather[0].description) : 'url(/images/default.jpg)';

  let weatherImage = '';
  let weatherType = ''
  // if (weatherData != null) {
  //   weatherData.weather[0].main = "clear";
    
  // }

  

  if (weatherData != null) {
    let weatherType: string = weatherData.weather[0].main.toLowerCase();
    let temperature: number = weatherData.main.temp;
    // weatherType = 'clear';
    // temperature = 27;
    // switch (weatherData.weather[0].main.toLowerCase()) {
    // If the temperature is high enough to be considered a hot day
    if (weatherType === 'clear' && temperature >= 25) {
      <div> Pog</div>
      weatherImage = hotdayImg
    }
    else if (weatherType === 'clouds') {
      weatherImage = scatteredCloudsImg
    }
    else if (weatherType === 'rain') {
      weatherImage = rainImg
    }
      // case 'clear sky':
      //   return 'url(/src/clear-sky.jpg)';
      // case 'rain':
      //   return 'url(/src/rainy.jpg)';
      // case 'snow':
      //   return 'url(/src/snowy.jpg)';
      // case 'clear':
      //   weatherImage = sunnyImg;
      //   break;
      // case 'clouds':
      //   weatherImage = scatteredCloudsImg;
      //   break;
      // case 'moderate rain':
      //   return 'url(/src/rainy.jpg)';
      // case 'light rain':
      //   return 'url(/src/rainy.jpg)';
      // default:
      //   weatherImage = "none";
      //   break;
    // }
    // Use weather description to determine image URL
    // if (weatherData.weather[0].main === 'Rain') {
    //   weatherImage = rainImage;  // Set to imported image
    // } else if (weatherData.weather[0].main === 'Clear') {
    //   weatherImage = clearImage;  // Set to imported image
    // }
    // Add more conditions as needed
  }

  // weatherImage = sunnyImg

  return (
    <header
      className="header"
      style={{
        backgroundImage: weatherImage ? `url(${weatherImage})` : 'none',
        backgroundSize: 'cover', // The image will cover the container and crop if necessary
        backgroundPosition: 'center', // Centers the image to crop evenly from the center
        // height: '250px', // Set the height of the header
      }}
    >
      {/* <img src={weatherImage} alt="Weather Image" className="foreground-image" /> */}
      <div className="logo">Altijd Volle Bak Theater</div>
      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="/shows">Shows</Link>
        <Link to="/news">News</Link>
        <Link to="/resources">Resources</Link>
        <Link to="/pricing">Prijslijst</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/adminlogin">Admin Login</Link>
      </nav>
    </header>
  );
};

export default Header;
