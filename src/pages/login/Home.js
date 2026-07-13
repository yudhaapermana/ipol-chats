import React, { useEffect, useMemo, useState } from 'react';
import SvgIcon from 'components/app/kanban/SvgIcon';
import TimerNotif from 'components/notification/TimerNotif';
import { Accordion, Card, Col, Form, Image, Modal, Row, useAccordionButton } from 'react-bootstrap';
import useIsMobile from 'hooks/useIsMobile';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import * as ISI from 'script/ISI.js?2';
import axios from 'axios';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { format, set } from 'date-fns';
import IsiCheck from 'components/form/IsiCheck';
import IsiRadio from 'components/form/IsiRadio';
import IsiDateTime from 'components/form/IsiDateTime';
import IsiDateTimeRange from 'components/form/IsiDateTimeRange';
import IsiUpload from 'components/form/IsiUpload';

const Home = () => {
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const CheckDev = useIsMobile();
  const [seconds, setSeconds] = useState(300);
  const [favorite, setFavorite] = useState();
  const URL = process.env.REACT_APP_URL_API;
  const link = `${URL}api/Menus`;
  const lgdata = JSON.parse(localStorage.getItem('userData'));
  const [lsHistory, setLsHistory] = useState([]);
  const [lsBookmark, setLsBookmark] = useState([]);
  const [lsMenu, setlsMenu] = useState([]);
  const [lsOutstanding, setLsOutstanding] = useState([]);
  const [Obj, setObj] = useState();
  const [isMobile, setisMobile] = useState(false);
  const [isErp, setisErp] = useState(false);
  const [wfaUrl, setwfaUrl] = useState('');

  let { width, height, breakpoints } = useBreakpoints();
  let htab = height - 110;
  let htabe = height - 50;

  const weekDays = useMemo(() => {
    const days = [];
    const startOfWeek = new Date(currentDate);

    const dayIndex = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - dayIndex + (dayIndex === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  }, [currentDate]);

  const changeWeek = direction => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + direction * 7);
    setCurrentDate(newDate);
  };

  const formatMonthYear = date => {
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const menus = [
    { title: 'Entry Customer \n Complaint', icon: 'enter-the-keyboard', path: '/sales/complaint-entry' },
    { title: 'Approval Customer \n Complaint', icon: 'validation-approval', path: '/sales/complaint-app' },
    { title: 'Customer \n Master', icon: 'setting-web', path: '/sales/complaint-app' },
    { title: 'Running Number \n Document', icon: 'box-sign', path: '/sales/complaint-entry' },
    { title: 'User \n Maintenance', icon: 'data-user', path: '/sales/complaint-app' },
    { title: 'Entry BPPB Permintaan Stationery (Cikampek-HC)', icon: 'doc-add', path: '/sales/complaint-app' },
    { title: 'Menu \n Maintenance', icon: 'more-app', path: '/sales/complaint-entry' },
    { title: 'Item \n Status Inquiry', icon: 'toilet-paper', path: '/sales/complaint-app' },
    { title: 'Report \n Roll Status', icon: 'film-roll-1', path: '/sales/complaint-app' },
    { title: 'Item Master \n Raw Material', icon: 'master', path: '/sales/complaint-entry' },
    { title: 'Master Production \n Planning V2', icon: 'production-belt-time', path: '/sales/complaint-app' },
    { title: 'Leave Planning Entry/ Pengajuan Rencana Cuti ...', icon: 'box-sign', path: '/sales/complaint-app' }
  ];

  const menus2 = [
    { title: 'Cash & Bank - Transaction - Confirm Bon Sementara', path: '/warehouse/Whs201_genPSfromPO/RM' },
    { title: 'Program Maintenance - Transaction - Menu Maintenance', path: '/marketing/Mkt200_CustComplaintDashboard' },
    { title: 'Tools - Transaction - Running Number Document', path: '/marketing/Mkt200_CustComplaintList' },
    { title: 'HR - Transaction - Leave Planning Entry/Pengajuan Rencana Cuti/Ijin/Dispensasi', path: '/production/Pd620_QAInstructionList' },
    { title: 'Program Maintenance - Transaction - Entry Request Konsinyasi', path: '/marketing/Mkt200_CustComplaintList/?param=A' },
    { title: 'Konsinyasi - Transaction - Entry Request Konsinyasi', path: '/warehouse/Whs011_proyeksiLDList' },
    { title: 'Order Processing & Sales Analysis - Transaction - Schedule Delivery Order', path: '/warehouse/Whs201_genPSfromPO/PM' },
    { title: 'Jumbo Ticket - Report - Jumbo Ticket Inquiry', path: 'production/Pd620_QAInstructionList' },
    { title: 'Inventory Valuation - Transaction - Download Data Actual Cost Simulation V2', path: '' },
    { title: 'Order Processing & Sales Analysis - Transaction - Inquiry Order Review' }
  ];

  const [menus3, setMenus3] = useState([
    { id: 1, title: 'Entry Request Konsinyasi' },
    { id: 2, title: 'Menu Maintenance' },
    { id: 3, title: 'Running Number Document' },
    { id: 4, title: 'Leave Planning Entry/Pengajuan Rencana Cuti/Ijin/Dispensasi' },
    { id: 5, title: 'Schedule Delivery Order' },
    { id: 6, title: 'Jumbo Ticket Inquiry' },
    { id: 7, title: 'Data Actual Cost Simulation V2' },
    { id: 8, title: 'Inquiry Order Review' }
  ]);

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

  const news = [
    { date: '23/12/2025', content: 'Untuk keperluan Stock Opname ERP Indopoly tidak bisa diakses sampai pukul 14:00 WIB' },
    { date: '18/12/2025', content: 'Mulai tanggal 20 Desember 2025 sampai tanggal 30 Desember 2025 akan diadakan ...' },
    { date: '12/12/2025', content: 'Go Live Program - Mixing Transaction' },
    { date: '10/12/2025', content: 'Go Live Program - iMES' },
    { date: '01/12/2025', content: 'Terlampir disampaikan Berita Duka Cita Ibu Mertua dari Ibu Yunita Wulan, ...' }
    // { date: '01/12/2025', content: 'Terlampir disampaikan Berita Duka Cita Ibu Mertua dari Ibu Yunita Wulan, ...'},
  ];

  function CustomToggle({ children, eventKey }) {
    const decoratedOnClick = useAccordionButton(eventKey);

    return (
      <div className="cursor-pointer" onClick={decoratedOnClick}>
        {children}
      </div>
    );
  }

  const handleClose = index => {
    const updatedMenus = menus3.filter((_, i) => i !== index);
    setMenus3(updatedMenus);
  };

  const formatTime = time => {
    const minutes = Math.floor(time / 60);
    const remainingSeconds = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const formatDateNumber = date => {
    const tgl = new Date(date);
    return format(tgl, 'dd/MM/yyyy');
  };

  const ensureLeadingSlash = path => {
    if (!path) return '/';
    return path.startsWith('/') ? path : `/${path}`;
  };

  const GetData = async isRefresh => {
    try {
      let temp = await axios({
        url: `${link}/GetHome?userid=${lgdata.UserId}&nik=${lgdata.NIK}&ip=${lgdata.IP}&dept=${lgdata.HRDept}`,
        method: 'GET',
        contentType: 'application/json; charset=utf-8',
        headers: {
          Keys: lgdata.UserTkn
        }
      })
        .then(response => {
          DoIsiData(response.data);
        })
        .catch(err => {
          ISI.PopAlertFalcon('error', 'error', err.response?.data?.Message, '');
        });
    } catch (err) {
      ISI.PopAlertFalcon('error', 'error', err.response?.data?.Message, '');
    }
  };

  const DoIsiData = data => {
    setObj(data);
    setLsHistory(data.LsHistory);
    setLsBookmark(data.LsBookmark);
    setLsOutstanding(data.LsOutstanding);
  };

  const handleUpdateBookmark = async (favorite, id) => {
    var data = { ...Obj.Data };
    data.Id = id;
    var upobj = { ...Obj };
    if (!favorite) {
      upobj.ProsesId = 'SetFavorite';
    } else {
      upobj.ProsesId = 'DeleteFavorite';
    }
    upobj.Data = data;

    setObj(upobj);

    try {
      let temp = await axios({
        url: `${link}/ProsesMenu`,
        method: 'POST',
        data: upobj,
        contentType: 'application/json; charset=utf-8',
        headers: {
          Keys: lgdata.UserTkn
        }
      })
        .then(response => {
          DoIsiData(response.data);
        })
        .catch(err => {
          ISI.PopAlertFalcon('error', 'error', err.response.data.Message, '');
        });
    } catch (err) {
      ISI.PopAlertFalcon('error', 'error', err.response.data.Message, '');
    }
  };

  useEffect(() => {
    if (lgdata) {
      GetData();
    }
  }, []);

  useEffect(() => {
    if (seconds <= 0) return;

    const intervalId = setInterval(() => {
      setSeconds(prev => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [seconds]);

  const OpenPageWFA = async item => {
    var upobj = { ...Obj };
    upobj.DataWFA = item;
    upobj.ProsesId = 'OpenWFA';
    upobj.Keys = lgdata.Keys;
    try {
      let temp = await axios({
        url: `${link}/ProsesMenu`,
        method: 'POST',
        data: upobj,
        contentType: 'application/json; charset=utf-8',
        headers: {
          Keys: lgdata.UserTkn
        }
      })
        .then(response => {
          handleOpenPage(response.data.DataWFA);
        })
        .catch(err => {
          ISI.PopAlertFalcon('error', 'error', err.response.data.Message, '');
        });
    } catch (err) {
      ISI.PopAlertFalcon('error', 'error', err.response.data.Message, '');
    }
    // try {
    //   let temp = await axios({
    //     url: `${link}/OpenWFA`,
    //     method: 'POST',
    //     data: obj,
    //     contentType: 'application/json; charset=utf-8',
    //     headers: {
    //       Keys: lgdata?.UserTkn,
    //       UserTkn: lgdata?.Keys
    //     }
    //   })
    //     .then(response => {
    //       handleOpenPage(response.data.Data);
    //     })
    //     .catch(err => {
    //       ISI.PopAlertFalcon('error', 'error', err.response.data.Message, '');
    //     });
    // } catch (err) {
    //   ISI.PopAlertFalcon('error', 'error', err.response.data.Message, '');
    // }
  };

  // const OpenPageWFA = async obj => {
  //   try {
  //     let temp = await axios({
  //       url: `${link}/OpenWFA`,
  //       method: 'POST',
  //       data: obj,
  //       contentType: 'application/json; charset=utf-8',
  //       headers: {
  //         Keys: lgdata?.UserTkn,
  //         UserTkn: lgdata?.Keys
  //       }
  //     })
  //       .then(response => {
  //         handleOpenPage(response.data);
  //       })
  //       .catch(err => {
  //         ISI.PopAlertFalcon('error', 'error', err.response.data.Message, '');
  //       });
  //   } catch (err) {
  //     ISI.PopAlertFalcon('error', 'error', err.response.data.Message, '');
  //   }
  // };

  const handleOpenPage = data => {
    const url = data.Target;
    const type = data.TypeOpen;
    const mth = data.MethodApp;
    const encodedFinal = encodeURIComponent(data.Target);
    if (url) {
      if (type == 'P') {
        const screenWidth = window.screen.availWidth;
        const screenHeight = window.screen.availHeight;

        const width = screenWidth - 40;
        const height = screenHeight - 60;

        const left = (screenWidth - width) / 2;
        const top = (screenHeight - height) / 2;

        window.open(url, 'PrintWindow', `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes,toolbar=no,location=no`);
      } else if (type == 'M') {
        navigate(`/login/iframe-viewer/${encodedFinal}`);
      } else if (type == 'A') {
        navigate('/' + url);
      } else if (type == 'C' || type == 'I') {
        return;
      } else if (mth) {
        navigate(`/login/iframe-viewer/${encodedFinal}?type=MTH`);
      } else {
        navigate(`/login/iframe-viewer/${encodedFinal}?type=ERP`);
      }
    } else {
      return;
    }
  };

  const handleNotif = url => {
    const target = url.replace('~', '/').replace('%3F', '?');
    if (url) {
      navigate('/' + target);
    }
  };

  const handleOpenOutstanding = url => {
    const encodedTarget = encodeURIComponent(url);
    navigate(`/login/iframe-viewer/${encodedTarget}?type=ERP`);
  };

  return (
    <>
      <Row className="g-0 gap-3 h-100 flex-wrap d-flex">
        <Col className="d-flex flex-column gap-3 h-fit order-2 order-md-1">
          <Card className="h-fit shadow-none">
            <Card.Header className="px-0 pt-3 pb-2 d-flex justify-content-between align-items-center border-bottom border-dark-subtle mx-3">
              <div className="d-flex align-items-center gap-2">
                <SvgIcon name={'line-star'} size={16} />
                <h4 className="m-0 p-0 fs-8">Bookmark</h4>
              </div>
              <div className="bg-warning-highlight p-1 rounded-2 d-flex align-items-center justify-content-center">
                <p className="m-0 p-0 fs-11" style={{ color: '#333333' }}>
                  {lsBookmark?.length}/12
                </p>
              </div>
            </Card.Header>
            <Card.Body className="p-3">
              <Row className="g-0 gy-3 h-100">
                {lsBookmark.map((item, idx) => (
                  <Col key={idx} xs={3} lg={2} className="text-center">
                    <Link className="cursor-pointer h-100 d-flex flex-column align-items-center gap-1 text-decoration-none" to={ensureLeadingSlash(item.Url)}>
                      <div className="bg-primary-light p-2 d-flex justify-content-center align-items-center" style={{ borderRadius: '10px' }}>
                        {/* <SvgIcon name={item.icon} size={17} /> */}
                        <Image src={item.Icon} width={32} />
                      </div>
                      <div className="small lh-sm" style={{ whiteSpace: 'pre-line' }}>
                        {item.Description}
                      </div>
                    </Link>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
          <Card className="h-fit shadow-none">
            <Card.Header className="px-0 pt-3 pb-2 d-flex align-items-center border-bottom border-dark-subtle mx-3">
              <div className="d-flex align-items-center gap-2">
                <SvgIcon name={'clock-forward'} size={16} />
                <h4 className="m-0 p-0 fs-8">History Access</h4>
              </div>
            </Card.Header>
            <Card.Body className="p-3 pt-2">
              <div className="d-flex flex-column">
                {lsHistory.map((i, idx) => (
                  <div key={idx} className="d-flex align-items-start gap-1">
                    <div className="d-flex align-self-center cursor-pointer" onClick={() => handleUpdateBookmark(i.Favorite, i.Id)}>
                      <SvgIcon name={i.Favorite == '' || i.Favorite == null ? 'line-star' : 'fill-star'} size={14} />
                    </div>
                    <Link className="text-primary fs-10 m-0 cursor-pointer text-decoration-none custom-link" to={ensureLeadingSlash(i.Url)}>
                      {i.Description}
                    </Link>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
          <Card className="h-fit shadow-none">
            <Card.Header className="px-0 pt-3 pb-2 d-flex align-items-center border-bottom border-dark-subtle mx-3">
              <div className="d-flex align-items-center gap-2">
                <SvgIcon name={'logout'} size={16} />
                <h4 className="m-0 p-0 fs-8">Outstanding Transaction</h4>
              </div>
            </Card.Header>
            <Card.Body className="p-3 pt-2">
              <div className="d-flex flex-column">
                {lsOutstanding?.map((i, idx) => (
                  <div key={idx} className="d-flex justify-content-between align-items-center">
                    <p className="text-primary fs-10 m-0 cursor-pointer text-decoration-none custom-link" onClick={() => handleOpenOutstanding(i?.Url)}>
                      {i.MenuName}
                    </p>
                    {i.Type !== 'LINK' && (
                      <p className="text-danger fs-10 m-0 cursor-pointer" onClick={() => handleClose(idx)}>
                        Reset
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
          {CheckDev.isMobile && (
            <Card className="h-fit shadow-none">
              <Card.Header className="px-0 pt-3 pb-2 d-flex align-items-center border-bottom border-dark-subtle mx-3">
                <div className="d-flex align-items-center gap-2">
                  <SvgIcon name={'file-02'} size={16} />
                  <h4 className="m-0 p-0 fs-8">News</h4>
                </div>
              </Card.Header>
              <Card.Body className="p-3 pt-2">
                <div className="d-flex flex-column gap-1">
                  {news?.map((i, idx) => (
                    <div key={idx} className="d-flex align-items-start gap-1 fs-10">
                      <p className="m-0">{i.date}</p>
                      <p className="m-0">-</p>
                      <p className="m-0">{i.content}</p>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
        <Col md={5} className="d-flex flex-column gap-3 h-fit order-1 order-md-2">
          {Obj?.LsNotif?.length > 0 && (
            <div className="d-flex flex-column gap-3 overflow-auto" style={{ maxHeight: '150px' }}>
              {Obj?.LsNotif?.map((i, idx) => (
                <Card className="h-fit shadow-none rounded-2 cursor-pointer" key={idx} onClick={() => handleNotif(i.TargetUrl)}>
                  <Card.Body className="p-2 bg-danger-light d-flex align-items-center justify-content-between rounded-2">
                    <div className="d-flex align-items-center gap-2">
                      <div className="d-flex align-items-center justify-content-center p-2 bg-white" style={{ borderRadius: '10px' }}>
                        <SvgIcon name={'bagan'} size={16} />
                      </div>
                      <div className="d-flex flex-column gap-2 ">
                        <h5 className="fs-9 m-0 fw-semibold text-black">{i.Judul}</h5>
                        <div>
                          {/* <p className="fs-10 m-0 lh-sm text-black">{i.Pesan}</p> */}
                          <div className="fs-10 m-0 lh-sm text-black">
                            {i.TargetMsg &&
                              Object.entries(JSON.parse(i.TargetMsg)).map(([key, value]) => (
                                <div key={key}>
                                  <span>{key}:</span> {value}
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <TimerNotif expTime={i.ExpTime} />
                    {/* <div className="bg-danger text-white rounded-2 p-2">
                        <p className="fw-bold fs-8 m-0">{formatTime(seconds)}</p>
                      </div> */}
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
          {Obj?.LsWfa?.length > 0 && (
            <div className="h-fit">
              <Accordion
                className="d-flex flex-column gap-2 overflow-auto"
                style={{ maxHeight: '220px' }}
                onSelect={k => {
                  setActiveKey(k);
                }}
              >
                {Obj?.LsWfa?.map((i, idx) => (
                  <Accordion.Item eventKey={idx.toString()} key={idx} className="border-0 bg-transparent">
                    <CustomToggle eventKey={idx.toString()}>
                      <div className="bg-light-subtle d-flex align-items-center justify-content-between p-2 rounded-2">
                        <div className="d-flex gap-2 align-items-center">
                          <div className={`d-flex p-2 rounded-2 bg-${i.Color}`}>
                            <p className="fs-10 m-0 d-flex align-items-center justify-content-center text-white" style={{ width: '12px', height: '12px' }}>
                              {i.TotalCount}
                            </p>
                          </div>
                          <p className="fs-10 m-0">{i.Items?.find(i => (i.TypeOpen == 'C' || i.TypeOpen == 'I') && i.Target) ? 'Completed Approval' : i.GroupName}</p>
                        </div>
                        <SvgIcon name="chevron-down" size={14} />
                      </div>
                    </CustomToggle>
                    <Accordion.Collapse eventKey={idx.toString()}>
                      <div className="mt-2 d-flex flex-column gap-2">
                        {i.Items?.map((subItm, subIdx) => (
                          <div
                            key={subIdx}
                            className={`p-2 rounded-2 bg-${i.Color}-highlight d-flex flex-column gap-1 cursor-pointer text-decoration-none`}
                            onClick={() => {
                              if (subItm.TypeOpen !== 'C' && subItm.TypeOpen !== 'I') {
                                OpenPageWFA(subItm);
                              }
                            }}
                          >
                            {subItm.DocNo && (
                              <div className="d-flex align-items-center justify-content-between text-black">
                                <p className={`fs-9 fw-bold m-0 text-${subItm.LabelClass}`}>{subItm.DocNo}</p>
                                <SvgIcon name={'arrow-right'} size={16} className="cursor-pointer" />
                              </div>
                            )}
                            <div className="d-flex align-items-center gap-2">
                              <p className="bg-danger p-2 rounded-3 text-white fs-11 m-0">{subItm.Days} Days</p>
                              <p className="fs-10 m-0 text-black">{formatDateNumber(subItm.DocDt)}</p>
                            </div>
                            <p className="fs-10 m-0 text-black" dangerouslySetInnerHTML={{ __html: subItm.Desc }} />
                          </div>
                        ))}
                        {/* {notification?.list?.map((subItm, subIdx) => (
                                <p>Test</p>
                              ))} */}
                      </div>
                    </Accordion.Collapse>
                  </Accordion.Item>
                ))}
              </Accordion>
            </div>
          )}
          <Card className="h-fit shadow-none">
            <Card.Body className="p-2">
              <div className="d-flex flex-column gap-1">
                <Row className="g-0 d-flex gap-1">
                  <Col xs={12} xl={7}>
                    <div className="p-1 d-flex flex-column gap-3 rounded-2 w-100">
                      <div className="d-flex justify-content-between align-items-center">
                        <SvgIcon name={'chevron-down'} size={16} style={{ rotate: '90deg' }} className="cursor-pointer" onClick={() => changeWeek(-1)} />
                        <h6 className="m-0 fs-9 fw-semibold">{formatMonthYear(new Date())}</h6>
                        <SvgIcon name={'chevron-down'} size={16} style={{ rotate: '-90deg' }} className="cursor-pointer" onClick={() => changeWeek(1)} />
                      </div>
                      <Row className="g-0 d-flex gap-2 flex-nowrap overflow-x-auto" style={{ scrollbarWidth: 'thin' }}>
                        {weekDays.map((date, index) => {
                          const isToday = new Date().toDateString() === date.toDateString();
                          const isSelected = selectedDate && selectedDate.toDateString() === date.toDateString();

                          return (
                            <Col
                              key={index}
                              onClick={() => setSelectedDate(date)}
                              className={`d-flex flex-column gap-2 border border-300 rounded-2 align-items-center p-1 position-relative ${
                                isSelected ? 'bg-primary-light text-primary border-primary-light' : ''
                              }`}
                              style={{ width: '45px', cursor: 'pointer', transition: '0.2s' }}
                            >
                              <h6 className={`m-0 fs-10 fw-semibold ${isSelected || (isToday && !isSelected) ? 'text-primary' : ''}`}>{date.toLocaleDateString('en-US', { weekday: 'short' })}</h6>
                              {isToday && !isSelected && <div className="rounded-circle bg-primary position-absolute" style={{ width: '4px', height: '4px', top: '45%' }}></div>}
                              <p className={`m-0 fs-9 ${(isSelected || (isToday && !isSelected)) && 'text-primary fw-bold'}`}>{date.getDate()}</p>
                            </Col>
                          );
                        })}
                      </Row>
                    </div>
                  </Col>
                  <Col>
                    <div className="px-2 py-3 d-flex flex-column bg-200 gap-2 w-100 justify-content-center h-100 rounded-2">
                      <div className="d-flex align-items-center gap-1">
                        <SvgIcon name={'clock-forward'} size={16} />
                        <h6 className="fw-bold fs-10 m-0">Clock In</h6>
                      </div>
                      <p className="m-0">07:45:52</p>
                    </div>
                  </Col>
                  <Col>
                    <div className="px-2 py-3 d-flex flex-column bg-200 gap-2 w-100 justify-content-center h-100 rounded-2">
                      <div className="d-flex align-items-center gap-1">
                        <SvgIcon name={'clock-forward'} size={16} />
                        <h6 className="fw-bold fs-10 m-0">Clock Out</h6>
                      </div>
                      <p className="m-0">-:-:-</p>
                    </div>
                  </Col>
                </Row>
                <div className="d-flex align-items-center p-1 px-2 gap-2 bg-primary-light rounded-2 text-black">
                  <SvgIcon name={'date-time'} size={24} />
                  <div className="d-flex flex-column">
                    <p className="m-0 fs-10">IST Coordination Meeting 26 Dec 25</p>
                    <p className="m-0 fs-11">Fri 1/9/2026 9:00 PM - 10:00 PM</p>
                  </div>
                </div>
                <div className="d-flex align-items-center p-1 px-2 gap-2 bg-primary-light rounded-2 text-black">
                  <SvgIcon name={'date-time'} size={24} />
                  <div className="d-flex flex-column">
                    <p className="m-0 fs-10">Coordination Industry 4.0</p>
                    <p className="m-0 fs-11">Fri 1/9/2026 10:00 PM - 11:00 PM</p>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
          {!CheckDev.isMobile && (
            <Card className="h-fit shadow-none">
              <Card.Header className="px-0 pt-3 pb-2 d-flex align-items-center border-bottom border-dark-subtle mx-3">
                <div className="d-flex align-items-center gap-2">
                  <SvgIcon name={'file-02'} size={16} />
                  <h4 className="m-0 p-0 fs-8">News</h4>
                </div>
              </Card.Header>
              <Card.Body className="p-3 pt-2">
                <div className="d-flex flex-column gap-1">
                  {news?.map((i, idx) => (
                    <div key={idx} className="d-flex align-items-start gap-1 fs-10">
                      <p className="m-0">{i.date}</p>
                      <p className="m-0">-</p>
                      <p className="m-0">{i.content}</p>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>     
      <Modal show={isMobile} onHide={() => setisMobile(false)} dialogClassName="modal-80w" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton></Modal.Header>
        <div style={{ height: self == top ? htab + 10 : htabe + 10 }}>
          <Modal.Body className="h-100">
            <iframe src={wfaUrl} className={`w-100 h-100 ${wfaUrl ? 'visible' : 'invisible'}`}></iframe>
          </Modal.Body>
        </div>
      </Modal>
    </>
  );
};

export default Home;
