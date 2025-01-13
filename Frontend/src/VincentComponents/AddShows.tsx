import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom'; // Zorg ervoor dat je useNavigate importeert
import styles from './Addshow.module.css'; 

interface Venue {
    venueId: number;
    name: string;
    capacity: number;
}

const AddShow: React.FC = () => {
    const [newShow, setNewShow] = useState({
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
    const navigate = useNavigate();

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewShow(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddShow = async (e: React.FormEvent) => {
        e.preventDefault();

        const price = parseFloat(newShow.price);
        if (isNaN(price)) {
            setFormError("Prijs moet een geldig getal zijn.");
            return;
        }

        const currentDate = new Date();
        const selectedDate = new Date(newShow.dateAndTime);
        if (selectedDate <= currentDate) {
            setFormError("De datum moet in de toekomst liggen.");
            return;
        }

        if (newShow.venueId === 0) {
            setVenueError("Selecteer een locatie.");
            return;
        } else {
            setVenueError(null); // Reset venue error if valid
        }

        // If no validation errors, proceed with the form submission
        const newShowData = {
            title: newShow.title,
            description: newShow.description,
            price: price,
            venue: { venueId: newShow.venueId },
            theatreShowDates: [{
                dateAndTime: newShow.dateAndTime
            }]
        };

        try {
            const response = await axios.post('http://localhost:5097/api/v1/TheatreShows', newShowData);
            alert("Voorstelling toegevoegd!");
            navigate("/dashboard");
        } catch (error: any) {
            setError("Fout bij het toevoegen van de voorstelling: " + error.message);
        }
    };

    if (error) {
        return <div className={styles.error}>Fout: {error}</div>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.header}>Nieuwe Voorstelling Toevoegen</h1>

            {formError && <div className={styles.formError}>{formError}</div>} 
            {venueError && <div className={styles.formError}>{venueError}</div>} 

            <form onSubmit={handleAddShow} className={styles.addForm}>
                <input
                    type="text"
                    name="title"
                    placeholder="Titel"
                    value={newShow.title}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    required
                />
                <textarea
                    name="description"
                    placeholder="Beschrijving"
                    value={newShow.description}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    required
                />
                <input
                    type="text"
                    name="price"
                    placeholder="Prijs"
                    value={newShow.price}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    required
                />
                <select
                    name="venueId"
                    value={newShow.venueId}
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
                    value={newShow.dateAndTime}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    required
                />
                <button type="submit" className={styles.addButton}>Voeg voorstelling toe</button>
            </form>
        </div>
    );
};

export default AddShow;
