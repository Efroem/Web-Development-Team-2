import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios
import styles from './Deleteshows.module.css'; // Import the CSS Module

interface Show {
    theatreShowId: number;
    title: string;
    description: string;
    showMood: string;
    price: number;
    theatreShowDates: {
        theathershowid: number;
        dateAndTime: string;
    }[];
    venue: Venue;
}

interface Venue {
    venueId: number;
    name: string;
    capacity: number;
}

const Deleteshows: React.FC = () => {
    const [shows, setShows] = useState<Show[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTheatreShows = async () => {
            try {
                const response = await axios.get<Show[]>('http://localhost:5097/api/v1/TheatreShows');
                setShows(response.data); 
            } catch (error: any) {
                setError("Er is een fout opgetreden bij het ophalen van de voorstellingen. Probeer het later opnieuw.");
            } finally {
            }
        };

        fetchTheatreShows(); 
    }, []); 

    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm("Weet je zeker dat je deze voorstelling wilt verwijderen?");
        
        if (!confirmDelete) {
            return;
        }

        try {            
            const response = await axios.delete(`http://localhost:5097/api/v1/TheatreShows/${id}`);
            setShows(shows.filter(show => show.theatreShowId !== id));
        } catch (error: any) {
            setError("Fout bij het verwijderen van de voorstelling: " + error.message);
        }
    };

    if (error) {
        return <div className={styles.error}>Fout: {error}</div>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.header}>Theatervoorstellingen</h1>
            {shows.length === 0 ? (
                <p className={styles.noShows}>Geen voorstellingen beschikbaar</p>
            ) : (
                <ul className={styles.list}>
                    {shows.map((show) => (
                        <li key={show.theatreShowId} className={styles.showItem}>
                            <h2 className={styles.showItemTitle}>{show.title}</h2>
                            <p className={styles.showItemDetails}>{show.description}</p>
                            <p className={styles.showItemDetails}>Prijs: €{show.price}</p>
                            <p className={styles.showItemDetails}>Locatie: {show.venue ? show.venue.name : 'Niet beschikbaar'}</p>
                            <ul className={styles.nestedList}>
                                {show.theatreShowDates?.map((date) => (
                                    <li key={date.theathershowid} className={styles.nestedItem}>
                                        <p className={styles.nestedItemDetails}>Datum: {new Date(date.dateAndTime).toLocaleString()}</p>
                                    </li>
                                ))}
                            </ul>
                            <button 
                                className={styles.deleteButton} 
                                onClick={() => handleDelete(show.theatreShowId)}
                            >
                                Verwijderen
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Deleteshows;
