import React, { useState } from "react";

const ReservationForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showId, setShowId] = useState("");
  const [date, setDate] = useState("");
  const [tickets, setTickets] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const reservation = { name, email, showId, date, tickets };

    // Save to local storage as a shopping cart item
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push(reservation);
    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Ticket added to cart!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Reserve a Ticket</h2>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Show ID:</label>
        <input
          type="text"
          value={showId}
          onChange={(e) => setShowId(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Number of Tickets:</label>
        <input
          type="number"
          value={tickets}
          onChange={(e) => setTickets(parseInt(e.target.value))}
          min="1"
          required
        />
      </div>
      <button type="submit">Add to Cart</button>
    </form>
  );
};

export default ReservationForm;
