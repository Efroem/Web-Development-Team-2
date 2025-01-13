import React from 'react';
import axios from 'axios';

export const searchReservations = async (showId: number = -1, 
                                  dateTime: string = "",
                                  email: string = "",
                                  reservationId: number = -1) => {
  try {
    let response: { data: Object[] } | null = null; // Explicitly type the response
    let requestStr = `http://localhost:5097/api/v1/ReservationManagement?`
    if (showId !== -1) {
        requestStr += `showId=${showId}&`
    }
    if (dateTime !== "") {
        requestStr += `dateTime=${dateTime}&`
    }
    if (email !== "") {
        requestStr += `email=${email}&`
    }
    if (reservationId !== -1) {
        requestStr += `reservationId=${reservationId}&`
    }


    response = await axios.get(requestStr);
    console.log(response)
    if (response != null) {
      return response.data
    }
    return []

  } catch (error) {
    console.error('Error fetching Reservations:', error);
    return []
  }
  
};