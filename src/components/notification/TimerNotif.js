import React, { useEffect, useState } from 'react';

const TimerNotif = ({ expTime }) => {
  const [display, setDisplay] = useState('');
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const [hours, minutes, seconds] = expTime.split(':').map(Number);

      const target = new Date();
      target.setHours(hours, minutes, seconds, 0);

      const diff = target - now;
      const isOver = diff < 0;
      const absDiff = Math.abs(diff);

      const h = Math.floor(absDiff / 3600000);
      const m = Math.floor((absDiff % 3600000) / 60000);
      const s = Math.floor((absDiff % 60000) / 1000);

      const timeString = `${isOver ? '-' : ''}${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

      setDisplay(timeString);
      setIsPast(isOver);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [expTime]);

  return (
    <div className={`bg-danger text-white rounded-2 p-2`}>
      <p className="fw-bold fs-9 m-0">{display}</p>
    </div>
    // <div className={`${isPast ? 'bg-danger' : 'bg-primary'} text-white rounded-2 p-2`}>
    //   <p className="fw-bold fs-8 m-0">{display}</p>
    // </div>
  );
};

export default TimerNotif;
