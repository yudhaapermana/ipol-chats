import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Flex from 'components/common/Flex';
import SoftBadge from 'components/common/SoftBadge';
import { Link } from 'react-router-dom';

const NavbarVerticalMenuItem = ({ route }) => {
  let gbr = '';
  if (route.kdicon == 'H') {
    gbr = (
      <Link
        className="d-block hover-bg-200 px-1 py-1 pb-1 rounded-3 text-center text-decoration-none h-100"
        to={route.to}
      >
        <div className="avatar avatar-xl pt-1">
          <div className="avatar-name rounded-circle bg-soft-primary text-primary">
            <span className="fs-6">{route.icon}</span>
          </div>
        </div>
        <p className="mb-0 fw-medium text-800 text-truncate text-wrap fs-11 pt-1">
          {route.name}
        </p>
      </Link>
    );
  } else if (route.kdicon == 'I') {
    let css = `${route.icon} text-success fs-6 pt-1`;
    gbr = (
      <Link
        className="d-block hover-bg-200 px-1 py-1 pb-2 rounded-3 text-center text-decoration-none h-100"
        to={route.to}
      >
        <span className={css}></span>;
        <p className="mb-0 fw-medium text-800 text-truncate text-wrap fs-11 pt-0">
          {route.name}
        </p>
      </Link>
    );
  } else {
    gbr = (
      <Link
        className="d-block hover-bg-200 px-1 py-2 pb-2 rounded-3 text-center text-decoration-none h-100"
        to={route.to}
      >
        <img
          width="26"
          height="26"
          className="rounded"
          src={route.icon}
          alt=""
        ></img>
        <p className="mb-0 fw-medium text-800 text-truncate text-wrap fs-11 pt-2">
          {route.name}
        </p>
      </Link>
    );
  }

  //console.log(route.icon);

  return (
    <>
      {!route.isdetail ? (
        <Flex alignItems="center">
          {route.icon && route.level == 1 && (
            <span className="nav-link-icon pe-0 me-0">
              <FontAwesomeIcon icon={route.icon} />
            </span>
          )}
          {route.level == 1 ? (
            // <span className="nav-link-text ps-0 ms-0">{route.name}</span>
            <h6 className="nav-link-text mb-0 ps-0 ms-0">{route.name}</h6>
          ) : (
            // <span className="nav-link-text ps-2">{route.name}</span>
            <h6 className="nav-link-text mb-1 ps-2">{route.name}</h6>
          )}

          {route.badge && (
            <SoftBadge pill bg={route.badge.type} className="ms-2">
              {route.badge.text}
            </SoftBadge>
          )}
        </Flex>
      ) : (
        <div className="col-4">
          {/* <Link
            className="d-block hover-bg-200 px-2 py-3 rounded-3 text-center text-decoration-none h-100"
            to={route.to}
          > */}
          {/* <div class="bg-white dark__bg-1100 p-1 pt-2 h-100"> */}
          {/* <img
              width="25"
              height="25"
              className="rounded"
              src="https://erp.indopoly.co.id/imagesrv/IT/Icon/apps.png"
              alt=""
            ></img> */}
          {/* <span class="fas fa-bell text-success fs-3"></span> */}
          {/* <div class="avatar avatar-2xl">
              <div class="avatar-name rounded-circle bg-soft-primary text-primary">
                <span class="fs-2">E</span>
              </div>
            </div> */}

          {/* <p class="mb-0 fw-medium text-800 text-truncate text-wrap fs--2 pt-1">
              {route.name}
            </p> */}
          {/* <h6 class="mb-1 text-primary"></h6> */}
          {/* </div> */}
          {/* </Link> */}
          {gbr}
        </div>
      )}
    </>
  );
};

// prop-types
const routeShape = {
  active: PropTypes.bool,
  name: PropTypes.string.isRequired,
  to: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.array, PropTypes.string])
};
routeShape.children = PropTypes.arrayOf(PropTypes.shape(routeShape));
NavbarVerticalMenuItem.propTypes = {
  route: PropTypes.shape(routeShape).isRequired
};

export default React.memo(NavbarVerticalMenuItem);
