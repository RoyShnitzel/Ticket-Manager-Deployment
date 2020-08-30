/* eslint-disable no-param-reassign */
const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.static('/build/index.html'));

app.get('/api/tickets', (request, response) => {
  const data = fs.readFileSync('./data.json');
  const tickets = JSON.parse(data);

  if (request.query.searchText) {
    const queryParam = request.query.searchText.toLowerCase();
    const newTickets = tickets.filter((ticket) => {
      const filteredTicket = ticket.title.toLowerCase();
      // filter by labels. checks if "#" is the first letter
      if (queryParam.indexOf('#') === 0) {
        const labelQueryParam = queryParam.replace('#', '');
        if (!ticket.labels) {
          return false;
        }
        // check for every label in labels if it contains the queryParam
        return ticket.labels.some((label) => label.toLowerCase().includes(labelQueryParam));
      }
      return filteredTicket.includes(queryParam);
    });
    response.send(newTickets);
  } else {
    response.send(tickets);
  }
});

app.post('/api/tickets/:ticketId/:done', (request, response) => {
  const data = fs.readFileSync('./data.json');
  const tickets = JSON.parse(data);
  const doneTickets = tickets.map((ticket) => {
    if (ticket.id === request.params.ticketId) {
      if (request.params.done === 'undone') {
        ticket.done = false;
        response.send(ticket);
        return ticket;
      }
      ticket.done = true;
      response.send(ticket);
      return ticket;
    }
    return ticket;
  });
  const doneTicketsJson = JSON.stringify(doneTickets);
  fs.writeFile('data.json', doneTicketsJson, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });
});

app.post('/api/tickets/favorite/:ticketId/:favorite', (request, response) => {
  const data = fs.readFileSync('./data.json');
  const tickets = JSON.parse(data);
  const favoriteTickets = tickets.map((ticket) => {
    if (ticket.id === request.params.ticketId) {
      if (request.params.favorite === 'true') {
        delete ticket.favorite;
        response.send(ticket);
        return ticket;
      }
      ticket.favorite = true;
      response.send(ticket);
      return ticket;
    }
    return ticket;
  });
  const favoriteTicketsJson = JSON.stringify(favoriteTickets);
  fs.writeFile('data.json', favoriteTicketsJson, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });
});

module.exports = app;
