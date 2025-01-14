import React from "react";
import { Link, useNavigate } from "react-router-dom";
import scatteredCloudsImg from "./../scatteredclouds.png";
import eyeOfRahImg from "./../eye-of-rah.png";
import hotdayImg from "./../hotday.png";
import rainImg from "./../rain.png";
import styles from "./MainPage.module.css";

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
  const navigate = useNavigate();

  const handleShowsClick = () => {
    navigate("/");
    setTimeout(() => {
      const bottomElement = document.body;
      bottomElement.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 100);
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  const handleReservationClick = () => {
    navigate("/ReservationForm");
  };

  let weatherImage = "";

  if (weatherData) {
    const weatherType = weatherData.weather[0].main.toLowerCase();
    const temperature = weatherData.main.temp;

    if (weatherType === "clear" && temperature >= 25) {
      weatherImage = hotdayImg;
    } else if (weatherType === "clouds") {
      weatherImage = scatteredCloudsImg;
    } else if (weatherType === "rain") {
      weatherImage = rainImg;
    }
  }

  return (
    <header
      className={styles["header"]}
      style={{
        backgroundImage: weatherImage ? `url(${weatherImage})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Link to="/" className={styles["logo"]}>
        Altijd Volle Bak Theater
      </Link>
      <nav className={styles["nav"]}>
        <button onClick={handleHomeClick} className={styles["nav-button"]}>
          Home
        </button>
        <button onClick={handleShowsClick} className={styles["nav-button"]}>
          Shows
        </button>
        <button
          onClick={handleReservationClick}
          className={styles["nav-button"]}
        >
          Reserveren
        </button>
        <Link to="/ShoppingCart">
          <img
            src={require("./../shopping-cart.png")}
            alt="Shopping Cart"
            className={styles["cart-icon"]}
          />
        </Link>
      </nav>
    </header>
  );
};

export default Header;
