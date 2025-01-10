import React, { useRef, useState } from 'react';
import axios from 'axios';

interface Show {
  title: string;
  description: string;
  showMood: string;
  price: number;
  theatreShowDates: {
    dateAndTime: string
  } []
  venue: Venue
}

interface Venue {
  venueId: number
  name: string
  capacity: number
}

// Define the sorting function with a specific key type for 'field'
export const sortShows = (shows: Show[], field: keyof Show, order: 'ascending' | 'descending') => {
  return [...shows].sort((a, b) => {
    let aValue: any, bValue: any;

    // Check if we're sorting by dates
    if (field === 'theatreShowDates') {
      // Get the earliest date for each show
      const aEarliestDate = a.theatreShowDates
        .map((date) => new Date(date.dateAndTime))
        .sort((date1, date2) => date1.getTime() - date2.getTime())[0]; // Get the earliest date
      const bEarliestDate = b.theatreShowDates
        .map((date) => new Date(date.dateAndTime))
        .sort((date1, date2) => date1.getTime() - date2.getTime())[0]; // Get the earliest date

      aValue = aEarliestDate;
      bValue = bEarliestDate;
    } else {
      // Handle sorting by other fields like title, description, price
      aValue = a[field];
      bValue = b[field];
    }

    // Convert to lowercase for case-insensitive string comparisons
    if (typeof aValue === "string" && typeof bValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    // Handle ascending/descending order
    if (order === 'ascending') {
      if (aValue < bValue) return -1;
      if (aValue > bValue) return 1;
    } else { // descending
      if (aValue > bValue) return -1;
      if (aValue < bValue) return 1;
    }

    return 0;
  });
};

export const fetchShowsInMonth = async (filterMonth: number): Promise<Show[]> => {
  try {
    const currentYear = new Date().getFullYear();
    const startDate = new Date(currentYear, filterMonth, 1, 0, 0, 0, 0); // first day of the current month in the current year
    const endDate = new Date(startDate);
    endDate.setMonth(filterMonth + 1); // Get the next month's date

    let response: { data: Show[] } | null = null; // Explicitly type the response

    if (filterMonth !== -1) {
      // Make sure the URL is valid and the date format matches the backend expectations
      response = await axios.get(`http://localhost:5097/api/v1/TheatreShows`, {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });
    } else {
      response = await axios.get('http://localhost:5097/api/v1/TheatreShows');
    }

    if (response != null) {
      return response.data; // Use setState inside useEffect to update state
    }
    return []

  } catch (error) {
    console.error('Error fetching shows:', error);
    return []
  }
};

export const applySorting = (filteredShows: Show[], 
                            searchTerm: string = "", 
                            searchVenue: string = "",
                            sortTerm: string = ""): Show[] => {
  let updatedShows = filteredShows;
  
    // Apply search term filter
    if (searchTerm) {
      updatedShows = updatedShows.filter((show) =>
        show.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        show.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply search venue filter
    if (searchVenue) {
      updatedShows = updatedShows.filter((show) => show.venue.name === searchVenue);
    }

    // Apply sorting
    let sortField: keyof Show = 'title'; // Default to 'title'
    let sortOrder: 'ascending' | 'descending' = 'ascending'; // Default to 'ascending'

    switch (sortTerm) {
      case "A-Z":
        sortField = 'title';
        sortOrder = 'ascending';
        break;
      case "Z-A":
        sortField = 'title';
        sortOrder = 'descending';
        break;
      case "Price Ascending":
        sortField = 'price';
        sortOrder = 'ascending';
        break;
      case "Price Descending":
        sortField = 'price';
        sortOrder = 'descending';
        break;
      case "Date Ascending":
        sortField = 'theatreShowDates'; // Special case for sorting by date
        sortOrder = 'ascending';
        break;
      case "Date Descending":
        sortField = 'theatreShowDates'; // Special case for sorting by date
        sortOrder = 'descending';
        break;
      default:
        sortField = 'title';
        sortOrder = 'ascending';
        break;
    }

    // Apply sorting logic
    updatedShows = sortShows(updatedShows, sortField, sortOrder);

    // Update state with filtered and sorted shows
    return updatedShows;
}

  
  // Example of how to use it:
  // let filteredShows = shows.filter((show) =>
  //   show.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   show.description.toLowerCase().includes(searchTerm.toLowerCase())
  // );
  
  // if (filterTerm !== "") {
  //   if (filterMonth !== "") {
  //     filteredShows = filteredShows.filter((show) =>
  //       show.theatreShowDates.some((date) =>
  //         new Intl.DateTimeFormat("en-US", { month: "long" }).format(new Date(date.dateAndTime)) === filterMonth
  //       )
  //     );
  //   }
  
  //   // Apply sorting based on selected field and order
  //   const sortField: keyof Show = "title";  // Can be "title", "description", or "price"
  //   const sortOrder: 'ascending' | 'descending' = "descending";  // Can be "ascending" or "descending"
    
  //   filteredShows = sortShows(filteredShows, sortField, sortOrder);
