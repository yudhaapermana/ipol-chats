import React, { useEffect, useState } from 'react';
import { Accordion, Button, Col, Image, Modal, Nav, Row, useAccordionButton } from 'react-bootstrap';
import {
  FaChartPie,
  FaShoppingCart,
  FaWarehouse,
  FaUsers,
  FaCogs,
  FaChartLine,
  FaEdit,
  FaCheckCircle,
  FaFileAlt,
  FaPlus,
  FaList,
  FaBoxes,
  FaClipboardList,
  FaBarcode,
  FaUserFriends
} from 'react-icons/fa';
import logoMini from 'assets/img/logo/logo-1.svg';
import logoBsr from 'assets/img/logo/logo-2.svg';
import SvgIcon from './SvgIcon';
import { IpolMenuRoutes } from 'routes/IpolSiteMaps';
import { useLocation, useNavigate } from 'react-router-dom';
import { get } from 'jquery';
import * as ISI from 'script/ISI.js?2';
import axios from 'axios';
import { useBreakpoints } from 'hooks/useBreakpoints';

const Sidebar = ({ isExpanded, isHold, activeSubMenu, toggleSidebar, onSubMenuClick, onMouseEnter, onMouseLeave }) => {
  const navigate = useNavigate();
  const URL = process.env.REACT_APP_URL_API_LOCAL;
  const lgdata = JSON.parse(localStorage.getItem('userData'));
  const { pathname } = useLocation();

  const [lsMenu, setLsMenu] = useState([]);
  const [isLogout, setIsLogout] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  let { width, height, breakpoints } = useBreakpoints();
  let htab = height - 110;
  let htabe = height - 50;

  const GetMenuErp = async () => {
    const menuErp = JSON.parse(localStorage.getItem('menuErp'));
    if (menuErp) {
      setLsMenu(menuErp);
      setIsMobile(false);
      return;
    }

    try {
      let temp = await axios({
        url: `${URL}api/Menus/GetMenuErp?userid=${lgdata?.UserId}`,
        method: 'GET',
        contentType: 'application/json; charset=utf-8',
        headers: {
          Keys: lgdata?.UserTkn
        }
      })
        .then(response => {
          setLsMenu(response.data);
          setIsMobile(false);
          localStorage.setItem('menuErp', JSON.stringify(response.data));
        })
        .catch(err => {
          ISI.AlertException(err);
        });
    } catch (err) {
      ISI.AlertException(err);
    }
  };

  const GetMenuMobile = async () => {
    const menuMobile = JSON.parse(localStorage.getItem('menuMobile'));
    if (menuMobile) {
      setLsMenu(menuMobile);
      setIsMobile(true);
      return;
    }

    try {
      let temp = await axios({
        url: `${URL}api/Menus/GetMobileNavigation?userid=${lgdata?.UserId}`,
        method: 'GET',
        contentType: 'application/json; charset=utf-8',
        headers: {
          Keys: lgdata?.UserTkn
        }
      })
        .then(response => {
          setLsMenu(response.data);
          setIsMobile(true);
          localStorage.setItem('menuMobile', JSON.stringify(response.data));
        })
        .catch(err => {
          ISI.AlertException(err);
        });
    } catch (err) {
      ISI.AlertException(err);
    }
  };

  // const getFlattenedPaths = menus => {
  //   let paths = [];
  //   const traverse = items => {
  //     if (!items) return;
  //     items.forEach(item => {
  //       if (item.to && item.to !== '' && item.to !== '#') {
  //         paths.push(item.to.toLowerCase());
  //       }
  //       if (item.children) traverse(item.children);
  //     });
  //   };
  //   traverse(menus);
  //   return paths;
  // };

  useEffect(() => {
    if (lgdata && lsMenu?.length === 0) {
      GetMenuErp();
    }
  }, []);

  // useEffect(() => {
  //   if (lsMenu && lsMenu.length > 0) {
  //     const normalize = p => {
  //       if (!p) return '';
  //       let path = p.toLowerCase().trim();
  //       if (!path.startsWith('/')) path = '/' + path;
  //       return path.replace(/\/$/, '') || '/';
  //     };

  //     const allowedPaths = getFlattenedPaths(lsMenu).map(p => normalize(p));
  //     const currentPath = normalize(pathname);
  //     const bypassList = ['/', 'home'];

  //     const isAuthorized =
  //       allowedPaths.includes(currentPath) ||
  //       bypassList.some(bp => {
  //         const nBP = normalize(bp);
  //         if (nBP === '/' || currentPath === nBP) return currentPath === nBP;
  //         return currentPath.startsWith(nBP + '/');
  //       });

  //     if (!isAuthorized) {
  //       navigate('/', { replace: true });
  //     }
  //   }
  // }, [lsMenu, pathname, navigate]);

  const [activeKey, setActiveKey] = useState(null);

  const menus = [
    {
      title: 'Sales & Marketing',
      icon: 'dollar-sign',
      children: [
        {
          title: 'Customer Relationship Management',
          content: {
            transaction: [
              { title: 'Entry Customer Complaint', icon: 'enter-the-keyboard', path: '/sales/complaint-entry' },
              { title: 'Approval Customer Complaint', icon: 'validation-approval', path: '/sales/complaint-app' },
              { title: 'Customer Master', icon: 'setting-web', path: '/sales/complaint-app' }
            ],
            report: [{ title: 'Complaint Summary', icon: 'setting-web', path: '/sales/rpt-summary' }],
            master: [{ title: 'Customer Master', icon: 'validation-approval', path: '/sales/cust-master' }]
          }
        },
        {
          title: 'Sample Request',
          content: {
            transaction: [{ title: 'New Request', icon: <FaPlus />, path: '/sales/sample-new' }],
            report: [{ title: 'Sample Status', icon: <FaList />, path: '/sales/sample-status' }],
            master: []
          }
        }
      ]
    },
    {
      title: 'Warehouse Management',
      icon: 'archive',
      children: [
        {
          title: 'Inventory Control',
          content: {
            transaction: [{ title: 'Stock Movement', icon: <FaBoxes />, path: '/wh/movement' }],
            report: [{ title: 'Inventory Report', icon: <FaClipboardList />, path: '/wh/rpt' }],
            master: [{ title: 'Item Master', icon: <FaBarcode />, path: '/wh/items' }]
          }
        }
      ]
    },
    { title: 'Finance & Accounting', icon: 'divide-circle' },
    { title: 'HRMS', icon: 'user-check' },
    { title: 'HRMS', icon: 'user-check' },
    { title: 'HRMS', icon: 'user-check' },
    { title: 'HRMS', icon: 'user-check' },
    { title: 'HRMS', icon: 'user-check' },
    { title: 'HRMS', icon: 'user-check' },
    { title: 'HRMS', icon: 'user-check' },
    { title: 'HRMS', icon: 'user-check' },
    { title: 'HRMS', icon: 'user-check' },
    { title: 'HRMS', icon: 'user-check' },
    { title: 'HRMS', icon: 'user-check' },
    { title: 'HRMS', icon: 'user-check' },
    { title: 'HRMS', icon: 'user-check' },
    { title: 'HRMS', icon: 'user-check' },
    { title: 'HRMS', icon: 'user-check' },
    { title: 'HRMS', icon: 'user-check' },
    { title: 'HRMS', icon: 'user-check' },
    { title: 'HRMS', icon: 'user-check' },
    { title: 'HRMS', icon: 'user-check' },
    { title: 'HRMS', icon: 'user-check' },
    { title: 'HRMS', icon: 'user-check' },
    { title: 'HRMS', icon: 'user-check' },
    { title: 'HRMS', icon: 'user-check' },
    { title: 'HRMS', icon: 'user-check' },
    { title: 'HRMS', icon: 'user-check' },
    { title: 'HRMS', icon: 'user-check' },
    { title: 'HRMS', icon: 'user-check' },
    { title: 'HRMS', icon: 'user-check' },
    { title: 'HRMS', icon: 'user-check' },
    { title: 'HRMS', icon: 'user-check' },
    { title: 'HRMS', icon: 'user-check' },
    { title: 'HRMS', icon: 'user-check' },
    { title: 'HRMS', icon: 'user-check' },
    { title: 'HRMS', icon: 'user-check' },
    { title: 'HRMS', icon: 'user-check' },
    { title: 'HRMS', icon: 'user-check' },
    { title: 'HRMS', icon: 'user-check' }
  ];

  function CustomToggle({ children, eventKey }) {
    const decoratedOnClick = useAccordionButton(eventKey);

    return (
      <div className="cursor-pointer" onClick={decoratedOnClick}>
        {children}
      </div>
    );
  }

  const handleToggleSidebar = () => {
    // setActiveKey(null);
    toggleSidebar();
  };

  const getNameIcon = (name = '') => {
    const s = name?.toLowerCase();

    const statusMap = {
      'dollar-sign': ['sales', 'sales & marketing', 'marketing'],
      archive: ['warehouse', 'warehouse management'],
      'divide-circle': ['finance', 'finance & accounting', 'accounting'],
      'user-check': ['h r m s', 'human resource', 'human resources', 'HRMS'],
      'git-commit': ['offline', 'offline transaction'],
      clock: ['work order'],
      package: ['inventory'],
      'cloud-snow': ['production'],
      database: ['wip jumbo & intermediate', 'wip jumbo', 'intermediate'],
      video: ['qa', 'qc - rnd', 'qc', 'quality control', 'research & development'],
      tool: ['sparepart'],
      users: ['hr & ga'],
      cpu: ['engineering'],
      'credit-card': ['purchasing'],
      coffee: ['ist'],
      heart: ['hse'],
      printer: ['utility'],
      'git-pull-request': ['raw material drawback', 'raw material', 'drawback'],
      zap: ['cams', 'customer account management system', 'crm'],
      headphones: ['helpdesk'],
      navigation: ['exim'],
      'bank-note-05': ['capital expense'],
      'bar-chart-square-01': ['dashboard'],
      atom: ['metallizing']
    };

    const nameIcon = Object.keys(statusMap).find(key => statusMap[key].some(val => s.includes(val)));

    return nameIcon;
  };

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

  const handleLogout = () => {
    setIsLogout(!isLogout);
  };    

  return (
    <>
      <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} className={`sidebar-container bg-primary-shadow ${(isExpanded || isHold) ? 'sidebar-expanded' : 'sidebar-mini'}`}>
        <div className="d-flex align-items-center mb-2 bg-primary overflow-hidden" style={{ paddingLeft: '13px', height: '49px' }}>
          <Image
            src={(isExpanded || isHold) ? logoBsr : logoMini}
            height={32}
            className="cursor-pointer"
            onClick={() => {
              navigate('/');
            }}
          />
        </div>

        <Nav className={`d-flex flex-column gap-2 nav-side-custom overflow-x-hidden ${(isExpanded || isHold) ? 'align-items-start' : 'align-items-start'}`}>
          {(isExpanded || isHold) && (
            <Row className="d-flex gap-3 g-0 align-items-center text-white fs-10 m-0 mt-3 w-100 d-flex align-items-center flex-nowrap">
              <Col
                className={`text-center py-2 cursor-pointer rounded-3 ${!isMobile ? 'bg-primary' : ''}`}
                onClick={() => {
                  GetMenuErp(), onSubMenuClick(null), setActiveKey(null);
                }}
              >
                <p className="m-0 text-nowrap">Menu ERP</p>
              </Col>
              <Col xs={1} className="w-fit">
                <div className="border-start border-white" style={{ height: '2.2rem' }}></div>
              </Col>
              <Col
                className={`text-center py-2 rounded-3 cursor-pointer ${isMobile ? 'bg-primary' : ''}`}
                onClick={() => {
                  GetMenuMobile(), onSubMenuClick(null), setActiveKey(null);
                }}
              >
                <p className="m-0 text-nowrap">Menu Mobile</p>
              </Col>
            </Row>
          )}
          <div className="text-white fs-8 m-0 pt-2 pb-1 cursor-pointer d-flex align-items-center" onClick={handleToggleSidebar}>
            <SvgIcon name={(isExpanded && !isHold) ? 'sidebar-max' : (isExpanded && isHold) ? 'sidebar' : 'sidebar-max'} size={14} className="text-white me-2" />
            <span className={`menu-text fs-10 ${(isExpanded || isHold) ? 'opacity-100' : 'opacity-0'}`}>{isHold ? 'Release Menu' : 'Hold Menu'}</span>
          </div>
          <Accordion
            className="w-100 d-flex flex-column gap-2"
            activeKey={(isExpanded || isHold) ? activeKey : null}
            onSelect={k => {
              setActiveKey(k), onSubMenuClick(null);
            }}
            style={{ height: self == top ? ((isExpanded || isHold) ? htab - 90 : htab - 30) : ((isExpanded || isHold) ? htabe - 90 : htabe - 30) }}
          >
            {lsMenu?.children?.map((menu, index) => (
              <Accordion.Item eventKey={index.toString()} key={index} className="border-0 bg-transparent ">
                <CustomToggle eventKey={(isExpanded || isHold) && index.toString()}>
                  <Nav.Link as="div" className="text-white d-flex w-100 align-items-center justify-content-between cursor-pointer p-0 m-0 py-1">
                    <div className="p-0 m-0 d-flex align-items-center">
                      <div className={`${activeKey == index.toString() && 'is-menu-active ms-n2'} me-2`}>
                        <SvgIcon
                          name={getNameIcon(menu.MenuName)}
                          className="text-white"
                          size={14}
                          onClick={e => {
                            e.stopPropagation();
                            handleToggleSidebar();
                          }}
                        />
                      </div>
                      <span className={`menu-text fs-10 ${(isExpanded || isHold) ? 'opacity-100' : 'opacity-0'}`}>{menu.MenuName}</span>
                    </div>
                    <SvgIcon name="chevron-down" size={14} className="text-white" />
                  </Nav.Link>
                </CustomToggle>
                <Accordion.Collapse eventKey={index.toString()}>
                  <div>
                    {menu.children?.map((subItem, subIdx) => {
                      const isActive = activeSubMenu?.MenuName === subItem.MenuName;
                      return (
                        <p
                          key={subIdx}
                          className={`ps-4 fs-10 rounded-pill m-0 py-1 cursor-pointer text-white transition-all ${isActive ? 'bg-primary' : 'hover-bg-light'}`}
                          onClick={() => onSubMenuClick(subItem)}
                        >
                          {subItem.MenuName}
                        </p>
                      );
                    })}
                  </div>
                </Accordion.Collapse>
              </Accordion.Item>
            ))}
            {/* {menus.map((menu, index) => (
              <Accordion.Item eventKey={index.toString()} key={index} className="border-0 bg-transparent ">
                <CustomToggle eventKey={isExpanded || isHold && index.toString()}>
                  <Nav.Link as="div" className="text-white d-flex w-100 align-items-center justify-content-between cursor-pointer p-0 m-0 py-1">
                    <div className="p-0 m-0 d-flex align-items-center">                    
                      <SvgIcon
                        name={menu.icon}
                        className="text-white me-2"
                        size={14}
                        onClick={e => {
                          e.stopPropagation();
                          handleToggleSidebar();
                        }}
                      />
                      <span className={`menu-text fs-10 ${isExpanded || isHold ? 'opacity-100' : 'opacity-0'}`}>{menu.name}</span>
                    </div>
                    <SvgIcon name='chevron-down' size={14} className='text-white'/>                  
                  </Nav.Link>
                </CustomToggle>
                <Accordion.Collapse eventKey={index.toString()}>
                  <div>
                    {menu.children?.map((subItem, subIdx) => {
                      const isActive = activeSubMenu?.name === subItem.name;
                      return (
                        <p
                          key={subIdx}
                          className={`ps-4 fs-10 rounded-pill m-0 py-1 cursor-pointer text-white transition-all ${isActive ? 'bg-primary' : 'hover-bg-light'}`}
                          onClick={() => onSubMenuClick(subItem)}
                        >
                          {subItem.name}
                        </p>
                      );
                    })}
                  </div>
                </Accordion.Collapse> 
              </Accordion.Item>
            ))} */}
          </Accordion>
        </Nav>
        <div
          className="position-absolute bottom-0 text-white fs-8 m-0 pt-1 pb-3 cursor-pointer ms-3 border-top border-white bg-primary-shadow"
          style={{ height: '45px', width: (isExpanded || isHold) ? '91%' : '' }}
          onClick={handleLogout}
        >
          <SvgIcon name={'logout'} size={14} className="text-white ms-1 me-2" />
          <span className={`menu-text fs-10 m-0 ${(isExpanded || isHold) ? '' : 'd-none'}`}>Logout</span>
        </div>
      </div>
      {(isExpanded || isHold) && <div className="position-fixed top-0 start-0 w-100 h-100 sidebar-overlay" onClick={handleToggleSidebar} />}
      <Modal show={isLogout} size="md" onHide={() => setIsLogout(false)} centered>
        <Modal.Body className="d-flex flex-column justify-content-center align-items-center gap-3">
          <h5 className="fw-semibold fs-8">Are you sure want to Logout?</h5>
          <div className="d-flex gap-3">
            <Button
              className="px-8 fs-10 py-1 fw-normal"
              variant="primary"
              onClick={event => {
                Logoffuser();
                localStorage.removeItem('userData');
                localStorage.removeItem('menuErp');
                localStorage.removeItem('menuMobile');
                localStorage.removeItem('lsMenu');
                localStorage.removeItem('auth_ERP');
                localStorage.removeItem('auth_MOBILE');
                localStorage.removeItem('lsEmail');
                setIsLogout(false);
                navigate('/login/IsiLogin');
                event.preventDefault();
              }}
            >
              Yes
            </Button>
            <Button className="px-8 fs-10 py-1 fw-normal" variant="danger" onClick={() => setIsLogout(false)}>
              No
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Sidebar;
