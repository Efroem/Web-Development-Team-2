import React, { useState, useEffect } from "react";
import { useShoppingCart } from "./ShoppingCartContext";
import styles from "./checkout.module.css";

interface Show {
  theatreShowId: number;
  title: string;
  theatreShowDates: ShowDate[];
  price: number; // Added price property
}

interface ShowDate {
  theatreShowDateId: number;
  dateAndTime: string;
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

  const selectedShow = shows.find(
    (show) => show.theatreShowId === selectedShowId
  );
  const ticketPrice = selectedShow ? selectedShow.price : 0;
  const isShowOfTheDay =
    selectedShowId &&
    selectedShow &&
    selectedShow.title.includes("Show of the Day");
  const discountedPrice = isShowOfTheDay ? ticketPrice * 0.85 : ticketPrice;
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

  const handleAddToCart = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedShowId && selectedShowDateId) {
      const selectedShow = shows.find(
        (show) => show.theatreShowId === selectedShowId
      );
      const ticketPrice = selectedShow ? selectedShow.price : 0;
      const isShowOfTheDay = selectedShow?.title.includes("Show of the Day");
      const discountedPrice = isShowOfTheDay ? ticketPrice * 0.85 : undefined;

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
      <form onSubmit={handleAddToCart}>
        <label className={styles.cartField}>Show:</label>
        <select
          value={selectedShowId || ""}
          onChange={(e) => setSelectedShowId(parseInt(e.target.value))}
          required
        >
          <option value="">Select a show</option>
          {shows.map((show) => (
            <option
              key={show.theatreShowId}
              value={show.theatreShowId}
              disabled={show.theatreShowDates.length === 0} // Disable if no future dates
              style={
                show.theatreShowDates.length === 0
                  ? { textDecoration: "line-through", color: "grey" }
                  : {}
              }
            >
              {show.title}
            </option>
          ))}
        </select>

        {showDates.length > 0 && (
          <>
            <label className={styles.cartField}>Date:</label>
            <select
              value={selectedShowDateId || ""}
              onChange={(e) => setSelectedShowDateId(parseInt(e.target.value))}
              required
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
          </>
        )}

        <label className={styles.label}>Ticket Count:</label>
        <input
          type="number"
          min="1"
          value={ticketCount}
          onChange={(e) => setTicketCount(parseInt(e.target.value))}
          required
        />

        <label className={styles.label}>First Name:</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />

        <label className={styles.label}>Last Name:</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />

        <label className={styles.label}>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {selectedShow && selectedShowDateId && (
          <>
            <label className={styles.label}>Price per Ticket:</label>
            <p className={styles.cartField}>
              $
              {isShowOfTheDay
                ? `${ticketPrice.toFixed(
                    2
                  )} (15% Off: ${discountedPrice.toFixed(2)})`
                : ticketPrice.toFixed(2)}
            </p>

            <label className={styles.label}>Total Price:</label>
            <p className={styles.cartField}>${totalPrice.toFixed(2)}</p>
          </>
        )}

        <button type="submit">Add to Cart</button>
      </form>

      {/* Popup after adding to cart */}
      {showPopup && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <p>Ticket Added to Shopping Cart!</p>
            <button onClick={() => (window.location.href = "/")}>Home</button>
            <button onClick={() => (window.location.href = "/ShoppingCart")}>
              Shopping Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationForm;
