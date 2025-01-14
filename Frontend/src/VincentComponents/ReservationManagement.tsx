import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./ReservationManagement.module.css";

interface Reservation {
  reservationId: number;
  amountOfTickets: number;
  used: boolean;
  title?: string; // Show Title
  date?: string; // Show Date
  customerEmail?: string; // Email
  email?: string; // Email from API response
  showId?: number; // Show ID
}

interface Show {
  id: number;
  title: string;
}

const ReservationManagement: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterShow, setFilterShow] = useState<number | "">("");
  const [filterDate, setFilterDate] = useState("");
  const [shows, setShows] = useState<Show[]>([]);
  const [error, setError] = useState("");

  // Fetch reservations dynamically based on filters
  const fetchReservations = async () => {
    try {
      let query = `http://localhost:5097/api/v1/ReservationManagement`;

      const params = new URLSearchParams();

      if (searchTerm.trim()) {
        params.append("email", searchTerm.trim());
      }

      if (filterShow) {
        params.append("showId", filterShow.toString());
      }

      if (filterDate) {
        params.append("dateTime", filterDate);
      }

      if (params.toString()) {
        query += `?${params.toString()}`;
      }

      const response = await axios.get<Reservation[]>(query);

      const sanitizedData = response.data.map((r) => ({
        reservationId: r.reservationId,
        amountOfTickets: r.amountOfTickets,
        used: r.used,
        title: r.title || "Unknown Show",
        date: r.date || "Unknown Date",
        customerEmail: r.email || "Unknown Email",
        showId: r.showId, // Include showId from API response
      }));

      setReservations(sanitizedData);

      // Extract unique show titles and IDs for the filter dropdown
      if (!filterShow && !filterDate) {
        const uniqueShows = Array.from(
          new Map(
            sanitizedData
              .filter((r) => r.showId !== undefined)
              .map((r) => [r.showId, r.title])
          ).entries()
        ).map(([id, title]) => ({ id: id as number, title: title as string }));
        setShows(uniqueShows);
      }

      setError(""); // Clear previous errors
    } catch (err) {
      console.error("Error fetching reservations:", err);
      setError("Failed to load reservations. Please try again.");
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [searchTerm, filterShow, filterDate]); // Trigger fetch when filters change

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleShowFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterShow(e.target.value === "" ? "" : parseInt(e.target.value));
  };

  const handleDateFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterDate(e.target.value);
  };

  const handleMarkUsed = async (reservationId: number) => {
    try {
      await axios.patch(
        `http://localhost:5097/api/v1/ReservationManagement/${reservationId}/mark-as-used`
      );
      setReservations((prev) =>
        prev.map((r) =>
          r.reservationId === reservationId ? { ...r, used: true } : r
        )
      );
    } catch {
      alert("Failed to mark reservation as used.");
    }
  };

  const handleDeleteReservation = async (reservationId: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this reservation?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:5097/api/v1/ReservationManagement/${reservationId}`
      );
      setReservations((prev) =>
        prev.filter((r) => r.reservationId !== reservationId)
      );
    } catch {
      alert("Failed to delete reservation.");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Reserveringen Beheren</h1>
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Zoek email..."
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.input}
        />
        <select
          value={filterShow}
          onChange={handleShowFilterChange}
          className={styles.select}
        >
          <option value="">Alle Shows</option>
          {shows.map((show) => (
            <option key={show.id} value={show.id}>
              {show.title}
            </option>
          ))}
        </select>
        <input
          type="datetime-local"
          value={filterDate}
          onChange={handleDateFilterChange}
          className={styles.input}
        />
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Show</th>
            <th>Datum</th>
            <th>Tickets</th>
            <th>Status</th>
            <th>Acties</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((r) => (
            <tr key={r.reservationId}>
              <td>{r.reservationId}</td>
              <td>{r.customerEmail}</td>
              <td>{r.title}</td>
              <td>{new Date(r.date || "").toLocaleString()}</td>
              <td>{r.amountOfTickets}</td>
              <td>{r.used ? "Used" : "Niet Used"}</td>
              <td>
                <button
                  className={styles.button}
                  onClick={() => handleMarkUsed(r.reservationId)}
                  disabled={r.used}
                >
                  Markeren als Used
                </button>
                <button
                  className={`${styles.button} ${styles.deleteButton}`}
                  onClick={() => handleDeleteReservation(r.reservationId)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReservationManagement;
