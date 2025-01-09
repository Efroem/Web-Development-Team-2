import React, { useRef, useState } from 'react';
import { sortShows } from './ShowSorter';

interface Show {
  title: string;
  description: string;
  showMood: string;
  price: number;
  theatreShowDates: {
    dateAndTime: string
  } []
}

export type AppState = {

  currentId:number
  updateName: (name:string) => (state:AppState) => AppState
  updateAge: (age:number) => (state:AppState) => AppState,
  insertPerson: (state:AppState) => AppState,
  showMessage: boolean
}

const WeeklyShows: React.FC<{ shows: Show[] }> = ({ shows }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("")
  const [sortTerm, setFilterTerm] = useState("")
  const [filterMonth, setFilterMonth] = useState("")

  const scrollLeft = () => {
    const container = document.querySelector('.shows-grid');
    if (container) {
      container.scrollBy({
        left: -container.clientWidth, // left scroll fix cuz it was fucked for some reason
        behavior: 'smooth',
      });
    }
  };
  
  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  let filteredShows: Show[] = []

  // const sortedAscending = [...shows].sort((a, b) => {
  //   if (a.title.toLowerCase() < b.title.toLowerCase()) return -1;
  //   if (a.title.toLowerCase() > b.title.toLowerCase()) return 1;
  //   return 0;
  // });
  
  // Sort by name descending (Z to A)


  filteredShows = shows.filter((show) =>
    show.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    show.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filterMonth != "") {
    filteredShows = filteredShows.filter((show) => {
      // Get the earliest date from the theatreShowDates array
      const earliestDate = show.theatreShowDates
        .map((date) => new Date(date.dateAndTime))
        .sort((a, b) => a.getTime() - b.getTime())[0]; // Get the earliest date
  
      // Check if the earliest date's month matches the filterMonth
      const earliestMonth = new Intl.DateTimeFormat("en-US", { month: "long" }).format(earliestDate);
  
      return earliestMonth === filterMonth;
    });
  }
  

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
      // Fallback if no valid case is matched
      sortField = 'title';
      sortOrder = 'ascending';
      break;
  }
  
  // Apply the sorting
  filteredShows = sortShows(filteredShows, sortField, sortOrder);
  
    

  return (
    <section className="weekly-shows">
      <h2>Onze Shows</h2>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search shows..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Update search term
        />
      </div>
      <div className="filterMonth">
        <select
          onChange={(e) => setFilterMonth(e.target.value)}
        >
          <option value=""> Select a month </option>
          <option value="January"> January</option>
          <option value="February"> February</option>
          <option value="March"> March</option>
          <option value="April"> April</option>
          <option value="May"> May</option>
          <option value="June"> June</option>
          <option value="July"> July</option>
          <option value="August"> August</option>
          <option value="September"> September</option>
          <option value="October"> October</option>
          <option value="November"> November</option>
          <option value="December"> December</option>
        </select>
      </div>
      <div className="filterType">
        <select
          onChange={(e) => setFilterTerm(e.target.value)}
        >
          <option value=""> Sort by</option>
          {/* <option value="Month"> Month</option> */}
          <option value="A-Z"> A-Z</option>
          <option value="Z-A"> Z-A</option>
          <option value="Price Ascending"> Price Ascending</option>
          <option value="Price Descending"> Price Descending</option>
          <option value="Date Ascending"> Date Ascending</option>
          <option value="Date descending"> Date Descending</option>
        </select>
      </div>

      <div className="scroll-container">
        <button className="scroll-button left" onClick={scrollLeft}>
          &#8249;
        </button>
        <div className="shows-grid" ref={scrollRef}>
        {filteredShows.map((show, index) => (
            <div className="show-card" key={index}>
              <h3>{show.title}</h3>
              <p>{show.description}</p>
              <p>{show.price}</p>
              {Array.isArray(show.theatreShowDates) && show.theatreShowDates.length > 0 && (
              
              <p>
                Earliest Date: <br />
                {
                  // Sort the dates in ascending order (earliest first)
                  show.theatreShowDates
                    .sort((a, b) => new Date(a.dateAndTime).getTime() - new Date(b.dateAndTime).getTime())
                    .map((date, index) => index === 0 && <span key={date.dateAndTime}>{date.dateAndTime}</span>) // Only show the earliest date
                }
              </p>
            )}

            </div>
          ))}
        </div>
        <button className="scroll-button right" onClick={scrollRight}>
          &#8250;
        </button>
      </div>
    </section>
  );
};

export default WeeklyShows;
