/* eslint-disable no-undef */
/* eslint-disable no-param-reassign */
const express = require('express');
const fs = require('fs');

const app = express();
const path = './data.json';
function checkHttps(request, response, next) {
  // Check the protocol — if http, redirect to https.
  if (request.get("X-Forwarded-Proto").indexOf("https") != -1) {
    return next();
  } else {
    response.redirect("https://" + request.hostname + request.url);
  }
}

app.all("*", checkHttps)
app.use(express.static('/build/index.html'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

function uniqueid() {
  let idstr = String.fromCharCode(Math.floor((Math.random() * 25) + 65));
  do {
    const ascicode = Math.floor((Math.random() * 42) + 48);
    if (ascicode < 58 || ascicode > 64) {
      idstr += String.fromCharCode(ascicode);
    }
  } while (idstr.length < 32);
  newId = idstr;
  return newId;
}

app.get('/api/tickets', (request, response) => {
  const data = fs.readFileSync(path);
  const tickets = JSON.parse(data);
  const { page } = request.query;
  const { limit } = request.query;
  const { sort } = request.query;
  tickets.sort((a, b) => (sort === 'true' ? a.creationTime - b.creationTime : b.creationTime - a.creationTime));
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const pagedTickets = tickets.slice(startIndex, endIndex);

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
    const newPagedTickets = newTickets.slice(startIndex, endIndex);
    response.send(page === '0' || page === undefined ? newTickets : newPagedTickets);
  } else {
    response.send(page === '0' || page === undefined ? tickets : pagedTickets);
  }
});

app.post('/api/tickets/:ticketId/:done', (request, response) => {
  const data = fs.readFileSync(path);
  const tickets = JSON.parse(data);
  const doneTickets = tickets.map((ticket) => {
    if (ticket.id === request.params.ticketId) {
      if (request.params.done === 'true') {
        delete ticket.done;
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
  fs.writeFile(path, doneTicketsJson, (err) => {
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

app.post('/addticket', ((request, response) => {
  const data = fs.readFileSync('./data.json');
  newAllTickets = JSON.parse(data);
  console.log(request.body);
  const newTicket = request.body;
  newTicket.id = uniqueid();
  newAllTickets.push(newTicket);
  fs.writeFile('./data.json', JSON.stringify(newAllTickets), (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });
  response.send('Submitted');
}));

let port;
console.log("❇️ NODE_ENV is", process.env.NODE_ENV);
if (process.env.NODE_ENV === "production") {
  port = process.env.PORT || 3000;
  app.use(express.static(path.join(__dirname, "../build")));
  app.get("*", (request, response) => {
    response.sendFile(path.join(__dirname, "../build", "index.html"));
  });
  } else {
      port = 3001;
      console.log("⚠️ Not seeing your changes as you develop?");
      console.log(
        "⚠️ Do you need to set 'start': 'npm run development' in package.json?"
      );
    }
  const listener = app.listen(port, () => {
      console.log("❇️ Express server is running on port", listener.address().port);
    });
