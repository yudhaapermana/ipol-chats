import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import AppContext from 'context/Context';
import PropTypes from 'prop-types';
import { NavLink, useLocation } from 'react-router-dom';
import NavbarVerticalMenuItem from './NavbarVerticalMenuItem';
import { Collapse, Nav } from 'react-bootstrap';

const NavbarVerticalHdrcard = ({ route, no }) => {
  const [buka, setBuka] = useState(false);

  useEffect(() => {
    if (no == 0) {
      setBuka(true);
    }
  }, []);

  return (
    <div className="card ms-5 me-1" key={`DV${route.Id}`}>
      <div
        onClick={event => {
          setBuka(!buka);
          event.preventDefault();
        }}
        className="card-header p-2 border-bottom"
        aria-controls={route.Id}
        aria-expanded={buka}
      >
        <h6 className="mb-0">{`${route.name}`}</h6>
      </div>
      <Collapse in={buka}>
        <div id={route.Id}>
          <div className="card-body  p-1 collapse show">
            <div className="row text-center gx-0 gy-0">
              {route.children.map(menu => (
                <NavbarVerticalMenuItem route={menu} key={menu.Id} />
              ))}
            </div>
          </div>
        </div>
      </Collapse>
    </div>
  );
};

export default React.memo(NavbarVerticalHdrcard);
