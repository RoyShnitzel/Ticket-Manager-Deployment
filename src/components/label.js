import React from 'react';

function Label(props) {
  const data = props.label;

  const displayData = data.map((label) => (
    <span key={label} className="label1">
      #
      <span className="label">{label}</span>
    </span>
  ));
  return (
    <span>
      {displayData}
    </span>
  );
}

export default Label;
