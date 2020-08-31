import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import TicketsList from './components/ticketsList';
import SearchInput from './components/searchInput';
import NewTicketPopUp from './components/newTicket';

function App() {
  const [tickets, setTickets] = useState([]);
  const [displayFavorites, setDisplayFavorites] = useState(false);
  const [popUp, setPopUp] = useState(false);
  const [sort, setSort] = useState(true);
  const [displayDone, setDisplayDone] = useState(false);
  async function getTicketsFromServer() {
    const { data } = await axios.get('/api/tickets')
    data.sort((a, b) => (b.creationTime - a.creationTime));
    setTickets(data);
  }
  useEffect( () => {
    getTicketsFromServer();
  }, []);

  async function searchFunc(val) {
    const codedVal = encodeURIComponent(val);
    const { data } = await axios.get(`/api/tickets?searchText=${codedVal}`);
    data.sort((a, b) => (b.creationTime - a.creationTime));
    setTickets(data);
    setDisplayFavorites(false);
    setDisplayDone(false)
  }

  function hideTicket(id) {
    setTickets((prevTickets) => {
      const newTickets = prevTickets.map((ticket) => {
        if (ticket.id === id) {
          ticket.hide = true;
          return ticket;
        }
        return ticket;
      });
      return newTickets;
    });
  }

  function favoriteTicket(id, favorite) {
    setTickets((prevTickets) => {
      const newTickets = prevTickets.map((ticket) => {
        if (ticket.id === id) {
          if (favorite){
          ticket.favorite = false;
          axios.post(`/api/tickets/favorite/${ticket.id}/${favorite}`)
          return ticket;
          }
          axios.post(`/api/tickets/favorite/${ticket.id}/${favorite}`)
          ticket.favorite = true;
          return ticket;
        }
        return ticket;
      });
      return newTickets;
    });
  }

  function doneTicket(id, done) {
    setTickets((prevTickets) => {
      const newTickets = prevTickets.map((ticket) => {
        if (ticket.id === id) {
          if (done){
          ticket.done = false;
          axios.post(`/api/tickets/${ticket.id}/${done}`)
          return ticket;
          }
          axios.post(`/api/tickets/${ticket.id}/${done}`)
          ticket.done = true;
          return ticket;
        }
        return ticket;
      });
      return newTickets;
    });
  }

  function restoreTickets() {
    setTickets((prevTickets) => {
      const newTickets = prevTickets.map((ticket) => {
        ticket.hide = false;
        return ticket;
      });
      return newTickets;
    });
  }

  function sortTicketsByDate() {
    const ticketsClone = tickets.slice();
    ticketsClone.sort((a, b) => (sort ? a.creationTime - b.creationTime : b.creationTime - a.creationTime));
    setTickets(ticketsClone);
    setSort(!sort);
  };

  const displayedTickets = tickets.filter((ticket) => !ticket.hide);
  const favoriteTickets = displayedTickets.filter((ticket) => Boolean(ticket.favorite));
  const doneTickets = displayedTickets.filter((ticket) => Boolean(ticket.done));
  const hideCounter = tickets.length - displayedTickets.length;
  const results = tickets.length;
  const favoriteResults = favoriteTickets.length;
  const doneResults = doneTickets.length;

  return (
    <main className="app">
      <div className="navbar">
        <h1>Tickets Manager</h1>
        <SearchInput func={searchFunc} />
        <button
          className="favoritesDisplay"
          onClick={() => setDisplayFavorites((prevdisplay)=>{if (prevdisplay ==='favorite'){ return false} return 'favorite'})}
        >
          {displayFavorites === 'favorite'? (
            <>
              <i className="fa fa-star fa-2x" />
              <span className="toolTipFavorite">Display All</span>
            </>
          ) : (
            <>
              <i className="fa fa-star-o fa-2x" />
              <span className="toolTipFavorite">Display Favorites</span>
            </>
          )}
        </button>
        <button
          className="doneDisplay"
          onClick={() => setDisplayFavorites((prevdisplay)=>{if (prevdisplay ==='done'){ return false} return 'done'})}
        >
          {displayFavorites === 'done' ? (
            <>
              <i className="fa fa-minus-square fa-2x" />
              <span className="toolTipFavorite">Display All Tickets</span>
            </>
          ) : (
            <>
              <i className="fa fa-check-square fa-2x" />
              <span className="toolTipFavorite">Display Done Tickets</span>
            </>
          )}
        </button>
        <button onClick={()=>setPopUp(true)} className='newTicketButton'><i class="fa fa-plus-square fa-2x" aria-hidden="true"/>
        <span className="toolTipFavorite">Add New Ticket</span></button>
        <button onClick={()=> sortTicketsByDate() } className="sortButton"><i class="fa fa-calendar fa-2x" aria-hidden="true"/>
        <span className="toolTipFavorite">{sort? 'Sort By Latest Date':'Sort by Date'}</span></button>
      </div>
      {popUp? <NewTicketPopUp func={setPopUp} setTickets={setTickets}/>:null}
        <div className="hideTicketsCounter">
          <span>
            Showing
            {' '}
            <b>{displayFavorites !== false ? displayFavorites === 'favorite'? favoriteResults: doneResults : results}</b>
            {' '}
            Results
            {' '}
          </span>
          {hideCounter > 0 ? (
          <>(
          <span id="hideTicketsCounter">
            <b>{hideCounter}</b>
          </span>
          {' '}
          Hidden Tickets)
          <button id="restoreHideTickets" onClick={() => restoreTickets()}>
            restore
            {' '}
            <i className="fa fa-undo" aria-hidden="true" />
          </button>
          </>
          ) :(null)}
        </div>
      <TicketsList
        TicketListData={displayFavorites !== false ? displayFavorites==='favorite'? favoriteTickets: doneTickets : displayedTickets}
        hideFunc={hideTicket}
        favoriteFunc={favoriteTicket}
        doneFunc={doneTicket}
      />
    </main>
  );
}

export default App;
