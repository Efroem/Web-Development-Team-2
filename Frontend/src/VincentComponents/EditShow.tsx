import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './EditShow.module.css';

interface Venue {
  venueId: number;
  name: string;
  capacity: number;
}

const EditShow: React.FC = () => {
  const [show, setShow] = useState({
    title: '',
    description: '',
    price: '',
    venueId: 0,
    dateAndTime: ''
  });
  const [venues, setVenues] = useState<Venue[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [venueError, setVenueError] = useState<string | null>(null);
  const [theatreShowId, setTheatreShowId] = useState<string>('');
  const [isShowLoaded, setIsShowLoaded] = useState<boolean>(false);
  const navigate = useNavigate();

  // Haal locaties op
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await axios.get<Venue[]>('http://localhost:5097/api/v1/TheatreShows/Venues');
        setVenues(response.data);
      } catch (error: any) {
        setError("Er is een fout opgetreden bij het ophalen van de locaties.");
      }
    };

    fetchVenues();
  }, []);

  // Haal gegevens van de show op wanneer een ID wordt ingevuld
  const handleShowIdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!theatreShowId) {
      setError('Vul een geldige Theatre Show ID in.');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5097/api/v1/TheatreShows/${theatreShowId}`);
      setShow({
        title: response.data.title || '',
        description: response.data.description || '',
        price: response.data.price?.toString() || '',
        venueId: response.data.venue?.venueId || 0,
        dateAndTime: response.data.theatreShowDates[0]?.dateAndTime || ''
      });
      setIsShowLoaded(true); 
      setError(null); 
    } catch (error: any) {
      setError("Geen voorstelling gevonden met deze Show ID. Probeer het opnieuw.");
      setIsShowLoaded(false); 
      setShow({
        title: '',
        description: '',
        price: '',
        venueId: 0,
        dateAndTime: ''
      });
    }
  };

  // Handelen van wijzigingen in de invoervelden
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setShow(prevState => ({
      ...prevState,
      [name]: value || ''  
    }));
  };

  // Formulier voor het bewerken van de show
  const handleEditShow = async (e: React.FormEvent) => {
    e.preventDefault();

    const price = parseFloat(show.price);
    if (isNaN(price) || price < 0) {
      setFormError("Prijs niet lager dan 0");
      return;
    }

    const currentDate = new Date();
    const selectedDate = new Date(show.dateAndTime);
    if (selectedDate <= currentDate) {
      setFormError("De datum moet in de toekomst liggen.");
      return;
    }

    if (show.venueId === 0) {
      setVenueError("Selecteer een locatie.");
      return;
    } else {
      setVenueError(null);
    }

    const updatedShowData = {
      title: show.title,
      description: show.description,
      price: price,
      venue: { venueId: show.venueId },
      theatreShowDates: [{
        dateAndTime: show.dateAndTime
      }]
    };

    try {
      const response = await axios.put(`http://localhost:5097/api/v1/TheatreShows/${theatreShowId}`, updatedShowData);
      alert("Voorstelling succesvol bijgewerkt!");
      navigate("/dashboard");
    } catch (error: any) {
      setError("Fout bij het bijwerken van de voorstelling: " + error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Bewerk Voorstelling</h1>

      {!isShowLoaded && (
        <form onSubmit={handleShowIdSubmit}>
          <input
            type="text"
            name="theatreShowId"
            value={theatreShowId}
            onChange={(e) => setTheatreShowId(e.target.value)}
            placeholder="Enter Theatre Show ID"
            className={`${styles.formInput} ${styles.inputText}`}
            required
          />
          <button type="submit" className={styles.addButton}>Haal Voorstelling Op</button>
        </form>
      )}

      {error && <div className={styles.error}>{error}</div>}

      {isShowLoaded && (
        <>
          {formError && <div className={styles.formError}>{formError}</div>}
          {venueError && <div className={styles.formError}>{venueError}</div>}

          <form onSubmit={handleEditShow}>
            <input
              type="text"
              name="title"
              placeholder="Titel"
              value={show.title}
              onChange={handleInputChange}
              className={`${styles.formInput} ${styles.inputText}`}
              required
            />
            <textarea
              name="description"
              placeholder="Beschrijving"
              value={show.description}
              onChange={handleInputChange}
              className={styles.formInput}
              required
            />
            <input
              type="text"
              name="price"
              placeholder="Prijs"
              value={show.price}
              onChange={handleInputChange}
              className={`${styles.formInput} ${styles.inputText}`}
              required
            />
            <select
              name="venueId"
              value={show.venueId}
              onChange={handleInputChange}
              className={styles.formInput}
              required
            >
              <option value={0}>Kies een locatie</option>
              {venues.map(venue => (
                <option key={venue.venueId} value={venue.venueId}>
                  {venue.name}
                </option>
              ))}
            </select>
            <input
              type="datetime-local"
              name="dateAndTime"
              value={show.dateAndTime}
              onChange={handleInputChange}
              className={styles.formInput}
              required
            />
            <button type="submit" className={styles.addButton}>Bewerk Voorstelling</button>
          </form>
        </>
      )}
    </div>
  );
};

export default EditShow;
