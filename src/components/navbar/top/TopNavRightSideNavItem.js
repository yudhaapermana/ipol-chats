import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CartNotification from 'components/navbar/top/CartNotification';
import NotificationDropdown from 'components/navbar/top/NotificationDropdown';
import ProfileDropdown from 'components/navbar/top/ProfileDropdown';
import AppContext from 'context/Context';
import React, { useContext } from 'react';
import { Nav, OverlayTrigger, Tooltip } from 'react-bootstrap';
import NineDotMenu from './NineDotMenu';
import { useAppContext } from 'Main';

const TopNavRightSideNavItem = () => {
  const {
    config: { isDark, isRTL },
    setConfig
  } = useContext(AppContext);
  const {
    config: { theme },
    changeTheme
  } = useAppContext();

  return (
    <Nav
      navbar
      className="navbar-nav-icons ms-auto pt-0 flex-row align-items-center"
      as="ul"
    >
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
            <div
              className="theme-control-toggle-label"
              onClick={() => changeTheme(isDark ? 'light' : 'dark')}
            >
              <FontAwesomeIcon
                icon={isDark ? 'sun' : 'moon'}
                transform="shrink-7"
                className="fs-5"
              />
            </div>
          </OverlayTrigger>
        </Nav.Link>
      </Nav.Item>

      {/* <CartNotification /> */}
      <NotificationDropdown />
      {/* <NineDotMenu /> */}
      <ProfileDropdown />
    </Nav>
  );
};

export default TopNavRightSideNavItem;
