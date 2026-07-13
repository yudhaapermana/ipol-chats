import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const IsiTimeline = ({ Data, Show, Title }) => {
  const [maxPerColumn, setMaxPerColumn] = useState(10);

  const handlePageResizedData = () => {
    let mx = 10;
    if (window.innerWidth >= 2330) mx = 10;
    else if (window.innerWidth >= 2106) mx = 9;
    else if (window.innerWidth >= 1882) mx = 8;
    else if (window.innerWidth >= 1658) mx = 7;
    else if (window.innerWidth >= 1435) mx = 6;
    else if (window.innerWidth >= 1210) mx = 5;
    else if (window.innerWidth >= 954) mx = 4;
    else if (window.innerWidth >= 730) mx = 3;
    else if (window.innerWidth >= 506) mx = 2;
    else mx = 1;
    console.log(maxPerColumn, window.innerWidth);

    setMaxPerColumn(mx);
  };
  useEffect(() => {
    handlePageResizedData();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handlePageResizedData);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handlePageResizedData);
      }
    };
  }, []);
  let arrY = [];
  for (let ix = 1; ix < maxPerColumn; ix++) {
    arrY.push(ix);
  }
  return (
    <>
      {Show && Data && Data.length > 0 && (
        <div className="hori-timeline position-relative" dir="ltr">
          <span className={`ribbon1 ${Title || 'd-none'}`}>
            <span>{Title}</span>
          </span>
          <div class="containerTimeline events" style={{ 'justify-content': maxPerColumn == 1 ? 'center' : 'left' }}>
            {Data &&
              Data.map((d, x) => {
                if (x < maxPerColumn) {
                  return (
                    <div className="itemTimeline" style={{ width: '13rem', textAlign: 'center' }}>
                      <h6>{d.Value}</h6>
                      <h7>{d.Text.split('\n')[0]}</h7>
                      <h6>{d.Text.split('\n')[1]}</h6>
                    </div>
                  );
                }
              })}
          </div>
          {Data &&
            Data.map((d, x) => {
              if (x >= maxPerColumn) {
                return (
                  <div class="containerTimeline " style={{ 'justify-content': maxPerColumn == 1 ? 'center' : 'left' }}>
                    {arrY.map(y => (
                      <div className="" style={{ width: '13rem', textAlign: 'center' }}>
                        <h6></h6>
                        <h7></h7>
                        <h6></h6>
                      </div>
                    ))}
                    <div className="itemTimeline" style={{ width: '13rem', textAlign: 'center' }}>
                      <h6>{d.Value}</h6>
                      <h7>{d.Text.split('\n')[0]}</h7>
                      <h6>{d.Text.split('\n')[1]}</h6>
                    </div>
                  </div>
                );
              }
            })}
          <ul className="list-inline events" style={{ display: 'none' }}>
            {Data &&
              Data.map(d => (
                <li className="list-inline-item event-list">
                  <div className="px-1">
                    <h6>{d.Value}</h6>
                    <h6>{d.Text.split('\n')[0]}</h6>
                    <h6>{d.Text.split('\n')[1]}</h6>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      )}
    </>
  );
};
IsiTimeline.propTypes = {
  Data: PropTypes.string.isRequired,
  Show: PropTypes.node.isRequired
};
export default IsiTimeline;
