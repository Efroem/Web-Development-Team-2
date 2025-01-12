import React, { useState, useEffect } from "react";
import { useShoppingCart } from "./ShoppingCartContext";
import "../EfraimComponents/Reservation.css";

interface Show {
  theatreShowId: number;
  title: string;
}

interface ShowDate {
  theatreShowDateId: number;
  dateAndTime: string;
}

const ReservationForm = () => {
  const { addToCart } = useShoppingCart();
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

  // Fetch all shows from the backend
  useEffect(() => {
    fetch("http://localhost:5097/api/v1/TheatreShows?startDate=")
      .then((response) => response.json())
      .then((data) => setShows(data))
      .catch((error) => console.error("Error fetching shows:", error));
  }, []);

  // Fetch available dates when a show is selected
  useEffect(() => {
    if (selectedShowId) {
      fetch(`http://localhost:5097/api/v1/TheatreShows/${selectedShowId}`)
        .then((response) => response.json())
        .then((data) => setShowDates(data.theatreShowDates || []))
        .catch((error) => console.error("Error fetching show dates:", error));
    } else {
      setShowDates([]);
    }
  }, [selectedShowId]);

  const handleAddToCart = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedShowId && selectedShowDateId) {
      addToCart({
        showTitle:
          shows.find((show) => show.theatreShowId === selectedShowId)?.title ||
          "",
        dateAndTime:
          showDates.find(
            (date) => date.theatreShowDateId === selectedShowDateId
          )?.dateAndTime || "",
        ticketCount,
      });

      alert("Item has been added to the shopping cart!");
      setShowPopup(true); // Show the popup after adding to cart
      setSelectedShowId(null);
      setSelectedShowDateId(null);
      setTicketCount(1);
    }
  };

  return (
    <div className="reservation-form">
      <form onSubmit={handleAddToCart}>
        <label>Show:</label>
        <select
          value={selectedShowId || ""}
          onChange={(e) => setSelectedShowId(parseInt(e.target.value))}
          required
        >
          <option value="">Select a show</option>
          {shows.map((show) => (
            <option key={show.theatreShowId} value={show.theatreShowId}>
              {show.title}
            </option>
          ))}
        </select>

        {showDates.length > 0 && (
          <>
            <label>Date:</label>
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

        <label>Ticket Count:</label>
        <input
          type="number"
          min="1"
          value={ticketCount}
          onChange={(e) => setTicketCount(parseInt(e.target.value))}
          required
        />

        <label>First Name:</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />

        <label>Last Name:</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />

        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit">Add to Cart</button>
      </form>

      {/* Popup after adding to cart */}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>What would you like to do next?</p>
            <button onClick={() => (window.location.href = "/")}>
              Go Back Home
            </button>
            <button onClick={() => (window.location.href = "/ShoppingCart")}>
              Look at My Shopping Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationForm;
