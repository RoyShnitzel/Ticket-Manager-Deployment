import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import TicketsList from './components/ticketsList';
import SearchInput from './components/searchInput';

function App() {
  const [tickets, setTickets] = useState([]);
  const [displayFavorites, setDisplayFavorites] = useState(false);
  async function getTicketsFromServer() {
    const { data } = await axios.get('/api/tickets').catch(() => {
      alert('Tickets Do Not Exist');
    });
    setTickets(data);
  }
  useEffect(() => {
    getTicketsFromServer();
  }, []);

  async function searchFunc(val) {
    const codedVal = encodeURIComponent(val);
    const { data } = await axios.get(`/api/tickets?searchText=${codedVal}`);
    setTickets(data);
    setDisplayFavorites(false);
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

  function favoriteTicket(id) {
    setTickets((prevTickets) => {
      const newTickets = prevTickets.map((ticket) => {
        if (ticket.id === id) {
          ticket.favorite = true;
          return ticket;
        }
        return ticket;
      });
      return newTickets;
    });
  }

  function unFavoriteTicket(id) {
    setTickets((prevTickets) => {
      const newTickets = prevTickets.map((ticket) => {
        if (ticket.id === id) {
          ticket.favorite = false;
          return ticket;
        }
        return ticket;
      });
      return newTickets;
    });
  }

  function handleFavorite(id, favorite) {
    if (favorite) {
      unFavoriteTicket(id);
    } else {
      favoriteTicket(id);
    }
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

  const displayedTickets = tickets.filter((ticket) => !ticket.hide);
  const favoriteTickets = displayedTickets.filter((ticket) => Boolean(ticket.favorite));
  const hideCounter = tickets.length - displayedTickets.length;
  const results = tickets.length;
  const favoriteResults = favoriteTickets.length;

  return (
    <main className="app">
      <div className="navbar">
        <h1>Tickets Manager</h1>
        <SearchInput func={searchFunc} />
        <button
          className="favoritesDisplay"
          onClick={() => setDisplayFavorites((prevFavorite) => !prevFavorite)}
        >
          {displayFavorites ? (
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
      </div>
      {hideCounter > 0 ? (
        <div className="hideTicketsCounter">
          <span>
            Showing
            {' '}
            <b>{displayFavorites ? favoriteResults : results}</b>
            {' '}
            Results
            {' '}
          </span>
          <span>(</span>
          <span id="hideTicketsCounter">
            <b>{hideCounter}</b>
          </span>
          <span> Hidden Tickets)</span>
          <button id="restoreHideTickets" onClick={() => restoreTickets()}>
            restore
            {' '}
            <i className="fa fa-undo" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <div className="hideTicketsCounter">
          Showing
          {' '}
          <b>{displayFavorites ? favoriteResults : results}</b>
          {' '}
          Results
        </div>
      )}
      <TicketsList
        data={displayFavorites ? favoriteTickets : displayedTickets}
        hideFunc={hideTicket}
        favoriteFunc={handleFavorite}
      />
    </main>
  );
}

export default App;
