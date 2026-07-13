import {
  faFileAlt,
  faFileExport,
  faPlus,
  faSearch,
  faSignOutAlt, faFile, faUser,
  faFileSignature,
  faEdit, faTrashAlt, faFilePdf, faHistory
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import GridTable from 'components/form/GridTable';
import { format } from 'date-fns';
import IsiDateTimeRange from 'components/form/IsiDateTimeRange';
import IsiTxt from 'components/form/IsiTxt';
import BtnMenu from 'components/navbar/headermenu/BtnMenu';
import useIsMobile from 'hooks/useIsMobile';
import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { Button, Col, Modal, Card, Nav, Row, Badge } from 'react-bootstrap';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { useAppContext } from 'Main';
import * as ISI from 'script/ISI.js';
import Flex from 'components/common/Flex';

const mst061_StdAcsMenuListHeader = () => {
  const URL = process.env.REACT_APP_URL_API;
  const link = `${URL}api/mst061_StdAcsMenu`;
  const [SearchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [isParam, setisParam] = useState(false);
  const [mdlhis, setmdlhis] = useState(false);
  const [isDesktop, setDesktop] = useState(window.innerWidth > 750);
  const [isMobile, setMobile] = useState(window.innerWidth <= 750);
  const isrunn = useRef(false);
  const navigate = useNavigate();
  var lgdata = JSON.parse(localStorage.getItem('userData'));
  const CheckDev = useIsMobile();
  const [list, setList] = useState([]);
  const [listhistory, setlisthistory] = useState([]);
  const [lsdepartement, setlsdepartement] = useState([]);
  const [lssection, setlssection] = useState([]);
  const [lsunit, setlsunit] = useState([]);
  const [fDoc, setfDoc] = useState('');
  const [cdepf, setcdepf] = useState('');
  const [csecf, setcsecf] = useState('');
  const [cuntf, setcuntf] = useState('');
  const [cgolf, setcgolf] = useState('');
  const datedef = new Date();
  const datestart = new Date(datedef.getFullYear(), datedef.getMonth(), 1);
  const datefinish = new Date();
  const [fDocDateF, setfDocDateF] = useState(datestart);
  const [fDocDateT, setfDocDateT] = useState(datefinish);
  const [Obj, setObj] = useState({
    FormPAIDetailList: []
  });
  const [lsgolongan, setGolongan] = useState([
    { Value: '1', Text: '1 - Helper' },
    { Value: '2', Text: '2 - Operator / Jr. Admin / Jr. Technician' },
    { Value: '3', Text: '3 - Foreman / Sr. Admin / Sr. Technician' },
    { Value: '4', Text: '4 - Supervisor' },
    { Value: '5', Text: '5 - Section Head' },
    { Value: '6', Text: '6 - Manager' },
    { Value: '7', Text: '7 - General Manager' },
    { Value: '8', Text: '8 - Director' }
  ]);
  const getParam = () => {
    let param = `?param=`;
    param += `${cdepf}|${csecf}|${cuntf}|${cgolf}`;
    return param;
  };

  let { width, height, breakpoints } = useBreakpoints();
  let { act } = useParams();
  let htabo = height;
  const {
    config: { isDark, isRTL, isNavbarVerticalCollapsed }
  } = useAppContext();

  useEffect(() => {
    if (act == 'N') {
      SAMCheck();
    }
    if (isrunn.current === false) {

      let paramUrl = SearchParams.get('param');
      if (paramUrl) {
        const param = paramUrl.split('|');
        if (param.length > 0) {
          setisParam(true);
          setcdepf(param[0]);
          setcsecf(param[1]);
          setcuntf(param[2]);
          setcgolf(param[3]);
        } else {
          setfDocDateF(datestart);
          setfDocDateT(new Date());
          setisParam(true);
        }
      } else {
        setisParam(true);
      }

      return () => {
        isrunn.current = true;
      };
    }

    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  }, [isDark, isNavbarVerticalCollapsed]);

  useLayoutEffect(() => {
    if (isParam) {
      getList();
      setisParam(false);
    }
    GetDdlDepts();
    if (cdepf != '') {
      GetDdlList('S', cdepf);
    }
    if (cdepf != '' && csecf != '') {
      GetDdlList('U', `${cdepf}|${csecf}`);
    }
  }, [isParam]);

  const onSearch = async () => {
    getList();
    setIsOpen(prev => !prev);
  };
  const onClose = async () => {
    setIsOpen(prev => !prev);
  };
  const styleFilter = {
    overflow: 'hidden',
    height: isOpen ? '80%' : 0,
    transition: 'height 1s ease-out',
    top: self == top ? '12vh' : '8vh'
  };

  const updateMedia = () => {
    setDesktop(window.innerWidth > 750);
    setMobile(window.innerWidth <= 750);
  };

  const GetDdlList = async (kd, val) => {
    try {
      let temp = await axios({
        url: `${link}/GetDdlList?kd=${kd}&val=${val}`,
        method: 'GET',
        contentType: 'application/json; charset=utf-8',
        headers: {
          Keys: lgdata.UserTkn
        }
      });
      if (kd == 'S') {
        setlssection(temp.data);
      } else if (kd == 'U') {
        setlsunit(temp.data);
      }
    } catch (err) {
      ISI.PopAlertFalcon('error', 'error', err.response.message, '');
    }
  };

  const GetDdlDepts = async () => {
    try {
      let temp = await axios({
        url: `${URL}api/Utility/GetDepts`,
        method: 'GET',
        contentType: 'application/json; charset=utf-8',
        headers: {
          Keys: lgdata.UserTkn
        }
      });
      setlsdepartement(temp.data);
    } catch (err) {
      ISI.PopAlertFalcon('error', 'error', err.response.message, '');
    }
  };

  const getList = async () => {
    try {
      let obj = { ...list };
      obj.DocumentNumber = fDoc;
      obj.DepartementFilter = cdepf;
      obj.SectionFilter = csecf;
      obj.UnitFilter = cuntf;
      obj.GolonganFilter = cgolf;
      if (
        fDocDateF != '' &&
        fDocDateF != undefined &&
        fDocDateF != 'Invalid Date'
      ) {
        obj.DateFromFilter = format(new Date(fDocDateF.getFullYear(), fDocDateF.getMonth(), fDocDateF.getDate()), 'yyyyMMdd');
      }
      obj.DateToFilter = '';
      if (
        fDocDateT != '' &&
        fDocDateT != undefined &&
        fDocDateT != 'Invalid Date'
      )
        obj.DateToFilter = format(fDocDateT, 'yyyyMMdd');
      obj.DepUserLogin = lgdata.KdDept;
      obj.UserLogin = lgdata.UserId;
      obj.PActivity = act;
      let temp = await axios({
        url: `${link}/GetListHeader`,
        method: 'POST',
        data: obj,
        contentType: 'application/json; charset=utf-8',
        headers: {
          Keys: lgdata.UserTkn
        }
      })
        .then(response => {
          //response.data.Keterangan = response.data.Keterangan.replace('\n', ' ')
          // response.data.forEach(e => {
          //   e.Keterangan = e.Keterangan.replace('\n', ' ')
          // });
          setList(response.data);
        })
        .catch(err => {
          ISI.PopAlertFalcon('error', 'error', err.message, '');
        });

    } catch (error) {
      ISI.PopAlertFalcon('', 'Error', error.message);
    }
  };

  const getListHistory = async (dep, sec, unt, gol) => {
    try {
      let obj = { ...list };
      obj.DepartementParam = dep;
      obj.SectionParam = sec;
      obj.UnitParam = unt;
      obj.GolonganParam = gol;
      obj.UserLogin = lgdata.UserId;
      obj.PActivity = act;
      let temp = await axios({
        url: `${link}/GetListHistory`,
        method: 'POST',
        data: obj,
        contentType: 'application/json; charset=utf-8',
        headers: {
          Keys: lgdata.UserTkn
        }
      })
        .then(response => {
          setlisthistory(response.data);
        })
        .catch(err => {
          ISI.PopAlertFalcon('error', 'error', err.message, '');
        });

    } catch (error) {
      ISI.PopAlertFalcon('', 'Error', error.message);
    }
  };

  const SAMCheck = async () => {
    try {
      var obj = {};

      let temp = await axios({
        url: `${link}/cekSAMTemp?IP=${lgdata.IP}`,
        method: 'GET',
        contentType: 'application/json; charset=utf-8',
        headers: {
          Keys: lgdata.UserTkn
        }
      });
      if (temp.data != '') {
        let ar = temp.data.split('|');
        navigate(`/master/mst061_StdAcsMenuEntry/${ar[0]}/EH/${getParam()}&dep=${ar[1]}&sec=${ar[2]}&unt=${ar[3]}&gol=${ar[4]}`);
      }
    } catch (err) {
      ISI.PopAlertFalcon('error', 'error', err.response.message, '');
    }
  };

  const DeleteSAM = async DocumentNumber => {

    try {
      var obj = {};
      obj.ProsesId = 'DeleteSAM';
      obj.UpdatedBy = lgdata.UserId;
      obj.UpdatedIP = lgdata.IP;
      obj.DocumentNumber = DocumentNumber;

      let temp = await axios({
        url: `${link}/Post`,
        method: 'POST',
        data: obj,
        contentType: 'application/json; charset=utf-8',
        headers: {
          Keys: lgdata.UserTkn
        }
      });

      var res = (await temp).data;
      if (res.Ket1) {
        ISI.PopAlertFalcon('Warning', 'Warning', res.Ket1);
      } else {
        getList(res);
      }
    } catch (error) {
      ISI.PopAlertFalcon('error', 'error', error.response.message, '');
    }
  };

  const EditSAM = async DocumentNumber => {
    try {
      var obj = {};
      obj.ProsesId = 'EditSAM';
      obj.DocumentNumber = DocumentNumber;
      obj.CreatedBy = lgdata.UserId;
      obj.CreatedIP = lgdata.IP;

      let temp = await axios({
        url: `${link}/Post`,
        method: 'POST',
        data: obj,
        contentType: 'application/json; charset=utf-8',
        headers: {
          Keys: lgdata.UserTkn
        }
      });

      var res = (await temp).data;
      if (res.Ket1) {
        ISI.PopAlertFalcon('Warning', 'Warning', res.Ket1);
      } else {
        navigate(`/master/mst061_StdAcsMenuEntry/${DocumentNumber}/EH/${getParam()}`);
      }
    } catch (error) {
      ISI.PopAlertFalcon('error', 'error', error.response.message, '');
    }
  };

  const CreateSAM = async (dep, sec, unt, gol) => {
    try {
      var obj = {};
      obj.DepartementUser = lgdata.KdDept;
      if (dep != '') {
        obj.Departement = dep;
      }
      if (sec != '') {
        obj.Section = sec;
      }
      if (unt != '') {
        obj.Unit = unt;
      }
      if (gol != '') {
        obj.Golongan = gol;
      }
      obj.CreatedBy = lgdata.UserId;
      obj.CreatedIP = lgdata.IP;
      obj.ProsesId = 'CreateSAM';

      let temp = await axios({
        url: `${link}/Post`,
        method: 'POST',
        data: obj,
        contentType: 'application/json; charset=utf-8',
        headers: {
          Keys: lgdata.UserTkn
        }
      });
      var res = (await temp).data;
      if (res.Ket1) {
        ISI.PopAlertFalcon('Warning', 'Warning', res.Ket1, '');
      } else {
        let param = '';
        if (dep != '' && sec != '' && unt != '' && gol != '') {
          param += `&dep=${dep}&sec=${sec}&unt=${unt}&gol=${gol}`;
        }
        navigate(`/master/mst061_StdAcsMenuEntry/${res.DocumentNumber}/EH/${getParam()}${param}`);
      }
    } catch (error) {
      ISI.PopAlertFalcon('error', 'error', error.response.Message, '');
    }
  };

  const handleAction = e => {
    let pact = '';
    let key = '';
    let dep = '';
    let sec = '';
    let unt = '';
    let gol = '';
    if (e.currentTarget) {
      pact = e.currentTarget.id;
      key = e.currentTarget.name;
      let ar = e.currentTarget.name.split('|');
      dep = ar[0];
      sec = ar[1];
      unt = ar[2];
      gol = ar[3];
    } else {
      let ar = e.split('|');
      pact = ar[0];
      key = ar[1];
    }
    var upData = list.find(c => c.DocumentNumber == key);
    var param = ``;
    if (pact === 'BtnEditG') {
      //EditSAM(key);
      CreateSAM(dep, sec, unt, gol);
    } else if (pact === 'BtnViewG') {
      navigate(`/master/mst061_StdAcsMenuEntry/1/VH/${getParam()}&dep=${dep}&sec=${sec}&unt=${unt}&gol=${gol}`);
    } else if (pact === 'BtnHistory') {
      getListHistory(dep, sec, unt, gol);
      setmdlhis(true);
    }
  };

  const mappingHeader = [
    [
      { text: 'Action', width: '10%' },
      { text: 'Departement', width: '10%' },
      { text: 'Seksi', width: '10%' },
      { text: 'Unit', width: '10%' },
      { text: 'Golongan', width: '10%' },
      { text: 'Total Menu ERP', width: '10%' },
      { text: 'Total Menu Mobile', width: '10%' },
      { text: 'Total Menu WHM', width: '10%' },
      { text: 'Total Menu APP', width: '10%' }
    ]
  ];

  let mappingTable = [
    {
      title: '',
      propName: 'Action',
      isNumber: false,
      isAction: true,
      actcode: 'E,V',
      addbtn: [
        {
          icn: faHistory,
          id: 'BtnHistory',
          nm: '',
          color: 'text-Primary',
          tool: 'History',
          propNm: 'BtnHistory'
        },
      ],
      idEdit: 'KodeHeader',
      class: 'text-center',
      col: '12'
    },
    { propName: 'DepartementDesc' },
    { propName: 'SectionDesc' },
    { propName: 'UnitDesc', class: 'text-nowrap' },
    { propName: 'GolonganDesc', class: 'text-nowrap' },
    { propName: 'CountERP', class: 'text-nowrap text-center' },
    { propName: 'CountMobile', class: 'text-nowrap text-center' },
    { propName: 'CountWHM', class: 'text-nowrap text-center' },
    { propName: 'CountAPP', class: 'text-nowrap text-center' }
  ];

  const handleActionHistory = e => {
    let pact = '';
    let key = '';
    if (e.currentTarget) {
      pact = e.currentTarget.id;
      key = e.currentTarget.name;
    } else {
      let ar = e.split('|');
      pact = ar[0];
      key = ar[1];
    }
    var upData = list.find(c => c.DocumentNumber == key);
    var param = ``;
    if (pact === 'BtnEditG') {
      EditSAM(key);
    } else if (pact === 'BtnViewG') {
      navigate(`/master/mst061_StdAcsMenuEntry/${key}/V${act}H/${getParam()}`);
    } else if (pact === 'BtnApproveG') {
      navigate(`/master/mst061_StdAcsMenuEntry/${key}/AH/${getParam()}`);
    } else if (pact === 'BtnDisApproveG') {
      navigate(`/master/mst061_StdAcsMenuEntry/${key}/SH/${getParam()}`);
    } else if (pact === 'BtnDelG') {
      ISI.confirmISI({
        title: 'Konfirmasi',
        msg: `Hapus Document Number ${upData.DocumentNumber} ?`,
        yesText: 'Yes',
        yesAction: () => DeleteSAM(key),
        noText: 'No',
        noAction: () => { }
      });
    }
  };

  const mappingHeaderHistory = [
    [
      { text: 'Action', width: '6%' },
      { text: 'Document Number', width: '10%' },
      { text: 'Date', width: '6%' },
      { text: 'User Requestor', width: '10%' },
      { text: 'Departemen', width: '10%' },
      { text: 'Seksi', width: '10%' },
      { text: 'Unit', width: '10%' },
      { text: 'Golongan', width: '10%' },
      { text: 'Status', width: '20%' }
    ]
  ];

  let mappingTableHistory = [
    {
      title: '',
      propName: 'Action',
      isNumber: false,
      isAction: true,
      actcode: 'D,E,V' + ((act == 'A') ? ',A' : (act == 'S') ? ',U' : ''),
      actcond: [
        { btncd: 'D', propNm: 'UserCreate', validprop: 'SJ' + lgdata.UserId },
        { btncd: 'E', propNm: 'UserCreate', validprop: 'SJ' + lgdata.UserId },
        { btncd: 'U', propNm: 'UserCreate', validprop: 'U' + lgdata.UserId },
        { btncd: 'A', propNm: 'ValidApp', validprop: true }
      ],
      idEdit: 'DocumentNumber',
      class: 'text-center',
      col: '12'
    },
    { propName: 'DocumentNumber' },
    { propName: 'StrTgl' },
    { propName: 'UserDesc' },
    { propName: 'DepartementDesc' },
    { propName: 'SectionDesc' },
    { propName: 'UnitDesc', class: 'text-nowrap' },
    { propName: 'GolonganDesc', class: 'text-nowrap' },
    { propName: 'StatusDesc' }
  ];

  return (
    <>
      <Row className="g-0">
        <Col lg="12">
          <div className="card">
            <div className="card-header bg-light ps-1 pe-1 pt-2 pb-2">
              <div className="row">
                <div className="col-auto pt-1">
                  <h5 id="LblHdr" className="mb-0">
                    {act == 'A' ? 'Approve' : act == 'S' ? 'Disapprove' : ''} Summary Standard Access Menu
                  </h5>
                </div>
                <div className="col">
                  <Nav className="justify-content-end">
                    {(act == 'N') ? (
                      <BtnMenu
                        id="btnAdd"
                        title={'Add New Standard Access Menu'}
                        icon={faPlus}
                        color="text-info"
                        evclick={e => CreateSAM('', '', '', '')}
                      ></BtnMenu>
                    ) : (
                      ''
                    )}
                    <BtnMenu
                      id="BtnSearch"
                      title="Search"
                      evclick={() => setIsOpen(prev => !prev)}
                      icon={faSearch}
                      color="text-info"
                    ></BtnMenu>
                    <BtnMenu
                      id="BtnBack"
                      title="Back"
                      icon={faSignOutAlt}
                      color="text-info"
                      evclick={e => {
                        if (self == top) {
                          navigate(`/`);
                        } else {
                          localStorage.removeItem('ERPMenu');

                          window.parent.postMessage(
                            {
                              func: 'BackFApp',
                              message: 'Message text from iframe.'
                            },
                            '*'
                          );
                        }
                      }}
                    ></BtnMenu>
                  </Nav>
                </div>
              </div>
            </div>
            {!CheckDev.isMobile ? (
              <div className="card-body" style={{ height: htabo - 60 }}>
                <div className="d-flex">
                  <GridTable
                    datas={list}
                    clsname="dvListDtl mt-1"
                    maping={mappingTable}
                    headers={mappingHeader}
                    parentFunction={handleAction}
                    tbstyle={{
                      width: 1455,
                      height: '100%'
                    }}
                    dvstyle={{
                      width: '1470px',
                      height: '100%',
                      maxHeight: htabo - 110
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="card-body" style={{ minHeight: htabo - 110 }}>
                {list.map(cl => {
                  return (
                    <div className="row g-1">
                      <div className="col-12 col-lg-4">
                        <div className="border border-1 border-300 rounded-2 p-2 ask-analytics-item position-relative mb-1">
                          <div className="row g-0">
                            <div className="col-12">
                              <div className="d-flex align-items-center mb-1">
                                <span className="text-primary fa-2x">
                                  <FontAwesomeIcon icon={faFile} />
                                </span>
                                <a className="text-decoration-none w-100" href="#!">
                                  <h6 className="ps-2 fs--1 text-1000 w-100 ">
                                    <span className="text-secondary pe-1">
                                      Departement :
                                    </span>
                                    {`${cl.DepartementDesc}`}
                                    <br />
                                    <span className="text-secondary pe-1">
                                      Section :
                                    </span>
                                    {`${cl.SectionDesc}`}
                                    <br />
                                    <span className="text-secondary pe-1">
                                      Unit :
                                    </span>
                                    {`${cl.UnitDesc}`}
                                    <br />
                                    <span className="text-secondary pe-1">
                                      Golongan :
                                    </span>
                                    {`${cl.GolonganDesc}`}
                                    <br />
                                  </h6>
                                </a>
                              </div>
                            </div>
                            <div className="col-12 text-center">
                              <div>
                                <span
                                  className={`text-success  fa-1x pointer ${(cl.ValidApp && act == 'A') ? 'm-2' : 'd-none'}`}
                                  title="Approve"
                                  role="button"
                                  onClick={() => {
                                    handleAction('BtnApproveG|' + cl.DocumentNumber);
                                  }}
                                >
                                  <FontAwesomeIcon icon={faFileSignature} />
                                </span>
                                <span
                                  className={`text-danger fa-1x pointer ${(cl.UserCreate == 'U' + lgdata.UserId && act == 'S') ? 'm-2' : 'd-none'}`}
                                  title="Disapprove"
                                  role="button"
                                  onClick={() => {
                                    handleAction('BtnDisapproveG|' + cl.DocumentNumber);
                                  }}
                                >
                                  <FontAwesomeIcon icon={faFileSignature} />
                                </span>
                                <span
                                  className={`text-danger fa-1x pointer ${cl.UserCreate == 'SJ' + lgdata.UserId ? 'm-2' : 'd-none'}`}
                                  title="Delete"
                                  role="button"
                                  onClick={() => {
                                    handleAction('BtnDelG|' + cl.DocumentNumber);
                                  }}
                                >
                                  <FontAwesomeIcon icon={faTrashAlt} />
                                </span>
                                <span
                                  className={`text-warning  fa-1x pointer ${cl.UserCreate == 'SJ' + lgdata.UserId ? 'm-2' : 'd-none'}`}
                                  title="Edit"
                                  role="button"
                                  onClick={() => {
                                    handleAction('BtnEditG|' + cl.DocumentNumber);
                                  }}
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                </span>
                                <span
                                  className="text-success m-2 fa-1x pointer pe-1"
                                  title="View"
                                  role="button"
                                  onClick={() => {
                                    handleAction('BtnViewG|' + cl.DocumentNumber);
                                  }}
                                >
                                  <FontAwesomeIcon icon={faFileAlt} />
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div></div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="form-boxentry bg-light" style={styleFilter}>
            <div className="card">
              <div className="card-body">
                <div className="row g-1 d-flex d-row">
                  <div className="col-lg-2 col-12">
                    <IsiTxt
                      id="ddlDepartement"
                      label="Departement"
                      typ="select"
                      obj={lsdepartement}
                      val={cdepf}
                      onchange={e => {
                        setcdepf(e.target.value);
                        setlssection([]);
                        setlsunit([]);
                        setcsecf('');
                        setcuntf('');
                        if (e.target.value != '') {
                          GetDdlList('S', e.target.value);
                        }
                      }}
                    ></IsiTxt>
                  </div>
                  <div className="col-lg-2 col-12">
                    <IsiTxt
                      id="ddlSection"
                      label="Seksi"
                      typ="select"
                      obj={lssection}
                      val={csecf}
                      onchange={e => {
                        setcsecf(e.target.value);
                        setlsunit([]);
                        setcuntf('');
                        if (e.target.value != '') {
                          GetDdlList('U', `${cdepf}|${e.target.value}`);
                        }
                      }}
                    ></IsiTxt>
                  </div>
                  <div className="col-lg-2 col-12">
                    <IsiTxt
                      id="ddlUnit"
                      label="Unit"
                      typ="select"
                      obj={lsunit}
                      val={cuntf}
                      onchange={e => {
                        setcuntf(e.target.value);
                      }}
                    ></IsiTxt>
                  </div>
                  <div className="col-lg-2 col-12">
                    <IsiTxt
                      id="ddlGolongan"
                      label="Golongan"
                      typ="select"
                      obj={lsgolongan}
                      val={cgolf}
                      onchange={e => {
                        setcgolf(e.target.value);
                      }}
                    ></IsiTxt>
                  </div>
                </div>
              </div>
              <div className="card-footer">
                <div></div>
                <Button
                  className="btn btn-sm btn-primary me-2"
                  id="btnfSearch"
                  name="Search"
                  onClick={onSearch}
                >
                  Search
                </Button>
                <Button
                  className="btn btn-sm btn-secondary me-2"
                  id="btnfClose"
                  name="Close"
                  onClick={onClose}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      <Modal
        show={mdlhis}
        onHide={e => {
          setmdlhis(false);
        }}
        backdrop="static"
        keyboard={false}
        size="xl"
      >
        <Modal.Header className="p-1 ps-3 pe-3 " closeVariant={isDark ? 'white' : undefined} closeButton>
          <Modal.Title className="text-white">
            <h5 className="mt-1">History Standard Access Menu</h5>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-2 px-3 ">
          <div>
            <div className="row g-0 d-flex align-items-center">
              <div className="col-12 ps-1">
                {!CheckDev.isMobile ? (
                  <div className="card-body overflow-auto" style={{ height: htabo - 160 }}>
                    <div className="d-flex">
                      <GridTable
                        datas={listhistory}
                        clsname="dvListDtl mt-1"
                        maping={mappingTableHistory}
                        headers={mappingHeaderHistory}
                        parentFunction={handleActionHistory}
                        tbstyle={{
                          width: width - 500,
                          height: '100%'
                        }}
                        dvstyle={{
                          width: width - 500,
                          height: '100%',
                          maxHeight: htabo - 110
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="card-body" style={{ minHeight: htabo - 110 }}>
                    {listhistory.map(cl => {
                      return (
                        <div className="row g-1">
                          <div className="col-12 col-lg-4">
                            <div className="border border-1 border-300 rounded-2 p-2 ask-analytics-item position-relative mb-1">
                              <div className="row g-0">
                                <div className="col-12">
                                  <div className="d-flex align-items-center mb-1">
                                    <span className="text-primary fa-2x">
                                      <FontAwesomeIcon icon={faFile} />
                                    </span>
                                    <a className="text-decoration-none w-100" href="#!">
                                      <h6 className="fs-9 text-1000 mb-0 ps-2 text-truncate" style={{ maxWidth: '98%' }}>{`${cl.DocumentNumber} - ${cl.StrTgl} `}</h6>
                                      <h6 className="ps-2 fs--1 text-1000 w-100 ">
                                        <span className="text-secondary pe-1">
                                          Departement :
                                        </span>
                                        {`${cl.DepartementDesc}`}
                                        <br />
                                        <span className="text-secondary pe-1">
                                          Section :
                                        </span>
                                        {`${cl.SectionDesc}`}
                                        <br />
                                        <span className="text-secondary pe-1">
                                          Unit :
                                        </span>
                                        {`${cl.UnitDesc}`}
                                        <br />
                                        <span className="text-secondary pe-1">
                                          Golongan :
                                        </span>
                                        {`${cl.GolonganDesc}`}
                                        <br />
                                        <span className="text-primary pe-1">
                                          <FontAwesomeIcon icon={faUser} />
                                        </span>
                                        <span className="text-secondary pe-1">
                                          User Requestor :
                                        </span>{cl.UserDesc}
                                        <br />
                                        <Badge bg="success" className="me-1 mt-1 fs-11">
                                          {cl.StatusDesc}
                                        </Badge>
                                      </h6>
                                    </a>
                                  </div>
                                </div>
                                <div className="col-12 text-center">
                                  <div>
                                    <span
                                      className={`text-success  fa-1x pointer ${(cl.ValidApp && act == 'A') ? 'm-2' : 'd-none'}`}
                                      title="Approve"
                                      role="button"
                                      onClick={() => {
                                        handleActionHistory('BtnApproveG|' + cl.DocumentNumber);
                                      }}
                                    >
                                      <FontAwesomeIcon icon={faFileSignature} />
                                    </span>
                                    <span
                                      className={`text-danger fa-1x pointer ${(cl.UserCreate == 'U' + lgdata.UserId && act == 'S') ? 'm-2' : 'd-none'}`}
                                      title="Disapprove"
                                      role="button"
                                      onClick={() => {
                                        handleActionHistory('BtnDisapproveG|' + cl.DocumentNumber);
                                      }}
                                    >
                                      <FontAwesomeIcon icon={faFileSignature} />
                                    </span>
                                    <span
                                      className={`text-danger fa-1x pointer ${cl.UserCreate == 'SJ' + lgdata.UserId ? 'm-2' : 'd-none'}`}
                                      title="Delete"
                                      role="button"
                                      onClick={() => {
                                        handleActionHistory('BtnDelG|' + cl.DocumentNumber);
                                      }}
                                    >
                                      <FontAwesomeIcon icon={faTrashAlt} />
                                    </span>
                                    <span
                                      className={`text-warning  fa-1x pointer ${cl.UserCreate == 'SJ' + lgdata.UserId ? 'm-2' : 'd-none'}`}
                                      title="Edit"
                                      role="button"
                                      onClick={() => {
                                        handleActionHistory('BtnEditG|' + cl.DocumentNumber);
                                      }}
                                    >
                                      <FontAwesomeIcon icon={faEdit} />
                                    </span>
                                    <span
                                      className="text-success m-2 fa-1x pointer pe-1"
                                      title="View"
                                      role="button"
                                      onClick={() => {
                                        handleActionHistory('BtnViewG|' + cl.DocumentNumber);
                                      }}
                                    >
                                      <FontAwesomeIcon icon={faFileAlt} />
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div></div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="p-1 ps-3 ">
          <Button
            variant="secondary"
            size="sm"
            onClick={e => {
              setmdlhis(false);
              setlisthistory([]);
            }}
          >
            {'Close'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default mst061_StdAcsMenuListHeader;
