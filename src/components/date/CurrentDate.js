import React, { useState } from 'react';

function getDate() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  return `${date}-${month}-${year}`;
}

const CurrentDate = () => {
  const [currentDate, setCurrentDate] = useState(getDate());
  return <label className="mb-0 p-0">{currentDate}</label>;
};
export default CurrentDate;
