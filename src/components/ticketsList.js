import React from 'react';
import Ticket from './ticket';
import InfiniteScroll from 'react-infinite-scroll-component';

function TicketsList(props) {
  function makeTicketsList(data) {
    const list = data.map((ticket) => (
      <Ticket
        doneFunc={props.doneFunc}
        favoriteFunc={props.favoriteFunc}
        hideFunc={props.hideFunc}
        className="ticket"
        key={ticket.id}
        ticketData={ticket}
      />
    ));
    return list;
  }
  const ticketListData = props.TicketListData;

function handleLoad () {
  props.loadMore()
  console.log(props.hasMore)
}

  return (
    <div>
      {props.display !== false?
      <div className="ticketlist">
      {console.log(ticketListData)}
      {makeTicketsList(ticketListData)}
      </div>
      :
      <InfiniteScroll
      dataLength={ticketListData.length}
      next={handleLoad}
      hasMore={props.hasMore}
      loader={<h4>Loading...</h4>}
      className="ticketlist"
      endMessage={
        <p style={{ textAlign: "center" }}>
          <b>Yay! You have seen it all</b>
        </p>
      }
      >
      {makeTicketsList(ticketListData)}
      </InfiniteScroll>}
    </div>
  );
}

export default TicketsList;
