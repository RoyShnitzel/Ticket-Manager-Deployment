import React from 'react';
import Label from './label';

function Ticket(props) {
  const data = props.ticketData;
  const labelData = data.labels;
  const ticketId = data.id;
  const time = new Date(data.creationTime);
  const newTime = time.toUTCString().replace('GMT', '').slice(4);
  const { favorite } = data;

  return (
    <div className="ticket">
      <button className="favoriteButton" onClick={() => props.favoriteFunc(ticketId, favorite)}>
        {favorite ? <i className="fa fa-star" aria-hidden="true" /> : <i className="fa fa-star-o" />}
      </button>
      <div className="flexheader">
        <div className="ticketheader"><b>{data.title}</b></div>
        <button className="hideTicketButton" id="hideTicketButton" onClick={() => props.hideFunc(ticketId)}>
          <i className="fa fa-eye-slash fa-lg" aria-hidden="true" />
        </button>
      </div>
      <div className="ticketbody">{data.content}</div>
      <div className="ticketFooter">
        <div className="emailAndTime">
          <span>
            {data.userEmail}
            {' '}
            |
          </span>
          <span>{newTime}</span>
        </div>
        {labelData !== undefined ? <Label className="label" label={labelData} /> : null}
      </div>
    </div>
  );
}

export default Ticket;
