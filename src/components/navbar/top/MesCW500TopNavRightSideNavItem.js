import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CartNotification from 'components/navbar/top/CartNotification';
import NotificationDropdown from 'components/navbar/top/NotificationDropdown';
import ProfileDropdown from 'components/navbar/top/ProfileDropdown';
import AppContext from 'context/Context';
import React, { useContext } from 'react';
import axios from 'axios';
import { Nav, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useAppContext } from 'Main';
import MesCW500ProfileDropdown from './MesCW500ProfileDropdown';
import Avatar from 'components/common/Avatar';
import { format, set } from 'date-fns';
import { FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import * as ISI from 'script/ISI.js';

const URL = process.env.REACT_APP_URL_API;

const MesCW500TopNavRightSideNavItem = () => {
  const navigate = useNavigate();
  const lgdata = JSON.parse(localStorage.getItem('userData'));
  const lgdatapartner = JSON.parse(localStorage.getItem('partnerData'));
  let img = '';
  if (lgdatapartner && lgdatapartner.Link) img = lgdatapartner.Link;

  const date = new Date();
  const hours = format(date, 'HH:mm');
  const datenumber = format(date, 'dd/MM/yyyy');

  const {
    config: { isDark, isRTL },
    setConfig
  } = useContext(AppContext);
  const {
    config: { theme },
    changeTheme
  } = useAppContext();

  const Logoffuser = async () => {
    try {
      await axios({
        url: `${URL}api/Utility/Logoff?usid=${lgdata?.UserId}`,
        method: 'POST',
        contentType: 'application/json;'
      })
        .then(response => {
          //alert('keluar');
        })
        .catch(err => {
          // catch any unexpected errors
          ISI.PopAlertFalcon('error', 'error', err.response.data.Message, '');
        });
    } catch (err) {
      alert(err);
    } finally {
      //StopProgress(); //to turn off loading
    }
  };

  const LogoffuserPartner = async () => {
    try {
      await axios({
        url: `${URL}api/Utility/Logoff?usid=${lgdatapartner?.UserId}`,
        method: 'POST',
        contentType: 'application/json;'
      })
        .then(response => {
          //alert('keluar');
        })
        .catch(err => {
          // catch any unexpected errors
          ISI.PopAlertFalcon('error', 'error', err.response.data.Message, '');
        });
    } catch (err) {
      alert(err);
    } finally {
      //StopProgress(); //to turn off loading
    }
  };

  return (
    <Nav navbar className="navbar-nav-icons ms-auto pt-0 flex-row align-items-center" as="ul">
      {/* <Nav.Item as={'li'}>
        <Nav.Link
          className="px-2 pt-1 pe-3 theme-control-toggle"
          onClick={() => setConfig('isDark', !isDark)}
        >
          <OverlayTrigger
            key="left"
            placement={isRTL ? 'bottom' : 'left'}
            overlay={
              <Tooltip style={{ position: 'fixed' }} id="ThemeColor">
                {isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              </Tooltip>
            }
          >
            <div className="theme-control-toggle-label">
              <FontAwesomeIcon
                icon={isDark ? 'sun' : 'moon'}
                className="fs-0"
              />
            </div>
          </OverlayTrigger>
        </Nav.Link>
      </Nav.Item> */}

      <Nav.Item as={'li'}>
        <Nav.Link className="px-2 pt-1 pe-3 theme-control-toggle" onClick={() => setConfig('isDark', !isDark)}>
          <OverlayTrigger
            key="left"
            placement={isRTL ? 'bottom' : 'left'}
            overlay={
              <Tooltip style={{ position: 'fixed' }} id="ThemeColor">
                {isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              </Tooltip>
            }
          >
            <div className="theme-control-toggle-label" onClick={() => changeTheme(isDark ? 'light' : 'dark')}>
              <FontAwesomeIcon icon={isDark ? 'sun' : 'moon'} transform="shrink-7" className="fs-5" />
            </div>
          </OverlayTrigger>
        </Nav.Link>
      </Nav.Item>

      {/* <CartNotification /> */}
      <NotificationDropdown />

      <div className="d-flex flex-column align-items-end pe-1 ps-3">
        <small className="m-0 text-600 fs-10 fw-light text-dark">{hours}</small>
        <small className="m-0 text-600 fs-10 fw-light text-dark">{datenumber}</small>
      </div>

      <div className="d-flex gap-2 align-items-center pe-1 ps-3">
        <Avatar src={img} size="xl" />
        <div className="d-flex flex-column gap-0">
          <p className="m-0 text-dark fs-10">{lgdatapartner?.UserName}</p>
          <small className="m-0 text-600 fs-10 fw-light">{lgdatapartner?.NIK}</small>
        </div>
      </div>

      {/* <NineDotMenu /> */}
      <MesCW500ProfileDropdown />

      <FiLogOut
        className="ms-3 me-1 text-info fs-7 cursor-pointer"
        onClick={event => {
          Logoffuser();
          LogoffuserPartner();
          localStorage.removeItem('userData');
          localStorage.removeItem('partnerData');
          navigate('/authentication/card/login');
          event.preventDefault();
        }}
      />
    </Nav>
  );
};

export default MesCW500TopNavRightSideNavItem;
