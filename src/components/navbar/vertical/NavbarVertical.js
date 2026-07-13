import React, { useContext, useEffect, useState, useRef, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Nav, Navbar, Row, Col } from 'react-bootstrap';
import { navbarBreakPoint, topNavbarBreakpoint } from 'config';
import AppContext from 'context/Context';
import Flex from 'components/common/Flex';
import Logo from 'components/common/Logo';
import LogoDesk from 'components/common/LogoDesk';
import useIsMobile from 'hooks/useIsMobile';
import NavbarVerticalMenu from './NavbarVerticalMenu';
import ToggleButton from './ToggleButton';
import * as routes from 'routes/IpolSiteMaps';
import * as ISI from 'script/ISI.js?2';
import { capitalize } from 'helpers/utils';
import NavbarTopDropDownMenus from 'components/navbar/top/NavbarTopDropDownMenus';
// import PurchaseCard from './PurchaseCard';
import bgNavbar from 'assets/img/generic/bg-navbar.png';
import axios from 'axios';

const NavbarVertical = () => {
  const CheckDev = useIsMobile();
  const {
    config: { navbarPosition, navbarStyle, isNavbarVerticalCollapsed, showBurgerMenu }
  } = useContext(AppContext);

  const URL = process.env.REACT_APP_URL_API_LOCAL;
  const lgdata = JSON.parse(localStorage.getItem('userData'));
  const HTMLClassList = document.getElementsByTagName('html')[0].classList;
  const [datamenu, setMenu] = useState([]);
  const isrunn = useRef(false);
  const IpolMenuRoutes = async () => {
    //alert('masuk');
    // try {
    let temp = await axios({
      url: `${URL}api/Utility/GetMenuApp?usid=${lgdata.UserId}`,
      method: 'GET',
      contentType: 'application/json; charset=utf-8',
      headers: {
        Keys: lgdata.UserTkn
      }
    })
      .then(response => {
        //let data= await routes.IpolMenuRoutes();
        //console.log("masuk" + data.data);
        // console.table(temp.data)
        // return temp.data;
        setMenu(response.data);
      })
      .catch(err => {
        //ISI.AlertException(err);
      });
    // } catch (err) {
    //   ISI.AlertException(err);
    // }
  };

  useEffect(() => {
    if (isrunn.current === false) {
      //console.log("masuk pertama")
      //alert(lgdata.UserId);
      if (lgdata && lgdata.UserId) IpolMenuRoutes();
      else {
        setMenu([]);
      }

      return () => {
        isrunn.current = true;
      };
    }
  }, []);

  useEffect(() => {
    if (isNavbarVerticalCollapsed) {
      HTMLClassList.add('navbar-vertical-collapsed');
    } else {
      HTMLClassList.remove('navbar-vertical-collapsed');
    }
    return () => {
      HTMLClassList.remove('navbar-vertical-collapsed-hover');
    };
  }, [isNavbarVerticalCollapsed, HTMLClassList]);

  //Control mouseEnter event
  let time = null;
  const handleMouseEnter = () => {
    if (isNavbarVerticalCollapsed) {
      time = setTimeout(() => {
        HTMLClassList.add('navbar-vertical-collapsed-hover');
      }, 100);
    }
  };
  const handleMouseLeave = () => {
    clearTimeout(time);
    HTMLClassList.remove('navbar-vertical-collapsed-hover');
  };

  const NavbarLabel = ({ label }) => (
    <Nav.Item as="li">
      <Row className="mt-3 mb-2 navbar-vertical-label-wrapper">
        <Col xs="auto" className="navbar-vertical-label navbar-vertical-label">
          {label}
        </Col>
        <Col className="ps-0">
          <hr className="mb-0 navbar-vertical-divider"></hr>
        </Col>
      </Row>
    </Nav.Item>
  );

  // console.log("test data " + menu) ;
  // console.table(menu);

  return (
    <>
      {/* {console.table("menu" + datamenu)} */}
      <Navbar
        expand={navbarBreakPoint}
        className={classNames('navbar-vertical', {
          [`navbar-${navbarStyle}`]: navbarStyle !== 'transparent'
        })}
        variant="light"
      >
        <Flex alignItems="center">
          <ToggleButton />
          {CheckDev.isMobile ? <Logo at="navbar-top" width={150} id="Mlogo" /> : <LogoDesk at="navbar-top" width={300} id="Dlogo" />}
        </Flex>
        <Navbar.Collapse
          in={showBurgerMenu}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            width: '20rem !important',
            backgroundImage: navbarStyle === 'vibrant' ? `linear-gradient(-45deg, rgba(0, 160, 255, 0.86), #0048a2),url(${bgNavbar})` : 'none'
          }}
        >
          <div className="navbar-vertical-content scrollbar" style={{ width: '20 rem !important' }}>
            <Nav className="flex-column" as="ul">
              {datamenu.map(route => (
                <Fragment key={route.label}>
                  {!route.labelDisable && <NavbarLabel label={capitalize(route.label)} />}
                  <NavbarVerticalMenu routes={route.children} />
                </Fragment>
              ))}
            </Nav>

            <>
              {navbarPosition === 'combo' && (
                <div className={`d-${topNavbarBreakpoint}-none`}>
                  <div className="navbar-vertical-divider">
                    <hr className="navbar-vertical-hr my-2" />
                  </div>
                  <Nav navbar>
                    <NavbarTopDropDownMenus />
                  </Nav>
                </div>
              )}
              {/*<PurchaseCard />*/}
            </>
          </div>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
};

NavbarVertical.propTypes = {
  label: PropTypes.string
};

export default NavbarVertical;
