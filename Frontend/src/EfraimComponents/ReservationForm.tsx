import React, { useState, useEffect } from "react";
import { useShoppingCart } from "./ShoppingCartContext";
import styles from "./checkout.module.css";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

interface Show {
  theatreShowId: number;
  title: string;
  theatreShowDates: ShowDate[];
  price: number;
  showMood: string;
}

interface ShowDate {
  theatreShowDateId: number;
  dateAndTime: string;
}

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

const ReservationForm = () => {
  const { addToCart, setCustomerDetails } = useShoppingCart();
  const [shows, setShows] = useState<Show[]>([]);
  const [selectedShowId, setSelectedShowId] = useState<number | null>(null);
  const [showDates, setShowDates] = useState<ShowDate[]>([]);
  const [selectedShowDateId, setSelectedShowDateId] = useState<number | null>(
    null
  );
  const [ticketCount, setTicketCount] = useState<number>(1);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [discountMood, setDiscountMood] = useState("");
  const [searchParams] = useSearchParams();

  const selectedShow = shows.find(
    (show) => show.theatreShowId === selectedShowId
  );
  const ticketPrice = selectedShow ? selectedShow.price : 0;
  const isShowOfTheDay =
    selectedShowId &&
    selectedShow &&
    selectedShow.title.includes("Show of the Day");
  const discountedPrice =
    selectedShow?.showMood === discountMood ? ticketPrice * 0.85 : ticketPrice;
  const totalPrice = discountedPrice * ticketCount;

  // Fetch all shows and filter them to include only those with future dates
  useEffect(() => {
    fetch("http://localhost:5097/api/v1/TheatreShows")
      .then((response) => response.json())
      .then((data) => {
        const now = new Date();
        const filteredShows = data.filter((show: Show) => {
          const futureDates = (show.theatreShowDates || []).filter(
            (date) => new Date(date.dateAndTime) > now
          );
          show.theatreShowDates = futureDates; // Keep only future dates for each show
          return futureDates.length > 0; // Only include shows with future dates
        });
        setShows(filteredShows);
      })
      .catch((error) => console.error("Error fetching shows:", error));
  }, []);

  // Fetch available dates when a show is selected
  useEffect(() => {
    if (selectedShowId) {
      fetch(`http://localhost:5097/api/v1/TheatreShows/${selectedShowId}`)
        .then((response) => response.json())
        .then((data) => {
          const now = new Date();
          const futureDates = (data.theatreShowDates || []).filter(
            (date: { dateAndTime: string }) => new Date(date.dateAndTime) > now
          );
          setShowDates(futureDates);
        })
        .catch((error) => console.error("Error fetching show dates:", error));
    } else {
      setShowDates([]);
    }
  }, [selectedShowId]);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5097/api/v1/Weather"
        );
        setWeatherData(response.data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeather();
  }, []);

  useEffect(() => {
    const setMood = async () => {
      if (weatherData) {
        const weatherCondition = weatherData.weather[0]?.main.toLowerCase();

        if (weatherCondition === "rain" || weatherCondition === "clouds" || weatherCondition === "fog" || weatherCondition === "mist") {
          setDiscountMood("Sad");
        }
        if (weatherCondition === "clear") {
          setDiscountMood("Happy");
        }
      }
    };
    setMood();
  }, [weatherData]);

  // Fetch reservation button ShowID
  useEffect(() => {
    const initialShowId = searchParams.get("showId");
    if (initialShowId) {
      setSelectedShowId(parseInt(initialShowId));
    }
  }, [searchParams]);

  const handleAddToCart = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedShowId && selectedShowDateId) {
      const selectedShow = shows.find(
        (show) => show.theatreShowId === selectedShowId
      );
      const ticketPrice = selectedShow ? selectedShow.price : 0;
      const isShowOfTheDay = selectedShow?.title.includes("Show of the Day");
      if (selectedShow?.showMood !== null) {
        const discountedPrice =
          selectedShow?.showMood.trim() === discountMood
            ? ticketPrice * 0.85
            : undefined;
      }

      addToCart({
        showTitle: selectedShow?.title || "",
        dateAndTime:
          showDates.find(
            (date) => date.theatreShowDateId === selectedShowDateId
          )?.dateAndTime || "",
        ticketCount,
        showDateId: selectedShowDateId,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        price: ticketPrice,
        discountedPrice,
      });

      setShowPopup(true);
      setSelectedShowId(null);
      setSelectedShowDateId(null);
      setTicketCount(1);
      setFirstName("");
      setLastName("");
      setEmail("");
    } else {
      alert("Please select a show and date before adding to the cart.");
    }
  };

  return (
    <div className={styles.reservationForm}>
      <h2 className={styles.reservationTitle}>Make a Reservation</h2>
      <form onSubmit={handleAddToCart}>
        <div className={styles.reservationField}>
          <label htmlFor="show">Show:</label>
          <select
            id="show"
            value={selectedShowId || ""}
            onChange={(e) => setSelectedShowId(parseInt(e.target.value))}
            required
            className={styles.select}
          >
            <option value="">Select a show</option>
            {shows.map((show) => (
              <option key={show.theatreShowId} value={show.theatreShowId}>
                {show.title}
              </option>
            ))}
          </select>
        </div>

        {showDates.length > 0 && (
          <div className={styles.reservationField}>
            <label htmlFor="date">Date:</label>
            <select
              id="date"
              value={selectedShowDateId || ""}
              onChange={(e) => setSelectedShowDateId(parseInt(e.target.value))}
              required
              className={styles.select}
            >
              <option value="">Select a date</option>
              {showDates.map((date) => (
                <option
                  key={date.theatreShowDateId}
                  value={date.theatreShowDateId}
                >
                  {new Date(date.dateAndTime).toLocaleString()}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className={styles.reservationField}>
          <label htmlFor="ticketCount">Ticket Count:</label>
          <input
            id="ticketCount"
            type="number"
            min="1"
            value={ticketCount}
            onChange={(e) => setTicketCount(parseInt(e.target.value))}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.reservationField}>
          <label htmlFor="firstName">First Name:</label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.reservationField}>
          <label htmlFor="lastName">Last Name:</label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.reservationField}>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        {selectedShow && selectedShowDateId && (
          <>
            <label className={styles.label}>
              Price per Ticket:
              {selectedShow?.showMood !== null && (
                <>
                  {selectedShow?.showMood.trim() === discountMood ? (
                    <p className={styles.cartField}>
                      <span style={{ textDecoration: "line-through" }}>
                        €{ticketPrice.toFixed(2)}
                      </span>{" "}
                      €{discountedPrice.toFixed(2)}
                      <br />
                      Total Price: €{(discountedPrice * ticketCount).toFixed(2)}
                    </p>
                  ) : (
                    <p className={styles.cartField}>
                      {ticketPrice.toFixed(2)}
                      <br />
                      Total Price: €{(ticketPrice * ticketCount).toFixed(2)}
                    </p>
                  )}
                </>
              )}
            </label>
          </>
        )}
        <div className={styles.cartActions}>
          <button type="submit" className={styles.cartActions}>
            Add to Cart
          </button>
        </div>
      </form>

      {showPopup && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <p>Ticket Added to Shopping Cart!</p>
            <button
              className={styles.popupContentButton}
              onClick={() => (window.location.href = "/")}
            >
              Home
            </button>
            <button
              className={styles.popupContentButton}
              onClick={() => (window.location.href = "/ShoppingCart")}
            >
              Look at My Shopping Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationForm;
