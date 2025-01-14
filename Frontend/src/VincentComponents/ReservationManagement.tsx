import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./ReservationManagement.module.css";

interface Reservation {
  reservationId: number;
  amountOfTickets: number;
  used: boolean;
  title: string;
  date: string;
  customerEmail: string;
}

const ReservationManagement: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterShow, setFilterShow] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [shows, setShows] = useState<string[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get<Reservation[]>(
          "http://localhost:5097/api/v1/ReservationManagement/all"
        );
        setReservations(response.data);

        // Extract unique show titles for the filter dropdown
        const uniqueShows = Array.from(
          new Set(response.data.map((r) => r.title))
        );
        setShows(uniqueShows);
      } catch (error) {
        console.error("Failed to fetch reservations:", error);
        setError("Failed to load reservations.");
      }
    };

    fetchReservations();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleShowFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterShow(e.target.value);
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

  const filteredReservations = reservations.filter((r) => {
    const matchesSearch =
      r.customerEmail.toLowerCase().includes(searchTerm) ||
      r.reservationId.toString().includes(searchTerm);
    const matchesShow = !filterShow || r.title === filterShow;
    const matchesDate = !filterDate || r.date.startsWith(filterDate);
    return matchesSearch && matchesShow && matchesDate;
  });

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Manage Reservations</h1>
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search by email or reservation ID"
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.input}
        />
        <select
          value={filterShow}
          onChange={handleShowFilterChange}
          className={styles.select}
        >
          <option value="">All Shows</option>
          {shows.map((show, index) => (
            <option key={index} value={show}>
              {show}
            </option>
          ))}
        </select>
        <input
          type="date"
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
            <th>Date</th>
            <th>Tickets</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredReservations.map((r) => (
            <tr key={r.reservationId}>
              <td>{r.reservationId}</td>
              <td>{r.customerEmail}</td>
              <td>{r.title}</td>
              <td>{new Date(r.date).toLocaleString()}</td>
              <td>{r.amountOfTickets}</td>
              <td>{r.used ? "Used" : "Not Used"}</td>
              <td>
                <button
                  className={styles.button}
                  onClick={() => handleMarkUsed(r.reservationId)}
                  disabled={r.used}
                >
                  Mark as Used
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
