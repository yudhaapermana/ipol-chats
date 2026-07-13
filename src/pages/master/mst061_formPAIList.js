import {
  faFileAlt,
  faFileExport,
  faPlus,
  faSearch,
  faSignOutAlt,
  faFile,
  faUser,
  faFileSignature,
  faEdit,
  faTrashAlt,
  faFilePdf
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
import { Button, Col, Nav, Row, Badge } from 'react-bootstrap';
import {
  useParams,
  useSearchParams,
  useNavigate,
  useLocation
} from 'react-router-dom';
import { useBreakpoints } from 'hooks/useBreakpoints';
import * as ISI from 'script/ISI.js';

const mst061_formPAIList = () => {
  const URL = process.env.REACT_APP_URL_API;
  const link = `${URL}api/mst061_FormPAI`;
  const [SearchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [isParam, setisParam] = useState(false);
  const isrunn = useRef(false);
  const navigate = useNavigate();
  var lgdata = JSON.parse(localStorage.getItem('userData'));
  const CheckDev = useIsMobile();
  const [list, setList] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [fDoc, setfDoc] = useState('');
  const [lsdepartement, setlsdepartement] = useState([]);
  const [cdepf, setcdepf] = useState('');
  const [cstatf, setcstatf] = useState('');
  const [handover, setHandover] = useState('');
  const datedef = new Date();
  const datestart = new Date(datedef.getFullYear(), datedef.getMonth(), 1);
  const datefinish = new Date();
  const [fDocDateF, setfDocDateF] = useState(datestart);
  const [fDocDateT, setfDocDateT] = useState(datefinish);
  const getParam = () => {
    let param = `?param=`;
    param += `${fDoc}|${
      fDocDateF != '' && fDocDateF != null && fDocDateF != 'Invalid Date'
        ? format(fDocDateF, 'yyyy-MM-dd')
        : ''
    }|`;
    param += `${
      fDocDateT != '' && fDocDateT != null && fDocDateF != 'Invalid Date'
        ? format(fDocDateT, 'yyyy-MM-dd')
        : ''
    }|`;
    param += `${cdepf}`;
    return param;
  };

  let { height } = useBreakpoints();
  let { act } = useParams();
  const { state: params } = useLocation();
  let htabo = height;
  useEffect(() => {
    if (act == 'N') {
      FPAICheck();
    }
    if (isrunn.current === false) {
      let paramUrl = SearchParams.get('param');
      if (paramUrl) {
        const param = paramUrl.split('|');
        if (param.length > 0) {
          setisParam(true);
          if (param.length > 1) {
            setfDoc(param[0]);
            let paramF = new Date(param[1] + 'T00:00:00');
            let paramT = new Date(param[2] + 'T00:00:00');
            if (paramF != 'Invalid Date') setfDocDateF(paramF);
            else setfDocDateF('');
            if (paramT != 'Invalid Date') setfDocDateT(paramT);
            else setfDocDateT('');
            setcdepf(param[3]);
          }
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
  }, []);

  useLayoutEffect(() => {
    if (isParam) {
      getList();
      setisParam(false);
    }
    GetDepartement();
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
    height: isOpen ? '90%' : 0,
    transition: 'height 1s ease-out',
    top: self == top ? '12vh' : '8vh'
  };

  const updateMedia = () => {
    setDesktop(window.innerWidth > 750);
    setMobile(window.innerWidth <= 750);
  };

  const GetDepartement = async () => {
    try {
      let temp = await axios({
        url: `${link}/GetDepartementList`,
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
      obj.Departement = cdepf;
      obj.SerahTerima = handover;
      if (
        fDocDateF != '' &&
        fDocDateF != undefined &&
        fDocDateF != 'Invalid Date'
      ) {
        obj.DateFromFilter = format(
          new Date(
            fDocDateF.getFullYear(),
            fDocDateF.getMonth(),
            fDocDateF.getDate()
          ),
          'yyyyMMdd'
        );
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
      obj.Status = cstatf;
      obj.ProsesId = 'Get';

      let temp = await axios({
        url: `${link}/PostTemp`,
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
          setList(response.data.LsData);
          setStatuses(response.data.LsStat);
        })
        .catch(err => {
          ISI.PopAlertFalcon('error', 'error', err.message, '');
        });
    } catch (error) {
      ISI.PopAlertFalcon('', 'Error', error.message);
    }
  };

  const FPAICheck = async () => {
    try {
      var obj = {};

      let temp = await axios({
        url: `${link}/cekFPAITemp?IP=${lgdata.IP}&UpdatedBy=${lgdata.UserId}`,
        method: 'GET',
        contentType: 'application/json; charset=utf-8',
        headers: {
          Keys: lgdata.UserTkn
        }
      });
      if (temp.data != '') {
        navigate(`/master/mst061_formPAIEntry/${temp.data}/E/${getParam()}`);
      }
    } catch (err) {
      ISI.PopAlertFalcon('error', 'error', err.response.message, '');
    }
  };

  const DeleteFPAI = async DocumentNumber => {
    try {
      var obj = {};
      obj.ProsesId = 'DeleteFPAI';
      obj.UpdatedBy = lgdata.UserId;
      obj.UpdatedIP = lgdata.IP;
      obj.DocumentNumber = DocumentNumber;

      let temp = await axios({
        url: `${link}/PostTemp`,
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

  const EditFPAI = async DocumentNumber => {
    try {
      var obj = {};
      obj.ProsesId = 'EditFPAI';
      obj.DocumentNumber = DocumentNumber;
      obj.CreatedBy = lgdata.UserId;
      obj.CreatedIP = lgdata.IP;

      let temp = await axios({
        url: `${link}/PostTemp`,
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
        navigate(
          `/master/mst061_formPAIEntry/${DocumentNumber}/E/${getParam()}`
        );
      }
    } catch (error) {
      ISI.PopAlertFalcon('error', 'error', error.response.message, '');
    }
  };

  const CreateFPAI = async () => {
    try {
      var obj = {};
      obj.Departement = lgdata.KdDept;
      obj.Section = lgdata.Sectn;
      obj.CreatedBy = lgdata.UserId;
      obj.CreatedIP = lgdata.IP;
      obj.ProsesId = 'CreateFPAI';

      let temp = await axios({
        url: `${link}/PostTemp`,
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
        navigate(
          `/master/mst061_formPAIEntry/${res.DocumentNumber}/E/${getParam()}`
        );
      }
    } catch (err) {
      ISI.PopAlertFalcon('error', 'error', err.response.Message, '');
    }
  };

  const GetFPAI = async DocumentNumber => {
    let PIP = '';
    if (DocumentNumber == '') {
      PIP = lgdata.IP;
    }

    try {
      var param = '?IP=' + PIP + '&docno=' + DocumentNumber + '&pact=' + act;

      let temp = await axios({
        url: `${link}/GetFPAI` + param,
        method: 'GET',
        //data: obj,
        contentType: 'application/json; charset=utf-8',
        headers: {
          Keys: lgdata.UserTkn
        }
      })
        .then(response => {
          PrintPdf(response.data);
          setObj(response.data);
          if (response.data.AprvList) {
            setlsFPAIAprv(response.data.AprvList);
          }
        })
        .catch(err => {
          ISI.PopAlertFalcon('error', 'error', err.message, '');
        });
    } catch (err) {
      ISI.PopAlertFalcon('error', 'error', err, '');
    }
  };

  const CreateST = async d => {
    try {
      var res = await axios.post(
        `${URL}api/mst001_formitsr`,
        {
          Ip: lgdata.IP,
          UserC: lgdata.UserId,
          Dept: lgdata.KdDept,
          Sect: lgdata.Sectn,
          ProsesId: 'Create',
          AssetNo: d
        },
        {
          headers: {
            Keys: lgdata.UserTkn
          }
        }
      );
      var dt = await res.data;

      if (dt.ErrMsg) {
        ISI.PopAlertFalcon('Error', 'Error', dt.ErrMsg);
        return;
      }

      navigate(`/master/mst001_formitsrentry/${dt.DocNo}/C`);
    } catch (error) {
      ISI.PopAlertFalcon('Error', 'Error', error.message);
    }
  };

  const PrintPdf = async Obj => {
    try {
      Obj.UpdatedBy = lgdata.UserId;
      Obj.UpdatedIP = lgdata.IP;
      let temp = await axios({
        url: `${link}/PrintPdf`,
        method: 'POST',
        data: Obj,
        contentType: 'application/json; charset=utf-8',
        headers: {
          Keys: lgdata.UserTkn
        }
      });
      let fileURL = ISI.ConvertbyteTopdf(temp.data);
      ISI.showReports(`${fileURL}`, 'ps', '1');
    } catch (err) {
      ISI.PopAlertFalcon('error', 'error', err.response.data.Message, '');
    }
  };

  const handleAction = e => {
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
      EditFPAI(key);
    } else if (pact === 'BtnViewG') {
      navigate(`/master/mst061_formPAIEntry/${key}/V${act}/${getParam()}`, {
        state: {
          mode: params?.mode ?? act
        }
      });
    } else if (pact === 'BtnApproveG') {
      navigate(`/master/mst061_formPAIEntry/${key}/A/${getParam()}`);
    } else if (pact === 'BtnDisApproveG') {
      navigate(`/master/mst061_formPAIEntry/${key}/S/${getParam()}`);
    } else if (pact === 'BtnDelG') {
      ISI.confirmISI({
        title: 'Konfirmasi',
        msg: `Hapus Document Number ${upData.DocumentNumber} ?`,
        yesText: 'Yes',
        yesAction: () => DeleteFPAI(key),
        noText: 'No',
        noAction: () => {}
      });
    } else if (pact === 'BtnPrintG') {
      GetFPAI(key);
    } else if (pact === 'btnSt') {
      CreateST(key);
    }
  };

  const mappingHeader = [
    [
      { text: 'Action', width: '10%' },
      { text: 'Document Number', width: '8%' },
      { text: 'Date', width: '6%' },
      { text: 'User Requestor', width: '10%' },
      { text: 'Department', width: '10%' },
      { text: 'Budget', width: '5%' },
      { text: 'Description', width: '20%' },
      { text: 'Status', width: '15%' },
      { text: 'Handover', width: '9%' }
    ]
  ];

  let mappingTable = [
    {
      title: '',
      propName: 'Action',
      isNumber: false,
      isAction: true,
      actcode: 'D,E,V,P' + (act == 'A' ? ',A' : act == 'S' ? ',U' : ''),
      actcond: [
        { btncd: 'D', propNm: 'UserCreate', validprop: 'SJ' + lgdata.UserId },
        { btncd: 'E', propNm: 'UserCreate', validprop: 'SJ' + lgdata.UserId },
        { btncd: 'U', propNm: 'UserCreate', validprop: 'U' + lgdata.UserId },
        { btncd: 'A', propNm: 'ValidApp', validprop: true }
      ],
      addbtn:
        act == 'ST'
          ? [
              {
                id: 'btnSt',
                tool: 'Serah Terima Asset',
                icn: faFileExport,
                color: 'text-info',
                propNm: 'ValidSerahTerima',
                validprop: true
              }
            ]
          : [],
      idEdit: 'DocumentNumber',
      class: 'text-center',
      col: '12'
    },
    { propName: 'DocumentNumber' },
    { propName: 'StrTgl' },
    { propName: 'UserDesc' },
    { propName: 'DepartementDesc' },
    { propName: 'BudgetDesc' },
    { propName: 'Keterangan', class: 'text-nowrap' },
    { propName: 'StatusDesc' },
    { propName: 'SerahTerima' }
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
                    {act == 'A'
                      ? 'Approve Form Permintaan'
                      : act == 'S'
                      ? 'Disapprove Form Permintaan'
                      : act == 'ST'
                      ? 'Serah Terima'
                      : 'Form Permintaan'}{' '}
                    Asset IT
                  </h5>
                </div>
                <div className="col">
                  <Nav className="justify-content-end">
                    {act == 'N' ? (
                      <BtnMenu
                        id="btnAdd"
                        title={'Add New Form PAI'}
                        icon={faPlus}
                        color="text-info"
                        evclick={e => CreateFPAI()}
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
                          var rt = '/';
                          if (params?.mode == 'ST' || act == 'ST')
                            rt = '/master/mst001_formitsrlist';
                          navigate(rt);
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
                      width: 1515,
                      height: '100%'
                    }}
                    dvstyle={{
                      width: '1530px',
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
                                <a
                                  className="text-decoration-none w-100"
                                  href="#!"
                                >
                                  <h6
                                    className="fs-9 text-1000 mb-0 ps-2 text-truncate"
                                    style={{ maxWidth: '98%' }}
                                  >{`${cl.DocumentNumber} - ${cl.StrTgl} `}</h6>
                                  <h6 className="ps-2 fs--1 text-1000 w-100 ">
                                    <span className="text-secondary pe-1">
                                      Department :
                                    </span>
                                    {`${cl.DepartementDesc}`}
                                    <br />
                                    <span className="text-secondary pe-1">
                                      Budget :
                                    </span>
                                    {`${cl.BudgetDesc}`}
                                    <br />
                                    <span className="text-secondary pe-1">
                                      Description :
                                    </span>
                                    <span
                                      className="text-dark fs-10 pe-2 text-truncate"
                                      style={{ maxWidth: '98%' }}
                                    >
                                      {cl.Keterangan}
                                    </span>
                                    <br />
                                    <span className="text-primary pe-1">
                                      <FontAwesomeIcon icon={faUser} />
                                    </span>
                                    <span className="text-secondary pe-1">
                                      User Requestor :
                                    </span>
                                    {cl.UserDesc}
                                    <br />
                                    <Badge
                                      bg="success"
                                      className="me-1 mt-1 fs-11"
                                    >
                                      {cl.StatusDesc}
                                    </Badge>
                                  </h6>
                                </a>
                              </div>
                            </div>
                            <div className="col-12 text-center">
                              <div>
                                <span
                                  className={`text-success  fa-1x pointer ${
                                    cl.ValidApp && act == 'A' ? 'm-2' : 'd-none'
                                  }`}
                                  title="Approve"
                                  role="button"
                                  onClick={() => {
                                    handleAction(
                                      'BtnApproveG|' + cl.DocumentNumber
                                    );
                                  }}
                                >
                                  <FontAwesomeIcon icon={faFileSignature} />
                                </span>
                                <span
                                  className={`text-danger fa-1x pointer ${
                                    cl.UserCreate == 'U' + lgdata.UserId &&
                                    act == 'S'
                                      ? 'm-2'
                                      : 'd-none'
                                  }`}
                                  title="Disapprove"
                                  role="button"
                                  onClick={() => {
                                    handleAction(
                                      'BtnDisapproveG|' + cl.DocumentNumber
                                    );
                                  }}
                                >
                                  <FontAwesomeIcon icon={faFileSignature} />
                                </span>
                                <span
                                  className={`text-danger fa-1x pointer ${
                                    cl.UserCreate == 'SJ' + lgdata.UserId
                                      ? 'm-2'
                                      : 'd-none'
                                  }`}
                                  title="Delete"
                                  role="button"
                                  onClick={() => {
                                    handleAction(
                                      'BtnDelG|' + cl.DocumentNumber
                                    );
                                  }}
                                >
                                  <FontAwesomeIcon icon={faTrashAlt} />
                                </span>
                                <span
                                  className={`text-warning  fa-1x pointer ${
                                    cl.UserCreate == 'SJ' + lgdata.UserId
                                      ? 'm-2'
                                      : 'd-none'
                                  }`}
                                  title="Edit"
                                  role="button"
                                  onClick={() => {
                                    handleAction(
                                      'BtnEditG|' + cl.DocumentNumber
                                    );
                                  }}
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                </span>
                                <span
                                  className="text-success m-2 fa-1x pointer pe-1"
                                  title="View"
                                  role="button"
                                  onClick={() => {
                                    handleAction(
                                      'BtnViewG|' + cl.DocumentNumber
                                    );
                                  }}
                                >
                                  <FontAwesomeIcon icon={faFileAlt} />
                                </span>
                                <span
                                  className="text-warning m-2 fa-1x pointer pe-1"
                                  title="Print"
                                  role="button"
                                  onClick={() => {
                                    handleAction(
                                      'BtnPrintG|' + cl.DocumentNumber
                                    );
                                  }}
                                >
                                  <FontAwesomeIcon icon={faFilePdf} />
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
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
                      id={'Document No'}
                      label={'Document No'}
                      val={fDoc}
                      onchange={e => setfDoc(e.target.value)}
                    ></IsiTxt>
                  </div>
                  <div className="col-lg-2 col-12">
                    <IsiDateTimeRange
                      label={' Document Date'}
                      id="txtCRDate1"
                      val={fDocDateF}
                      onchange={e => {
                        console.log(e);
                        setfDocDateF(e);
                      }}
                      labelx={'to'}
                      idx="txtCRDate2"
                      valx={fDocDateT}
                      onchangex={e => {
                        console.log(e);
                        setfDocDateT(e);
                      }}
                      // format={'DD-MM-YYYY'}
                      //mode={'date'}
                    ></IsiDateTimeRange>
                  </div>
                  <div className="col-lg-3 col-12">
                    <IsiTxt
                      id="ddlDepartement"
                      label="Department"
                      typ="select"
                      obj={lsdepartement}
                      val={cdepf}
                      onchange={e => setcdepf(e.target.value)}
                    ></IsiTxt>
                  </div>
                  <div className="col-12 col-md-4 col-lg-2">
                    <div className="w-100">
                      <IsiTxt
                        label="Status"
                        typ="select"
                        obj={statuses}
                        val={cstatf}
                        onchange={e => setcstatf(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-4 col-lg-2 col-12">
                    <IsiTxt
                      label="Handover"
                      typ="select"
                      obj={[
                        { Text: 'YES', Value: "<>''" },
                        { Text: 'NO', Value: ' IS NULL' }
                      ]}
                      val={handover}
                      onchange={e => setHandover(e.target.value)}
                    ></IsiTxt>
                  </div>
                </div>
              </div>

              <div className="card-footer">
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
    </>
  );
};

export default mst061_formPAIList;
