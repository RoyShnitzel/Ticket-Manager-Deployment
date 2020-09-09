import React, { useState } from 'react';

function SearchInput(props) {
  const onSearch = props.searchFunc;

  return (
    <div className="search">
      <i className="fa fa-search" />
      <input value={props.value} onChange={(e) => {onSearch(e.target.value); props.setValue(e.target.value)}} id="searchInput" />
    </div>
  );
}

export default SearchInput;
