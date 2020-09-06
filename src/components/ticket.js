import React from 'react';
import Label from './label';

function Ticket(props) {
  const data = props.ticketData;
  const labelData = data.labels;
  const ticketId = data.id;
  const time = new Date(data.creationTime);
  const newTime = time.toUTCString().replace('GMT', '').slice(4);
  const { favorite } = data;
  const { done } = data;

  return (
    <div className="ticket">
      <button className="favoriteButton" onClick={() => props.favoriteFunc(ticketId, favorite)}>
        {favorite ? <><i className="fa fa-star" aria-hidden="true" /><span className="toolTipFavorite">Remove From Favorites</span></> : 
        <><i className="fa fa-star-o" /><span className="toolTipFavorite">Add to Favorites</span></>}
      </button>
      <button className="doneButton" onClick={() => props.doneFunc(ticketId, done)}>
        {done ? <><i class="fa fa-minus-square" aria-hidden="true"/><span className="toolTipFavorite">Mark Ticket unDone</span></> : 
        <><i className="fa fa-check-square" aria-hidden="true"/><span className="toolTipFavorite">Mark Ticket Done</span></>}
      </button>
      <div className="flexheader">
        <div className="ticketheader"><b>{data.title}</b></div>
        <button className="hideTicketButton" id="hideTicketButton" onClick={() => props.hideFunc(ticketId)}>
          <div className='hideEye'><i className="fa fa-eye-slash fa-lg"/><span className="toolTipFavorite">Hide Ticket</span></div>
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
