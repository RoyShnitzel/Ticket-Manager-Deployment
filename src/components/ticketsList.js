import React from 'react';
import Ticket from './ticket';

function TicketsList(props) {
  function makeTicketsList(data) {
    const list = data.map((ticket) => (
      <Ticket
        favoriteFunc={props.favoriteFunc}
        hideFunc={props.hideFunc}
        className="ticket"
        key={ticket.id}
        ticketData={ticket}
      />
    ));
    return list;
  }
  const newData = props.data;
  return (
    <div className="ticketlist">
      {makeTicketsList(newData)}
    </div>
  );
}

export default TicketsList;
