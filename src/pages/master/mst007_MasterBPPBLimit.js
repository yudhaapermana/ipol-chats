import React, { useState, useEffect, useRef } from 'react';
import { Button, Row, Col, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import GridTable from 'components/form/GridTable';
import * as ISI from 'script/ISI.js?2';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import BtnMenu from 'components/navbar/headermenu/BtnMenu';
import IsiTxt from 'components/form/IsiTxt';
import Form from 'react-bootstrap/Form';
import IsiAutoComplete from 'components/form/IsiAutoComplete';
import DatePicker from 'react-datepicker';
import { useBreakpoints } from 'hooks/useBreakpoints';

const mst007_MasterBPPBLimit = () => {
  const navigate = useNavigate();
  const URL = process.env.REACT_APP_URL_API;
  const link = `${URL}api/mst007_MasterBPPBLimit/`;
  const lgdata = JSON.parse(localStorage.getItem('userData'));
  const isrunn = useRef(false);

  const [Obj, setObj] = useState({});
  const [lsitm, setlsitm] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [fitm, setfitm] = useState('');
  const [fitmDesc, setfitmDesc] = useState('');
  const [fvnd, setfvnd] = useState('');
  const [fprd, setfprd] = useState('');
  const [fitmc, setfitmc] = useState('');
  const [fitmcDesc, setfitmcDesc] = useState('');
  const [fyearc, setfyearc] = useState('');
  const [fumc, setfumc] = useState('');
  const [fqtyJan, setfqtyJan] = useState('0');
  const [fqtyFeb, setfqtyFeb] = useState('0');
  const [fqtyMar, setfqtyMar] = useState('0');
  const [fqtyApr, setfqtyApr] = useState('0');
  const [fqtyMay, setfqtyMay] = useState('0');
  const [fqtyJun, setfqtyJun] = useState('0');
  const [fqtyJul, setfqtyJul] = useState('0');
  const [fqtyAug, setfqtyAug] = useState('0');
  const [fqtySep, setfqtySep] = useState('0');
  const [fqtyOct, setfqtyOct] = useState('0');
  const [fqtyNov, setfqtyNov] = useState('0');
  const [fqtyDec, setfqtyDec] = useState('0');
  const [dsum, setdsum] = useState({
    ValueLimitJan: 0,
    ValueLimitFeb: 0,
    ValueLimitMar: 0,
    ValueLimitApr: 0,
    ValueLimitMay: 0,
    ValueLimitJun: 0,
    ValueLimitJul: 0,
    ValueLimitAug: 0,
    ValueLimitSep: 0,
    ValueLimitOkt: 0,
    ValueLimitNov: 0,
    ValueLimitDec: 0
  });

  const defaultValidation = {
    YearA: [true, ''],
    ItemA: [true, ''],
    UMA: [true, ''],
    error: false
  };
  const [Valid, setValid] = useState(defaultValidation);
  let ide = '';

  let { height } = useBreakpoints();

  const GetData = async () => {
    try {
      let obj = { ...Obj };
      obj.ItemFilter = fitm;
      obj.YearPeriodFilter = fvnd;
      obj.VendorFilter = fprd;
      await axios({
        url: `${link}`,
        method: 'POST',
        data: obj,
        contentType: 'application/json; charset=utf-8',
        headers: {
          Keys: lgdata.UserTkn
        }
      })
        .then(response => {
          setObj(response.data);
          setlsitm(response.data.DataLMT);
          setdsum(response.data);
        })
        .catch(err => {
          ISI.PopAlertFalcon('error', 'error', err.response.data.Message, '');
        });
    } catch (err) {
      ISI.PopAlertFalcon('error', 'error', err.response.data.Message, '');
    }
  };

  useEffect(() => {
    if (isrunn.current === false) {
      GetData();

      return () => {
        isrunn.current = true;
      };
    }
  }, []);

  let hdrexDo = [
    [
      { text: 'Action', width: 81 },
      { text: 'Year', width: 81 },
      { text: 'Item Code', width: 100 },
      { text: 'Nama', width: 231 },
      { text: 'UM', width: 61 },
      { text: 'Jan', width: 80 },
      { text: 'Feb', width: 80 },
      { text: 'Mar', width: 80 },
      { text: 'Apr', width: 80 },
      { text: 'May', width: 80 },
      { text: 'Jun', width: 80 },
      { text: 'Jul', width: 80 },
      { text: 'Aug', width: 80 },
      { text: 'Sep', width: 80 },
      { text: 'Oct', width: 80 },
      { text: 'Nov', width: 80 },
      { text: 'Dec', width: 80 },
    ]
  ];

  let mapisiexDO = [
    {
      propName: 'Action',
      isAction: true,
      actcode: 'D',
      class: 'text-center'
    },
    { propName: 'YearPeriod' },
    { propName: 'ItemCode' },
    { propName: 'ItemDesc' },
    { propName: 'UMLimit' },
    { propName: 'ValueLimitJan', isNumber: true, dPoint: 3, isTotal: true, isEdit: true, omitedit: 'MEditJan', idEdit: 'IdLimitJan' },
    { propName: 'ValueLimitFeb', isNumber: true, dPoint: 3, isTotal: true, isEdit: true, omitedit: 'MEditFeb', idEdit: 'IdLimitFeb' },
    { propName: 'ValueLimitMar', isNumber: true, dPoint: 3, isTotal: true, isEdit: true, omitedit: 'MEditMar', idEdit: 'IdLimitMar' },
    { propName: 'ValueLimitApr', isNumber: true, dPoint: 3, isTotal: true, isEdit: true, omitedit: 'MEditApr', idEdit: 'IdLimitApr' },
    { propName: 'ValueLimitMay', isNumber: true, dPoint: 3, isTotal: true, isEdit: true, omitedit: 'MEditMay', idEdit: 'IdLimitMay' },
    { propName: 'ValueLimitJun', isNumber: true, dPoint: 3, isTotal: true, isEdit: true, omitedit: 'MEditJun', idEdit: 'IdLimitJun' },
    { propName: 'ValueLimitJul', isNumber: true, dPoint: 3, isTotal: true, isEdit: true, omitedit: 'MEditJul', idEdit: 'IdLimitJul' },
    { propName: 'ValueLimitAug', isNumber: true, dPoint: 3, isTotal: true, isEdit: true, omitedit: 'MEditAug', idEdit: 'IdLimitAug' },
    { propName: 'ValueLimitSep', isNumber: true, dPoint: 3, isTotal: true, isEdit: true, omitedit: 'MEditSep', idEdit: 'IdLimitSep' },
    { propName: 'ValueLimitOkt', isNumber: true, dPoint: 3, isTotal: true, isEdit: true, omitedit: 'MEditOkt', idEdit: 'IdLimitOkt' },
    { propName: 'ValueLimitNov', isNumber: true, dPoint: 3, isTotal: true, isEdit: true, omitedit: 'MEditNov', idEdit: 'IdLimitNov' },
    { propName: 'ValueLimitDec', isNumber: true, dPoint: 3, isTotal: true, isEdit: true, omitedit: 'MEditDec', idEdit: 'IdLimitDec' }
  ];

  const handeltxtgrid = async event => {
    //console.log(event);
    //alert(key);
    if (event.key === 'Enter' || event.key === 'Tab') {
      let id = event.currentTarget.id;
      //alert(`${id}, ${event.target.value.toUpperCase()}`);
      var obj = {};
      obj.UpdatedIP = lgdata.IP;
      obj.UpdatedBy = lgdata.UserId;
      let a = id.split('|');
      //alert(`${a[1]}, ${event.target.value}`);
      obj.ValueLimit = event.target.value.toUpperCase();
      obj.UMLimit = a[3];
      obj.VendorCode = a[4];
      obj.ItemCode = a[1];
      obj.PeriodeLimit = a[2];
      obj.ProsesId = 'DoUpdateLmt';
      await axios({
        url: `${link}/PostTemp`,
        method: 'POST',
        data: obj,
        contentType: 'application/json; charset=utf-8',
        headers: {
          Keys: lgdata.UserTkn
        }
      })
        .then(response => {
          if (response.data.Ket1 != '' && response.data.Ket1 != null) {
            ISI.PopAlertFalcon('Warning', 'Warning', response.data.Ket1, '');
          } else {
            //console.log(response);
            setlsitm(response.data.ObjDataLMT.DataLMT);
            setdsum(response.data.ObjDataLMT);
          }
        })
        .catch(err => {
          // catch any unexpected errors
          ISI.PopAlertFalcon('error', 'error', err.response.data.Message, '');
        });
    }
  };

  const handleClickDo = e => {
    let id = e.currentTarget.id;
    let nm = e.currentTarget.name;
    ide = nm;
    // console.log(e);
    // alert(`${id}, ${nm}`);

    ISI.confirmISI({
      title: 'Master BPPB Limit Maintenance',
      msg: `Anda akan Hapus Data `,
      yesText: 'Yes',
      yesAction: DoDelete,
      noText: 'No',
      noAction: CancelProses
    });
  };

  const handleSaveDo = e => {

    setValid(defaultValidation);
    let Vld = { ...defaultValidation };
    if (fyearc == '') {
      Vld = {
        ...Vld,
        YearA: [false, 'Tahun Periode harus diisi'],
        error: true
      };
      ISI.PopAlertFalcon('Warning', 'Warning', 'Tahun Periode harus diisi', '');
    }
    if (fitmc == '') {
      Vld = {
        ...Vld,
        ItemA: [false, 'Item Code harus diisi'],
        error: true
      };
    }
    if (fumc == '') {
      Vld = {
        ...Vld,
        UMA: [false, 'Unit of measurement harus diisi'],
        error: true
      };
    }
    setValid(Vld);
    if (!Vld.error) {
      ISI.confirmISI({
        title: 'Bahan vs DO',
        msg: `Anda akan Save Data ini`,
        yesText: 'Yes',
        yesAction: DosaveDO,
        noText: 'No',
        noAction: CancelProses
      });
    }
  };

  const handlereset = e => {
    setflmf('');
    setfgflmf('');
    setgrpf('');
    setcgrpf('');
    setcstf('');
  };

  const DosaveDO = async () => {
    var obj = {};
    obj.UpdatedIP = lgdata.IP;
    obj.UpdatedBy = lgdata.UserId;
    obj.YearPeriod = fyearc.getFullYear();
    obj.ItemCode = fitmc;
    obj.UMLimit = fumc;
    obj.VendorCode = "";
    obj.ValueLimitJan = fqtyJan;
    obj.ValueLimitFeb = fqtyFeb;
    obj.ValueLimitMar = fqtyMar;
    obj.ValueLimitApr = fqtyApr;
    obj.ValueLimitMay = fqtyMay;
    obj.ValueLimitJun = fqtyJun;
    obj.ValueLimitJul = fqtyJul;
    obj.ValueLimitAug = fqtyAug;
    obj.ValueLimitSep = fqtySep;
    obj.ValueLimitOkt = fqtyOct;
    obj.ValueLimitNov = fqtyNov;
    obj.ValueLimitDec = fqtyDec;
    obj.ProsesId = 'DoInsertLmt';
    await axios({
      url: `${link}/PostTemp`,
      method: 'POST',
      data: obj,
      contentType: 'application/json; charset=utf-8',
      headers: {
        Keys: lgdata.UserTkn
      }
    })
      .then(response => {
        if (response.data.Ket1 != '' && response.data.Ket1 != null) {
          ISI.PopAlertFalcon('Warning', 'Warning', response.data.Ket1, '');
        } else {
          setlsitm(response.data.ObjDataLMT.DataLMT);
          setdsum(response.data.ObjDataLMT);
          setfyearc('');
          setfitmc('');
          setfitmcDesc('');
          setfumc('');
          setfqtyJan('0');
          setfqtyFeb('0');
          setfqtyMar('0');
          setfqtyApr('0');
          setfqtyMay('0');
          setfqtyJun('0');
          setfqtyJul('0');
          setfqtyAug('0');
          setfqtySep('0');
          setfqtyOct('0');
          setfqtyNov('0');
          setfqtyDec('0');
        }

      })
      .catch(err => {
        // catch any unexpected errors
        ISI.PopAlertFalcon('error', 'error', err.response.data.Message, '');
      });
  };

  const DoDelete = async () => {
    var obj = {};
    obj.UpdatedIP = lgdata.IP;
    obj.UpdatedBy = lgdata.UserId;
    let a = ide.split('|');
    //alert(`${a[1]}, ${event.target.value}`);
    obj.UMLimit = a[2];
    obj.VendorCode = a[3];
    obj.ItemCode = a[0];
    obj.YearPeriod = a[1];
    obj.ProsesId = 'DoDeleteLmt';
    await axios({
      url: `${link}/PostTemp`,
      method: 'POST',
      data: obj,
      contentType: 'application/json; charset=utf-8',
      headers: {
        Keys: lgdata.UserTkn
      }
    })
      .then(response => {
        setlsitm(response.data.ObjDataLMT.DataLMT);
        setdsum(response.data.ObjDataLMT);
      })
      .catch(err => {
        // catch any unexpected errors
        ISI.PopAlertFalcon('error', 'error', err.response.data.Message, '');
      });
  };

  const CancelProses = e => { };

  const getIUMSItem = async (pitm) => {
    try {
      var obj = {};

      let temp = await axios({
        url: `${link}/getIUMSItem?IC=${pitm}`,
        method: 'GET',
        contentType: 'application/json; charset=utf-8',
        headers: {
          Keys: lgdata.UserTkn
        }
      });
      if (pitm != '' && temp.data != '') {
        setfumc(temp.data);
      }
    } catch (err) {
      ISI.PopAlertFalcon('error', 'error', err.response.message, '');
    }
  };

  const styleFilter = {
    overflow: 'hidden',
    height: isOpen ? '80%' : 0,
    transition: 'height 1s ease-out',
    top: self == top ? '15vh' : '7vh'
  };

  let hg = '77vh';
  if (self == top) hg = '80vh';


  return (
    <>
      <Row className="g-0">
        <Col>
          <div className="card ">
            <div className="card-header bg-light ps-2 pe-1 pt-2 pb-2" id="cardTitle">
              <div class="row g-0">
                <div className="col-md-8 col-sm-8 col-xxl-8 col-lg-8 col-12 d-flex align-items-center">
                  <div className="icon-item icon-item-sm bg-soft-primary rounded-3 shadow-none me-1 bg-soft-success">
                    <span className="fas fa-table text-success"></span>
                  </div>
                  <h5 id="LblHdr" className="mb-0 ms-1">
                    Master BPPB Limit Maintenance
                  </h5>
                </div>

                <div className="col-md-4 col-sm-4 col-xxl-4 col-lg-4 col-12">
                  <Nav className="justify-content-end ">
                    <BtnMenu id="btndtl" title={'Search'} icon={faSearch} color="text-info" evclick={e => setIsOpen(!isOpen)}></BtnMenu>
                    <BtnMenu
                      id="BtnBack"
                      title="Back"
                      icon={faSignOutAlt}
                      color="text-info"
                      evclick={e => {
                        if (self == top) {
                          navigate(`/`);
                        } else {
                          window.parent.postMessage(
                            {
                              func: 'BackFApp',
                              message: 'Message text from iframe.'
                            },
                            '*'
                          );
                          localStorage.removeItem('ERPMenu');
                        }
                      }}
                    ></BtnMenu>
                  </Nav>
                </div>
              </div>
            </div>
            <div className="card-body p-2">
              <div className="row">
                <div className="col-auto mt-2 overflow-auto" style={{ height: height - 60 }}>
                  <GridTable
                    propKey={'IdRow'}
                    datas={lsitm}
                    dtotal={dsum}
                    maping={mapisiexDO}
                    headers={hdrexDo}
                    tbstyle={{ width: '1460px' }}
                    dvstyle={{
                      width: '1475px',
                      maxHeight: height - 110
                    }}
                    //clshdr={'hdrhide'}
                    parentFunction={handleClickDo}
                    handletxt={handeltxtgrid}
                    showtotal={true}
                  />
                  <table className="GridItem" width={'1460px'}>
                    <body>
                      <tr>
                        <td width={'60px'}>
                          <div className="row">
                            <div className="col-3">
                              <button type="button" key={`save`} id={'BtnSave'} className="btn btn-link btn-sm pt-0 pb-0 text-success" onClick={handleSaveDo}>
                                <FontAwesomeIcon icon={faSave} className={`fs-9`} />
                              </button>
                            </div>
                          </div>
                        </td>
                        <td width={'81px'}>
                          <DatePicker
                            selected={fyearc}
                            onChange={(date) => {
                              //console.log(date.getFullYear());
                              setfyearc(date);
                              // let Vld = { ...Valid };
                              // if (date == '') {
                              //   Vld = {
                              //     ...Vld,
                              //     YearA: [false, 'Tahun Periode harus diisi'],
                              //     error: true
                              //   };
                              // } else {
                              //   Vld = {
                              //     ...Vld,
                              //     YearA: [true, ''],
                              //     error: false
                              //   };
                              // }
                              // setValid(Vld);
                            }}
                            showYearPicker
                            className="form-control"
                            dateFormat="yyyy"
                            yearItemNumber={10}
                            minDate={new Date()}
                            required
                          />
                        </td>
                        <td width={'350px'}>
                          {/* <Form.Control type="input" size="sm" value={fitmc} className="ps-1 pe-1" onChange={e => setfitmc(e.target.value)}></Form.Control> */}
                          <IsiAutoComplete
                            id="ddlitem"
                            val={fitmc}
                            onchange={e => {
                              setfitmc(e.toUpperCase());
                              getIUMSItem(e);
                            }}
                            // onblur={() => {
                            //   if (fitmc != '') {
                            //     getIUMSItem(fitmc);
                            //   }
                            // }}
                            desc={fitmc}
                            onchangedesc={e => {
                              setfitmcDesc(e);
                              let Vld = { ...Valid };
                              if (e == '') {
                                Vld = {
                                  ...Vld,
                                  ItemA: [false, 'Item Code harus diisi'],
                                  error: true
                                };
                              } else {
                                Vld = {
                                  ...Vld,
                                  ItemA: [true, ''],
                                  error: false
                                };
                              }
                              setValid(Vld);
                            }}
                            url={`${URL}api/Utility/GetItems?usid=${lgdata.UserId}&cls=&ctg=`}
                            isinvalid={Valid.ItemA}
                          ></IsiAutoComplete>
                          {fitmcDesc}
                        </td>
                        <td width={'61px'}>
                          <IsiTxt
                            css="d-flex w-100"
                            val={fumc}
                            onchange={e => {
                              setfumc(e.target.value)
                              let Vld = { ...Valid };
                              if (e.target.value == '') {
                                Vld = {
                                  ...Vld,
                                  UMA: [false, 'Unit of measurement harus diisi'],
                                  error: true
                                };
                              } else {
                                Vld = {
                                  ...Vld,
                                  UMA: [true, ''],
                                  error: false
                                };
                              }
                              setValid(Vld);
                            }}
                            isinvalid={Valid.UMA}
                            maxlength={2}
                          />
                        </td>
                        <td width={'80px'}>
                          <IsiTxt css="d-flex w-100" val={fqtyJan} onchange={e => setfqtyJan(e.target.value)} disabled={new Date() > new Date(new Date().getFullYear(), 1, 0)} isnumber={true} />
                        </td>
                        <td width={'80px'}>
                          <IsiTxt css="d-flex w-100" val={fqtyFeb} onchange={e => setfqtyFeb(e.target.value)} disabled={new Date() > new Date(new Date().getFullYear(), 2, 0)} isnumber={true} />
                        </td>
                        <td width={'80px'}>
                          <IsiTxt css="d-flex w-100" val={fqtyMar} onchange={e => setfqtyMar(e.target.value)} disabled={new Date() > new Date(new Date().getFullYear(), 3, 0)} isnumber={true} />
                        </td>
                        <td width={'80px'}>
                          <IsiTxt css="d-flex w-100" val={fqtyApr} onchange={e => setfqtyApr(e.target.value)} disabled={new Date() > new Date(new Date().getFullYear(), 4, 0)} isnumber={true} />
                        </td>
                        <td width={'80px'}>
                          <IsiTxt css="d-flex w-100" val={fqtyMay} onchange={e => setfqtyMay(e.target.value)} disabled={new Date() > new Date(new Date().getFullYear(), 5, 0)} isnumber={true} />
                        </td>
                        <td width={'80px'}>
                          <IsiTxt css="d-flex w-100" val={fqtyJun} onchange={e => setfqtyJun(e.target.value)} disabled={new Date() > new Date(new Date().getFullYear(), 6, 0)} isnumber={true} />
                        </td>
                        <td width={'80px'}>
                          <IsiTxt css="d-flex w-100" val={fqtyJul} onchange={e => setfqtyJul(e.target.value)} disabled={new Date() > new Date(new Date().getFullYear(), 7, 0)} isnumber={true} />
                        </td>
                        <td width={'80px'}>
                          <IsiTxt css="d-flex w-100" val={fqtyAug} onchange={e => setfqtyAug(e.target.value)} disabled={new Date() > new Date(new Date().getFullYear(), 8, 0)} isnumber={true} />
                        </td>
                        <td width={'80px'}>
                          <IsiTxt css="d-flex w-100" val={fqtySep} onchange={e => setfqtySep(e.target.value)} disabled={new Date() > new Date(new Date().getFullYear(), 9, 0)} isnumber={true} />
                        </td>
                        <td width={'80px'}>
                          <IsiTxt css="d-flex w-100" val={fqtyOct} onchange={e => setfqtyOct(e.target.value)} disabled={new Date() > new Date(new Date().getFullYear(), 10, 0)} isnumber={true} />
                        </td>
                        <td width={'80px'}>
                          <IsiTxt css="d-flex w-100" val={fqtyNov} onchange={e => setfqtyNov(e.target.value)} disabled={new Date() > new Date(new Date().getFullYear(), 11, 0)} isnumber={true} />
                        </td>
                        <td width={'80px'}>
                          <IsiTxt css="d-flex w-100" val={fqtyDec} onchange={e => setfqtyDec(e.target.value)} disabled={new Date() > new Date(new Date().getFullYear(), 12, 0)} isnumber={true} />
                        </td>
                      </tr>
                    </body>
                  </table>
                </div>
              </div>
            </div>
          </div>


          <div className="form-boxentry bg-light" style={styleFilter}>
            <div className="card card-primary">
              <div className="card-body" style={{ paddingTop: '3px' }}>
                <div className="row">
                  <div className="col-2">
                    <Form>
                      <Form.Group>
                        {/* <Form.Label className="mb-0">Item Code / Item Name</Form.Label> */}
                        <IsiAutoComplete
                          id="ddlitem"
                          label="Item Code / Item Name"
                          val={fitm}
                          onchange={e => {
                            setfitm(e);
                          }}
                          decs={fitmDesc}
                          onchangedesc={e => {
                            setfitmDesc(e)
                          }}
                          url={`${URL}api/Utility/GetItems?usid=${lgdata.UserId}&cls=&ctg=`}
                        ></IsiAutoComplete>
                      </Form.Group>
                    </Form>
                  </div>
                  <div className="col-2">
                    <Form>
                      <Form.Group>
                        <Form.Label className="mb-0">Vendor Code / Vendor Name</Form.Label>
                        <Form.Control size="sm" type="text" onChange={e => setfvnd(e.target.value.toUpperCase())} value={fvnd}></Form.Control>
                      </Form.Group>
                    </Form>
                  </div>
                  <div className="col-3">
                    <Form>
                      <Form.Group>
                        <Form.Label className="mb-0">Year</Form.Label>
                        {/* <Form.Control size="sm" type="text" onChange={e => setfprd(e.target.value.toUpperCase())} value={fprd}></Form.Control> */}
                        <DatePicker
                          selected={fprd}
                          onChange={(date) => {
                            //console.log(date.getFullYear());
                            setfprd(date);
                          }}
                          showYearPicker
                          className="form-control"
                          placeholderText="Select Year"
                          dateFormat="yyyy"
                          yearItemNumber={10}
                        />
                      </Form.Group>
                    </Form>
                  </div>
                </div>
              </div>
              <div className="card-footer">
                <Button type="button" className="btn btn-sm btn-primary" onClick={GetData}>
                  Search
                </Button>
                <Button type="button" className="btn btn-sm btn-info ms-2" onClick={handlereset}>
                  Clear Filter
                </Button>
                <Button type="button" className="btn btn-sm btn-secondary ms-2" onClick={e => setIsOpen(!isOpen)}>
                  Hide
                </Button>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default mst007_MasterBPPBLimit;
