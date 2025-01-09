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
  const [sortAscending, setSortAscending] = useState("")
  const [sortOrder, setSortOrder] = useState("")

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

  if (filterMonth != "" ) {
    filteredShows = filteredShows.filter((show) =>
      show.theatreShowDates.some((date) =>
        new Intl.DateTimeFormat("en-US", { month: "long" }).format(new Date(date.dateAndTime)) == filterMonth
      )
    );
  }

  if (sortTerm != "") {
    
    let sortField = ''
    let sortOrder = ''
    switch (sortTerm) {
      case "A-Z":
        sortField = 'price'

    }
  
    // if (sortAscending === "Descending") {
    //   filteredShows = [...filteredShows].sort((a, b) => {
    //     if (a.title.toLowerCase() > b.title.toLowerCase()) return -1;
    //     if (a.title.toLowerCase() < b.title.toLowerCase()) return 1;
    //     return 0;
    //   });
    // }
  }
  

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
          <option value="Date descending"> Date</option>
        </select>
      </div>

      


      <div className="sortOrder">
        <select
          onChange={(e) => setSortAscending(e.target.value)}
        >
          <option value="Ascending"> Ascending</option>
          <option value="Descending"> Descending</option>
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
              {Array.isArray(show.theatreShowDates) && show.theatreShowDates.length != 0 && (
                <p>{show.theatreShowDates[0].dateAndTime}</p>
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
