import React, { useState, useEffect } from "react";
import { useShoppingCart } from "./ShoppingCartContext";
import "./App.css";

interface ShowDate {
  id: number;
  showName: string;
  date: string;
}

const ReservationForm = () => {
  const { addToCart } = useShoppingCart();
  const [showDates, setShowDates] = useState<ShowDate[]>([]);
  const [selectedShowDateId, setSelectedShowDateId] = useState<number | null>(
    null
  );
  const [ticketCount, setTicketCount] = useState<number>(1);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    fetch("/api/showdates")
      .then((response) => response.json())
      .then((data) => setShowDates(data));
  }, []);

  const handleAddToCart = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedShowDateId) {
      addToCart({
        firstName,
        lastName,
        email,
        reservations: [
          {
            showDateId: selectedShowDateId,
            ticketCount,
          },
        ],
      });
      setSelectedShowDateId(null);
      setTicketCount(1);
    }
  };

  return (
    <div className="reservation-form">
      <form onSubmit={handleAddToCart}>
        <label>Show Date:</label>
        <select
          value={selectedShowDateId || ""}
          onChange={(e) => setSelectedShowDateId(parseInt(e.target.value))}
          required
        >
          <option value="">Select a show date</option>
          {showDates.map((show) => (
            <option key={show.id} value={show.id}>
              {show.showName} - {show.date}
            </option>
          ))}
        </select>

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
    </div>
  );
};

export default ReservationForm;
