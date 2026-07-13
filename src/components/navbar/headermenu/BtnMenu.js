import React, { useEffect } from 'react';
import { Button, Row, Col, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IconButtonNew from 'components/app/kanban/IconButtonNew';
import { 
  faPlus, 
  faSearch, 
  faQuestion, 
  faDownload, 
  faPrint, 
  faSignOutAlt,
  faAddressCard 
} from '@fortawesome/free-solid-svg-icons';

const BtnMenu = ({
  id,
  title,
  tolink,
  icon,
  evclick,
  color = 'text-primary',
  disabled = false,
  isIcon,
  iconSize
}) => {
  
  const menuConfig = {
    [faPlus.iconName]: { label: 'New', iconLabel: 'plus' },
    [faSearch.iconName]: { label: 'Search', iconLabel: 'search' },
    [faQuestion.iconName]: { label: 'Help', iconLabel: 'help-line' },
    [faDownload.iconName]: { label: 'Download', iconLabel: 'download' },
    [faPrint.iconName]: { label: 'Print', iconLabel: 'printer' },
    [faSignOutAlt.iconName]: { label: 'Back', iconLabel: 'logout' },
    [faAddressCard.iconName]: { label: 'Change', iconLabel: 'table-outline' },
  };
  
  const config = menuConfig[icon?.iconName] || { label: title, iconLabel: '' };

  return (
    <>
      <Nav.Item className="me-1">
        <Nav.Link
          className="btn btn-link btn-lg pt-1 pb-0 ps-1 pe-0"
          to={tolink}
          id={id}
          title={title}
          onClick={evclick}
          disabled={disabled}
        >
          <IconButtonNew title={title} iconName={config?.iconLabel || icon} iconSize={iconSize || (isIcon ? 23 : 16)} className={`${color} ${isIcon ? 'bg-transparent shadow-none' : 'bg-200 fs-10'} border-0`}>
             {!isIcon && config?.label}
          </IconButtonNew>
          {/* <FontAwesomeIcon icon={icon} className={`${color} fs-7`} /> */}
        </Nav.Link>
      </Nav.Item>
    </>
  );
};

export default BtnMenu;