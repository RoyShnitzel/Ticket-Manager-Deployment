/* eslint-disable no-param-reassign */
const express = require('express');
const fs = require('fs');

const app = express();
const path = './data.json';
function checkHttps(request, response, next) {
  // Check the protocol — if http, redirect to https.
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

app.post('/api/tickets/:ticketId/done', (request, response) => {
  const data = fs.readFileSync('./data.json');
  const tickets = JSON.parse(data);
  const doneTickets = tickets.map((ticket) => {
    if (ticket.id === request.params.ticketId) {
      ticket.done = true;
      response.send(ticket);
      return ticket;
    }
    return ticket;
  });
  const update = JSON.stringify(doneTickets);
  fs.writeFile('data.json', update);
  response.send(doneTickets);
});

app.post('/api/tickets/:ticketId/undone', (request, response) => {
  const data = fs.readFileSync('./data.json');
  const tickets = JSON.parse(data);
  const doneTickets = tickets.map((ticket) => {
    if (ticket.id === request.params.ticketId) {
      ticket.done = false;

      response.send(ticket);
      return ticket;
    }
    return ticket;
  });
  const update = JSON.stringify(doneTickets);
  fs.writeFile('data.json', update);
  response.send(doneTickets);
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
