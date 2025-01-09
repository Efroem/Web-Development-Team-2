import React, { useRef, useState } from 'react';

interface Show {
    title: string;
    description: string;
    showMood: string;
    price: number;
    theatreShowDates: {
      dateAndTime: string
    } []
  }

// Define the sorting function with a specific key type for 'field'
export const sortShows = (shows: Show[], field: keyof Show, order: 'Ascending' | 'Descending') => {
    return [...shows].sort((a, b) => {
      let aValue = a[field];
      let bValue = b[field];
  
      // Convert to lowercase for case-insensitive string comparisons
      if (typeof aValue === "string" && typeof bValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
  
      if (order === 'Ascending') {
        if (aValue < bValue) return -1;
        if (aValue > bValue) return 1;
      } else { // descending
        if (aValue > bValue) return -1;
        if (aValue < bValue) return 1;
      }
  
      return 0;
    });
};
  
  // Example of how to use it:
//   let filteredShows = shows.filter((show) =>
//     show.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     show.description.toLowerCase().includes(searchTerm.toLowerCase())
//   );
  
//   if (filterTerm !== "") {
//     if (filterMonth !== "") {
//       filteredShows = filteredShows.filter((show) =>
//         show.theatreShowDates.some((date) =>
//           new Intl.DateTimeFormat("en-US", { month: "long" }).format(new Date(date.dateAndTime)) === filterMonth
//         )
//       );
//     }
  
    // // Apply sorting based on selected field and order
    // const sortField: keyof Show = "title";  // Can be "title", "description", or "price"
    // const sortOrder: 'ascending' | 'descending' = "descending";  // Can be "ascending" or "descending"
    
    // filteredShows = sortShows(filteredShows, sortField, sortOrder);
