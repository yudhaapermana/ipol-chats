import classNames from 'classnames';
import AppContext from 'context/Context';
import PropTypes from 'prop-types';
import React, { useContext, useState } from 'react';
import { Collapse, Nav } from 'react-bootstrap';
import { NavLink, useLocation } from 'react-router-dom';
import NavbarVerticalMenuItem from './NavbarVerticalMenuItem';
import NavbarVerticalHdrcard from './NavbarVerticalHdrcard';

const CollapseItems = ({ route }) => {
  const { pathname } = useLocation();

  const openCollapse = childrens => {
    const checkLink = children => {
      if (children.to === pathname) {
        return true;
      } else return false;
      //   return (
      //     Object.prototype.hasOwnProperty.call(children, 'children') &&
      //     children.children.some(checkLink)
      //   );
    };
    // return childrens.some(checkLink);
  };

  const [open, setOpen] = useState(openCollapse(route.children));
  const [seqno, setSeq] = useState(1);

  return (
    <>
      <Nav.Item as="li" key={route.Id}>
        <Nav.Link
          onClick={() => {
            setOpen(!open);
          }}
          className={classNames('dropdown-indicator cursor-pointer', {
            'text-500': !route.active
          })}
          aria-expanded={open}
          // {...route}
        >
          <NavbarVerticalMenuItem route={route} />
        </Nav.Link>
        <Collapse in={open}>
          {route.level == 3 ? (
            // <div className="card ms-5 me-1">
            //   <div className="card-body  p-2 collapse show">
            //     <div className="row text-center gx-0 gy-0">
            //       {route.children.map(chl => (
            //         <NavbarVerticalMenuItem route={chl} />
            //       ))}
            //     </div>
            //   </div>
            // </div>
            <div>
              {route.children.map((chl, index) => (
                <NavbarVerticalHdrcard route={chl} no={index} key={chl.id} />
                // <div className="card ms-5 me-1" key={`DV${chl.Id}`} >
                //   <div
                //     className="card-header p-2 border-bottom"
                //     data-toggle="collapse"
                //     data-target={'#' + chl.Id}
                //     aria-expanded="true"
                //   >
                //     <h6 className="mb-0">{`${chl.name} (${chl.Id})`}</h6>
                //   </div>

                //   <div className="card-body  p-1 collapse show" key={chl.Id} id={chl.Id}>
                //     <div className="row text-center gx-0 gy-0">
                //       {chl.children.map(menu => (
                //         <NavbarVerticalMenuItem route={menu} key={menu.Id} />
                //       ))}
                //     </div>
                //   </div>
                // </div>
              ))}
            </div>
          ) : (
            // { mnl3 }
            <Nav className="flex-column nav" as="ul">
              <NavbarVerticalMenu routes={route.children} />
            </Nav>
          )}
        </Collapse>
      </Nav.Item>
    </>
  );
};

const isilevel3 = route => {
  return lsitm.children.map(chl => <NavbarVerticalMenuItem route={chl} />);
};

CollapseItems.propTypes = {
  route: PropTypes.shape({
    name: PropTypes.string.isRequired,
    icon: PropTypes.string,
    children: PropTypes.array.isRequired,
    active: PropTypes.bool
  }).isRequired
};

const NavbarVerticalMenu = ({ routes }) => {
  const {
    config: { showBurgerMenu },
    setConfig
  } = useContext(AppContext);

  const handleNavItemClick = () => {
    if (showBurgerMenu) {
      setConfig('showBurgerMenu', !showBurgerMenu);
    }
  };
  return routes.map(route => {
    if (!route.children) {
      return (
        <Nav.Item as="li" key={route.name} onClick={handleNavItemClick}>
          <NavLink
            end={route.exact}
            to={route.to}
            state={{ open: route.to === '/authentication-modal' }}
            className={({ isActive }) =>
              isActive && route.to !== '#!' ? 'active nav-link' : 'nav-link'
            }
          >
            <NavbarVerticalMenuItem route={route} />
          </NavLink>
        </Nav.Item>
      );
    }
    return <CollapseItems route={route} key={route.name} />;
  });
};

NavbarVerticalMenu.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.shape(NavbarVerticalMenuItem.propTypes))
    .isRequired
};

export default NavbarVerticalMenu;
