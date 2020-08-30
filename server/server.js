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

app.get('/api/tickets', (request, response) => {
  const data = fs.readFileSync(path);
  const tickets = JSON.parse(data);

  if (request.query.searchText) {
    const queryParam = request.query.searchText.toLowerCase();
    const newTickets = tickets.filter((ticket) => {
      const filterTickets = ticket.title.toLowerCase();
      // filter by labels. checks if "#" is the first letter
      if (queryParam.indexOf('#') === 0) {
        if (!ticket.labels) {
          return false;
        }
        const filterLabels = ticket.labels.map((element) => element.toLowerCase());
        // check for every label in labels if it contains the queryParam
        return filterLabels.some((label) => label.includes(queryParam.replace('#', '')));
      }
      return filterTickets.includes(queryParam);
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

// Start the listener!
const listener = app.listen(port, () => {
  console.log("❇️ Express server is running on port", listener.address().port);
});