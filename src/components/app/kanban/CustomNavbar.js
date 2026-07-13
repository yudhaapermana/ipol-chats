import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Navbar, Button, Form, FormControl, Nav, Image, Row, Col, OverlayTrigger, Tooltip, Dropdown, Card, Modal } from 'react-bootstrap';
import { FaBars, FaSearch, FaBell } from 'react-icons/fa';
import SvgIcon from './SvgIcon';
import IsiTxt from 'components/form/IsiTxt';
import ThemeToggle from './ThemeToggle';
import AppContext from 'context/Context';
import useIsMobile from 'hooks/useIsMobile';
import Avatar from 'components/common/Avatar';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as ISI from 'script/ISI.js?2';
import { isMobile } from 'react-device-detect';
import logoMini from 'assets/img/logo/logo-1.svg';
import logoBsr from 'assets/img/logo/logo_new.png';

const CustomNavbar = ({ onHamburgerClick }) => {
  const navigate = useNavigate();
  const URL = process.env.REACT_APP_URL_API;
  const URLMobile = process.env.REACT_APP_URL_MOBILE;
  const URLErp = process.env.REACT_APP_URL_IPOL;
  const link = `${URL}api/Menus`;
  const lgdata = JSON.parse(localStorage.getItem('userData'));
  const [isSearch, setIsSearch] = useState(false);
  const [lsMenu, setlsMenu] = useState([]);
  const [lsEmail, setlsEmail] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [isLogout, setIsLogout] = useState(false);
  let img = '';
  if (lgdata && lgdata.Link) img = lgdata.Link;

  const {
    config: { isDark, isRTL },
    setConfig
  } = useContext(AppContext);

  const CheckDev = useIsMobile();

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

  const GetAllMenu = async () => {
    const cachedMenu = localStorage.getItem('lsMenu');
    if (cachedMenu) {
      setlsMenu(JSON.parse(cachedMenu));
      return;
    }
    try {
      let temp = await axios({
        url: `${link}/GetAllMenu?userid=${lgdata?.UserId}`,
        method: 'GET',
        contentType: 'application/json; charset=utf-8',
        headers: {
          Keys: lgdata?.UserTkn,
          'ngrok-skip-browser-warning': 'true'
        }
      })
        .then(response => {
          setlsMenu(response.data);
          localStorage.setItem('lsMenu', JSON.stringify(response.data));
        })
        .catch(err => {
          ISI.PopAlertFalcon('error', 'error', err.response?.data?.Message, '');
        });
    } catch (err) {
      ISI.PopAlertFalcon('error', 'error', err.response?.data?.Message, '');
    }
  };

  const GetEmail = async () => {
    const cachedEmail = localStorage.getItem('lsEmail');
    if (cachedEmail) {
      setlsEmail(JSON.parse(cachedEmail));
      return;
    }
    try {
      let temp = await axios({
        url: `${URL}api/Utility/GetEmail?userid=${lgdata?.UserId}&nik=${lgdata?.NIK}`,
        method: 'GET',
        contentType: 'application/json; charset=utf-8',
        headers: {
          Keys: lgdata?.UserTkn,
          'ngrok-skip-browser-warning': 'true'
        }
      })
        .then(response => {
          setlsEmail(response.data);
          localStorage.setItem('lsEmail', JSON.stringify(response.data));
        })
        .catch(err => {
          ISI.AlertException(err);
        });
    } catch (err) {
      ISI.AlertException(err);
    }
  };

  const searchDatas = [
    {
      title: 'Menu',
      children: [
        { id: 1, name: 'Logsheet BOPP', icon: 'folder' },
        { id: 2, name: 'Entry Jumbo Ticket BOPP Line 1', icon: 'folder' },
        { id: 3, name: 'Entry Jumbo Ticket BOPP Line 2', icon: 'folder' },
        { id: 4, name: 'Entry Jumbo Ticket BOPP Line 3', icon: 'folder' }
      ]
    },
    {
      title: 'Data',
      children: [
        { id: 'LP-251202075', name: 'Logsheet BOPP-LP-251202075', type: 'file' },
        { id: 'LP-251202074', name: 'Logsheet BOPP-LP-251202074', type: 'file' },
        { id: 'LP-251202073', name: 'Logsheet BOPP-LP-251202073', type: 'file' },
        { id: 'LP-251202072', name: 'Logsheet BOPP-LP-251202072', type: 'file' }
      ]
    }
  ];

  const notification = [
    {
      title: 'Cuti Normal Anda Akan Kadaluarsa',
      total: '1',
      color: 'primary',
      list: [
        { DocNo: 'DPA-2505000014', Date: '09/06/2025', Req: 'Rio Setiawan', DayLeft: 189 },
        { DocNo: 'DPA-2505000015', Date: '09/07/2025', Req: 'Rio Setiawan', DayLeft: 189 }
      ]
    },
    {
      title: 'Waiting For Approval Dispossal Asset',
      total: '3',
      color: 'danger',
      list: [
        { DocNo: 'DPA-2505000014', Date: '09/06/2025', Req: 'Rio Setiawan', DayLeft: 189 },
        { DocNo: 'DPA-2505000014', Date: '09/06/2025', Req: 'Rio Setiawan', DayLeft: 189 }
      ]
    },
    {
      title: 'Waiting For Approval Form Permintaan Asset IT',
      total: '7',
      color: 'danger',
      list: [
        { DocNo: 'DPA-2505000014', Date: '09/06/2025', Req: 'Rio Setiawan', DayLeft: 189 },
        { DocNo: 'DPA-2505000014', Date: '09/06/2025', Req: 'Rio Setiawan', DayLeft: 189 }
      ]
    },
    {
      title: 'Outstanding Transaction - Entry Customer Complaint',
      total: '1',
      color: 'warning',
      list: [
        { DocNo: 'DPA-2505000014', Date: '09/06/2025', Req: 'Rio Setiawan', DayLeft: 189 },
        { DocNo: 'DPA-2505000014', Date: '09/06/2025', Req: 'Rio Setiawan', DayLeft: 189 }
      ]
    },
    {
      title: 'Waiting For Approval Leave Planning',
      total: '1',
      color: 'danger',
      list: [
        { DocNo: 'DPA-2505000014', Date: '09/06/2025', Req: 'Rio Setiawan', DayLeft: 189 },
        { DocNo: 'DPA-2505000014', Date: '09/06/2025', Req: 'Rio Setiawan', DayLeft: 189 }
      ]
    },
    {
      title: 'Waiting For Response',
      total: '1',
      color: 'danger',
      list: [
        { DocNo: 'DPA-2505000014', Date: '09/06/2025', Req: 'Rio Setiawan', DayLeft: 189 },
        { DocNo: 'DPA-2505000014', Date: '09/06/2025', Req: 'Rio Setiawan', DayLeft: 189 }
      ]
    }
  ];

  const filteredMenu = useMemo(() => {
    const lowKeyword = keyword.toLowerCase();
    return lsMenu?.filter(item => item.Description?.toLowerCase().includes(lowKeyword) || item.MenuName?.toLowerCase().includes(lowKeyword) || item.Url?.toLowerCase().includes(lowKeyword));
  }, [keyword, lsMenu]);

  useEffect(() => {
    lgdata && GetEmail();
  }, []);

  const handleOpenErp = () => {
    window.open(URLErp, '_blank');
  }

  return (
    <>
      <Navbar className="px-3 d-flex align-items-center position-sticky w-100 bg-light-subtle position-relative" style={{ height: '49px', zIndex: 1020, top: 0 }}>
        <Image
          src={!CheckDev.isMobile ? logoBsr : logoMini}
          height={CheckDev.isMobile ? 32 : 45}
          className="cursor-pointer"
          onClick={() => {
            navigate('/');
          }}
        />
        {/* <div className="d-lg-none cursor-pointer me-3 text-primary" onClick={onHamburgerClick}>
          <FaBars size={18} />
        </div>

        {!isSearch && (
          <div
            className="d-flex cursor-pointer border border-400 rounded p-2 py-2 d-md-none align-items-center custom-nav-item"
            onClick={() => {
              setIsSearch(true);
              keyword && setShowMenu(true);
            }}
          >
            <SvgIcon name="search" size={12} />
          </div>
        )}

        <div className={`search-overlay bg-light-subtle align-items-center px-3 ${isSearch ? 'd-flex active' : 'd-none'}`}>
          <div className="d-flex align-items-center w-100 border border-400 rounded-2 px-2 position-relative" style={{ height: '32px' }}>
            <SvgIcon name="search" size={14} className="text-muted me-2" />

            <div className="flex-grow-1">
              <IsiTxt
                css="shadow-none border-0 py-0 w-100 bg-transparent fs-10"
                placeholder="Search"
                val={keyword}
                onchange={e => {
                  setKeyword(e.target.value);
                  setShowMenu(true);
                }}
              />
            </div>

            <div className="d-flex align-items-center gap-2">
              <SvgIcon name="mic" size={20} className="bg-primary text-white rounded-2 p-1 cursor-pointer" />
              <div className="border-start border-400 ps-2 cursor-pointer text-danger cursor-pointer pb-1" onClick={() => setIsSearch(false)}>
                <SvgIcon name="x-circle-contained" size={16} />
              </div>
            </div>

            {showMenu && keyword && (
              <div className="position-absolute bg-light-subtle p-2 rounded-2 mt-8 ms-n2 top-0 w-100 shadow d-flex flex-column gap-3 overflow-auto" style={{ maxHeight: '300px', zIndex: 1025 }}>
                <div>
                  <p className="fw-bold fs-12 mb-1">Menu</p>
                  <div className="d-flex flex-column gap-1">
                    {filteredMenu?.map((c, idx) => {
                      let finalTo = '';

                      if (c.Type === 'APP') {
                        finalTo = c.Url.startsWith('/') ? c.Url : `/${c.Url}`;
                      } else {
                        const baseUrl = c.Type === 'MOBILE' ? URLMobile : URLErp;
                        const fullUrl = `${c.Url.replace(/^\//, '')}`;

                        finalTo = `/login/iframe-viewer/${encodeURIComponent(fullUrl)}?type=${c.Type}`;
                      }
                      return (
                        <div key={idx} className="d-flex align-items-center fs-10 gap-2">
                          <SvgIcon size={15} name={'folder-open-03'} className={'text-warning'} />
                          <Link className="text-dark text-decoration-none" to={finalTo} onClick={() => setShowMenu(false)}>
                            {c.MenuName}
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}            
          </div>
        </div> */}

        {/* {!CheckDev.isMobile && (
          <div
            className="border border-400 rounded-2 px-1 justify-content-between d-flex align-items-center position-absolute"
            style={{ width: '30%', height: '30px', left: 'calc(50% - (1920px - 100vw) / 5)', transform: 'translateX(-50%)' }}
          >
            <Row className="p-0 m-0 g-0 w-100">
              <Col xs={1} style={{ width: 'fit-content' }}>
                <SvgIcon name="search" size={14} className="text-dark" />
              </Col>
              <Col>
                <IsiTxt
                  css="shadow-none border-0 py-0 my-0 mb-n1 w-100 bg-transparent"
                  val={keyword}
                  placeholder="Search"
                  onfocus={() => {
                    keyword && setShowMenu(!showMenu);
                  }}
                  onchange={e => {
                    setKeyword(e.target.value);
                    setShowMenu(true);
                  }}
                />
              </Col>
            </Row>
            <SvgIcon name="mic" size={20} className="bg-primary text-white rounded-2 p-1" />

            {showMenu && keyword && (
              <div className="position-absolute bg-light-subtle p-2 rounded-2 mt-8 ms-n1 top-0 w-100 shadow d-flex flex-column gap-3 overflow-auto" style={{ maxHeight: '300px', zIndex: 1025 }}>
                <div>
                  <p className="fw-bold fs-12 mb-1">Menu</p>
                  <div className="d-flex flex-column gap-1">
                    {filteredMenu?.map((c, idx) => {
                      let finalTo = '';

                      if (c.Type === 'APP') {
                        finalTo = c.Url.startsWith('/') ? c.Url : `/${c.Url}`;
                      } else {
                        const baseUrl = c.Type === 'MOBILE' ? URLMobile : URLErp;
                        const fullUrl = `${c.Url.replace(/^\//, '')}`;

                        finalTo = `/login/iframe-viewer/${encodeURIComponent(fullUrl)}?type=${c.Type}`;
                      }
                      return (
                        <div key={idx} className="d-flex align-items-center fs-10 gap-2">
                          <SvgIcon size={15} name={'folder-open-03'} className={'text-warning'} />
                          <Link className="text-dark text-decoration-none" to={finalTo} onClick={() => setShowMenu(false)}>
                            {c.MenuName}
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}            
          </div>
        )} */}

        <Nav className="ms-auto align-items-center gap-3">
          {/* <OverlayTrigger
            placement="bottom"
            trigger={['hover', 'focus']}
            overlay={
              <Tooltip style={{ position: 'fixed' }} className="fs-11">
                Helpdesk
              </Tooltip>
            }
          >
            <Nav.Link href="http://10.10.20.51:8070/HomePage.do" target="_blank" rel="noopener noreferrer" className="border border-400 rounded p-2 py-2 d-flex align-items-center custom-nav-item">
              <SvgIcon name={'help'} size={12} />
            </Nav.Link>
          </OverlayTrigger>
          <OverlayTrigger
            placement="bottom"
            trigger={['hover', 'focus']}
            overlay={
              <Tooltip style={{ position: 'fixed' }} className="fs-11">
                Chat
              </Tooltip>
            }
          >
            <div className="border border-400 rounded p-2 py-2 d-flex align-items-center custom-nav-item cursor-pointer">
              <SvgIcon name={'message-square-typing'} size={12} />
            </div>
          </OverlayTrigger>
          <Dropdown>
            <Dropdown.Toggle bsPrefix="toggle" to="#!" as={'div'} className="nav-link p-0 cursor-pointer">
              <div className="border border-400 rounded p-2 py-2 d-flex align-items-center custom-nav-item position-relative">
                <span className="notification-number p-1 position-absolute bg-danger rounded-pill fw-semibold d-flex justify-content-center align-items-center text-white">{5}</span>
                <SvgIcon name={'notification'} size={12} />
              </div>
            </Dropdown.Toggle>
            <Dropdown.Menu className="dropdown-menu-card dropdown-menu-end mt-3 me-2 custom-card-notification">
              <Card className="dropdown-menu-end shadow-none">
                <Card.Header className="p-3 position-sticky top-0">
                  <h5 className="fw-semibold fs-9 fs-xxl-8 m-0">Notification</h5>
                </Card.Header>
                <Card.Body className="p-0 custom-card-body-notification">
                  <div className="d-flex flex-column">
                    <div className="pb-3 px-4 bg-primary-subtle d-flex flex-column">
                      <hr className="border border-400 p-0 m-0 mb-3" />
                      <div className="d-flex align-items-center gap-2 pb-1">
                        <SvgIcon name={'information-circle-contained'} size={13} className="text-primary" />
                        <p className="fs-11 m-0">Cuti Normal Anda Akan Kadaluarsa &bull; 09/06/2025</p>
                      </div>
                      <div className="d-flex align-items-start justify-content-between">
                        <div className="d-flex flex-column gap-2">
                          <div className="d-flex flex-lg-row flex-column gap-0 gap-lg-4">
                            <p className="fs-10 m-0 lh-sm">Kadaluarsa : 30/01/2026</p>
                            <p className="fs-10 m-0 lh-sm">Saldo : 5</p>
                          </div>
                          <p className="fs-10 m-0 lh-sm">Segera Ajukan Cuti Anda</p>
                        </div>
                        <p className="bg-danger p-2 rounded-3 text-white fs-11 m-0 lh-sm">260 Days</p>
                      </div>
                    </div>
                    <div className="pb-3 px-4 d-flex flex-column">
                      <hr className="border border-400 p-0 m-0 mb-3" />
                      <div className="d-flex align-items-center gap-2 pb-1">
                        <SvgIcon name={'information-circle-contained'} size={13} className="text-primary" />
                        <p className="fs-11 m-0">Waiting For Approval Dispossal Asset • 08/06/2025</p>
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex gap-4">
                          <p className="fs-10 m-0 lh-sm text-primary">DPA-2505000014 (09/06/2025)</p>
                        </div>
                        <p className="bg-danger p-2 rounded-3 text-white fs-11 m-0 lh-sm" style={{ whiteSpace: 'nowrap' }}>
                          260 Days
                        </p>
                      </div>
                      <div className="d-flex flex-lg-row flex-column align-items-lg-center gap-0 gap-lg-4 pt-lg-0 pt-2 mt-lg-n2 ">
                        <p className="fs-10 m-0 lh-sm">Disspossal Asset No : 2505000014</p>
                        <p className="fs-10 m-0 lh-sm">Requester : Rio Setiawan</p>
                      </div>
                    </div>
                    <div className="pb-3 px-4 d-flex flex-column">
                      <hr className="border border-400 p-0 m-0 mb-3" />
                      <div className="d-flex align-items-center gap-2 pb-1">
                        <SvgIcon name={'information-circle-contained'} size={13} className="text-primary" />
                        <p className="fs-11 m-0">Waiting For Approval Dispossal Asset • 08/06/2025</p>
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex gap-4">
                          <p className="fs-10 m-0 lh-sm text-primary">DPA-2505000014 (09/06/2025)</p>
                        </div>
                        <p className="bg-danger p-2 rounded-3 text-white fs-11 m-0 lh-sm" style={{ whiteSpace: 'nowrap' }}>
                          260 Days
                        </p>
                      </div>
                      <div className="d-flex flex-lg-row flex-column align-items-lg-center gap-0 gap-lg-4 pt-lg-0 pt-2">
                        <p className="fs-10 m-0 lh-sm">Disspossal Asset No : 2505000014</p>
                        <p className="fs-10 m-0 lh-sm">Requester : Rio Setiawan</p>
                      </div>
                    </div>
                    <div className="pb-3 px-4 d-flex flex-column">
                      <hr className="border border-400 p-0 m-0 mb-3" />
                      <div className="d-flex align-items-center gap-2 pb-1">
                        <SvgIcon name={'information-circle-contained'} size={13} className="text-primary" />
                        <p className="fs-11 m-0">Cuti Normal Anda Akan Kadaluarsa &bull; 09/06/2025</p>
                      </div>
                      <div className="d-flex align-items-start justify-content-between">
                        <div className="d-flex flex-column gap-2">
                          <div className="d-flex flex-lg-row flex-column gap-0 gap-lg-4">
                            <p className="fs-10 m-0 lh-sm">Kadaluarsa : 30/01/2026</p>
                            <p className="fs-10 m-0 lh-sm">Saldo : 5</p>
                          </div>
                          <p className="fs-10 m-0 lh-sm">Segera Ajukan Cuti Anda</p>
                        </div>
                        <p className="bg-danger p-2 rounded-3 text-white fs-11 m-0 lh-sm">260 Days</p>
                      </div>
                    </div>
                    <div className="pb-3 px-4 d-flex flex-column">
                      <hr className="border border-400 p-0 m-0 mb-3" />
                      <div className="d-flex align-items-center gap-2 pb-1">
                        <SvgIcon name={'information-circle-contained'} size={13} className="text-primary" />
                        <p className="fs-11 m-0">Cuti Normal Anda Akan Kadaluarsa &bull; 09/06/2025</p>
                      </div>
                      <div className="d-flex align-items-start justify-content-between">
                        <div className="d-flex flex-column gap-2">
                          <div className="d-flex flex-lg-row flex-column gap-0 gap-lg-4">
                            <p className="fs-10 m-0 lh-sm">Kadaluarsa : 30/01/2026</p>
                            <p className="fs-10 m-0 lh-sm">Saldo : 5</p>
                          </div>
                          <p className="fs-10 m-0 lh-sm">Segera Ajukan Cuti Anda</p>
                        </div>
                        <p className="bg-danger p-2 rounded-3 text-white fs-11 m-0 lh-sm">260 Days</p>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Dropdown.Menu>
          </Dropdown> */}

          {/* {lgdata && (
            <div className="mx-2 d-flex align-items-center">
              <div className="text-end me-2 flex-column d-none d-md-flex">
                <p className="fs-10 m-0">{lgdata?.UserName}</p>
                <small className="fs-11 m-0">{lgdata?.NIK}</small>
              </div>
              <Avatar src={img} size="xl" />
            </div>
          )} */}

          <OverlayTrigger
            placement="bottom"
            trigger={['hover', 'focus']}
            overlay={
              <Tooltip style={{ position: 'fixed' }} className="fs-11">
                Back to ERP
              </Tooltip>
            }
          >
            <div className="border border-400 rounded p-2 py-2 d-flex align-items-center custom-nav-item cursor-pointer" onClick={handleOpenErp}>
              <SvgIcon name={'erp'} size={12} />
            </div>            
          </OverlayTrigger>


          {lgdata && (
            <Dropdown>
              <Dropdown.Toggle bsPrefix="toggle" as={'div'} to="#" className="ms-1 d-flex align-items-center nav-link cursor-pointer">
                <div className="text-end me-2 flex-column d-none d-md-flex">
                  <p className="fs-10 m-0">{lgdata?.UserName}</p>
                  <small className="fs-11 m-0">{lgdata?.NIK}</small>
                </div>
                <Avatar src={img} size="xl" />
              </Dropdown.Toggle>
              <Dropdown.Menu className={`dropdown-menu-card dropdown-menu-end dropdown-caret-bg mt-1 me-2 ${CheckDev.isMobile ? 'me-n7' : 'dropdown-caret'}`}>
                <Card className="dropdown-menu-notification dropdown-menu-end shadow-none " style={{ minWidth: isMobile ? '19.5rem' : '17rem', maxWidth: isMobile ? '19.5rem' : '22rem' }}>
                  <Card.Body className="p-3">
                    <div className="d-flex flex-column gap-1 text-center justify-content-center align-items-center mb-3 mt-1">
                      <Avatar src={img} size="4xl" />
                      <p className="fw-bold fs-8 m-0">{lgdata?.UserName}</p>
                      <p className="fs-10 m-0">{lgdata?.NIK}</p>
                    </div>
                    <Row className="g-0 fs-10 bg-200 p-2 rounded-2 d-flex flex-column gap-2 mb-3">
                      <Col xs={12}>
                        <Row className="g-0 fs-10 d-flex align-items-center gap-2">
                          <Col xs="auto" className="w-fit">
                            <SvgIcon name={'user-profile-02'} size={14} />
                          </Col>
                          <Col xs={7}>{lgdata?.UserId}</Col>
                        </Row>
                      </Col>
                      <Col xs={12}>
                        <Row className={`g-0 fs-10 gap-2 flex-nowrap ${lsEmail.length > 1 ? 'align-items-start' : 'align-items-center'}`}>
                          <Col xs="auto" className="w-fit">
                            <SvgIcon name={'email'} size={14} />
                          </Col>
                          <Col className="d-flex flex-column gap-2 overflow-hidden">
                            {lsEmail.length > 0 &&
                              lsEmail.map((item, index) => (
                                <p key={index} className="m-0 fs-10 text-truncate lh-sm">
                                  {item}
                                </p>
                              ))}
                          </Col>
                        </Row>
                      </Col>
                      <Col xs={12}>
                        <Row className="g-0 fs-10 align-items-center gap-2">
                          <Col xs="auto" className="w-fit">
                            <SvgIcon name={'computer'} size={14} />
                          </Col>
                          <Col xs={7}>{lgdata?.IPDSP}</Col>
                        </Row>
                      </Col>
                      {/* <Col xs={12}>
                        <Link
                          className="btn btn-outline-info btn-sm mt-4"
                          onClick={event => {
                            Logoffuser();
                            localStorage.removeItem('userData');
                            navigate('/login-new');
                            event.preventDefault();
                          }}
                        >
                          Logoff
                        </Link>
                      </Col> */}
                    </Row>
                    <Button variant="primary" className="w-100 fw-normal fs-10 py-1 d-flex align-items-center justify-content-center mb-3" onClick={() => navigate('/hrga/Hrd013_EcardAccess')}>
                      <SvgIcon name={'user-profile-square'} size={14} className="me-2" />
                      E-Card
                    </Button>
                    <Button variant="danger" className="w-100 fw-normal fs-10 py-1 d-flex align-items-center justify-content-center" onClick={() => setIsLogout(true)}>
                      <SvgIcon name={'logout'} size={14} className="me-2" />
                      Logout
                    </Button>
                  </Card.Body>
                </Card>
              </Dropdown.Menu>
            </Dropdown>
          )}

          <ThemeToggle />
        </Nav>
      </Navbar>
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
                localStorage.removeItem('listUser');
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

export default CustomNavbar;
