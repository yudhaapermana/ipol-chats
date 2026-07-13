import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Button, Row, Card, Col, Nav, InputGroup, FormControl, Tabs, Tab, NavbarCollapse, Alert } from 'react-bootstrap';

import createMarkup from 'helpers/createMarkup';

import { Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import GridTable from 'components/form/GridTable';
import GridCard from 'components/form/GridCard';
import * as ISI from 'script/ISI.js?2';
import axios from 'axios';
import $ from 'jquery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CloseButton from 'react-bootstrap/CloseButton';
import classNames from 'classnames';
import { format } from 'date-fns';

import {
  faPlus,
  faTrashAlt,
  faSignOutAlt,
  faSave,
  faSearch,
  faTimes,
  faRetweet,
  faFolderPlus,
  faWindowClose,
  faPenSquare,
  faCloudRain,
  faFootballBall,
  faDownload,
  faPaperPlane,
  faCopy,
  faLink,
  faEnvelope,
  faCheck,
  faClipboardCheck,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';

import BtnMenu from 'components/navbar/headermenu/BtnMenu';
import IsiTxt from 'components/form/IsiTxt';
import IsiSItem from 'components/form/IsiSItem';
import IsiDateTime from 'components/form/IsiDateTime';
import IsiNumFormat from 'components/form/IsiNumFormat';
import Flex from 'components/common/Flex';
import { BsBorderTop } from 'react-icons/bs';
import Form from 'react-bootstrap/Form';
import { active, color, mode, select, text } from 'd3';
import { FiCloudOff } from 'react-icons/fi';
import '@1stquad/react-bootstrap-datetimepicker/css/bootstrap-datetimepicker.css';
import DateTimeField from '@1stquad/react-bootstrap-datetimepicker';
import FalconCloseButton from 'components/common/FalconCloseButton';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import IsiRadio from 'components/form/IsiRadio';
import { date, object } from 'is_js';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { title } from 'process';
import useIsMobile from 'hooks/useIsMobile';
import IsiTxtRange from 'components/form/IsiTxtRange';
import IsiDateTimeRange from 'components/form/IsiDateTimeRange';
import { AlertException, confirmISI, ConvertbyteToxls, left, TglDate, TglNumDate } from 'script/ISI';

import noimg from 'assets/img/Avatar.jpg';
import { useAppContext } from 'Main';
import messages from 'data/chat/messages';

const Mst062_MaintenanceWa = () => {
  const navigate = useNavigate();
  const [lsdata, setlsdata] = useState([]);
  const URL = process.env.REACT_APP_URL_API;
  const link = `${URL}api/mst062_maintenanceWa`;

  const [isOpen, setIsOpen] = useState(false);
  const CheckDev = useIsMobile();

  const [statusFilter, setStatusFilter] = useState('All');
  const lgdata = JSON.parse(localStorage.getItem('userData'));

  let { width, height, breakpoints } = useBreakpoints();

  const [Obj, setObj] = useState({});
  const [data, setdata] = useState({});

  const [lsspv, setlsspv] = useState([]);
  const [lsspvc, setlsspvc] = useState([]);
  const [lsdept, setLsdept] = useState([]);
  const [lsstat, setLsstat] = useState([]);
  const [LsMode, setLsmodema] = useState([]);

  const [objPass, setObjPass] = useState({});
  const RmkValid = [true, ''];

  const [isrmk, setIsrmk] = useState(false);
  const [isNew, setIsNew] = useState(false);

  let dtn = new Date();

  const [ftglf, setftglf] = useState(new Date(dtn.getFullYear(), dtn.getMonth(), 1));
  const [ftglt, setftglt] = useState(new Date());

  const [fid, setfid] = useState('');
  const [fseqmessage, setfseqmessage] = useState('');
  const [fpriority, setfpriority] = useState('');
  const [fnowa, setfnowa] = useState('');
  const [fmodema, setfmodema] = useState('');
  const [fmessage, setfmessage] = useState('');
  const [fstatus, setfstatus] = useState('');
  const [fcreatedby, setfcreatedby] = useState('');
  const [fcreatedip, setfcreatedip] = useState('');
  const [fdatefrom, setfdatefrom] = useState(new Date(dtn.getFullYear(), dtn.getMonth(), dtn.getDate() - 0));
  const [ftimecreate, setftimecreate] = useState('');
  const [fupdateby, setfupdateby] = useState('');
  const [fupdateip, setfupdateip] = useState('');
  const [fdateto, setfdateto] = useState(new Date());
  const [ftimeupdate, setftimeupdate] = useState('');
  const [ffilepath, setffilepath] = useState('');

  const GetData = async () => {
    try {
      let temp = await axios({
        url: `${link}?&no=${encodeURIComponent(fnowa)}&seq=${fseqmessage}&mode=${fmodema}&msg=${fmessage}&stat=${fstatus}&tglf=${fdatefrom != '' && fdatefrom != null && fdatefrom != 'Invalid Date' ? format(fdatefrom, 'dd/MM/yyyy') : ''}&tglt=${
          fdateto != '' && fdateto != null && fdateto != 'Invalid Date' ? format(fdateto, 'dd/MM/yyyy') : ''
        }`,

        method: 'GET',
        contentType: 'application/json; charset=utf-8',
        headers: {
          Keys: lgdata.UserTkn
        }
      });

      if (!temp.data.Msg) {
        DoIsiData(temp.data);
      } else {
        ISI.PopAlertFalcon('error', 'Error', temp.data.Message, '');
      }
    } catch (err) {
      ISI.PopAlertFalcon('error', 'Error', err.response.data?.Message, '');
    }
  };

  const DoIsiData = data => {
    setdata(data.Data);
    setlsdata(data.LsData);
    setLsstat(data.LsStat);
    setLsmodema(data.LsMode);
  };

  const handleDatetime = (e, id) => {
    let b = { ...data };
    b[id] = e;
    setdata(b);
  };

  const formatDMY = date => format(date, 'dd/MM/yyyy');

  const HandleDownload = async () => {
    try {
      const payload = {
        ...Obj,
        Number: fnowa,
        Message: fmessage,
        Status: fstatus,
        ModeMa: fmodema,
        DateFrom: fdatefrom ? formatDMY(fdatefrom) : '',
        DateTo: fdateto ? formatDMY(fdateto) : '',
        Ip: lgdata.IP
      };

      const res = await axios.post(`${link}/GenExcel`, payload, {
        headers: {
          Keys: lgdata.UserTkn
        }
      });

      const dt = await res.data;
      const ip = lgdata.IP.replace(':', '');
      ConvertbyteToxls(dt, `WhatsApp Messages_${ip}.xlsx`);
    } catch (error) {
      AlertException(error);
    }
  };

  useEffect(() => {
    GetData();
    let result = lsdata;
  }, []);

  let idln;
  let dta;
  let htab = height - 105;
  let htabe = height - 85;

  let ghdr = [
    [
      { text: 'Action', rowSpan: 3, width: 160 },
      { text: 'Id', rowSpan: 3, width: 120 },
      { text: 'Sequence', rowSpan: 3, width: 120 },
      { text: 'Number', rowSpan: 3, width: 200 },
      { text: 'Mode', rowSpan: 3, width: 200 },
      // { text: 'Message', rowSpan: 3, width: 200 },
      { text: 'File Path', rowSpan: 3, width: 200 },
      { text: 'Created', colSpan: 2, width: 400 },
      { text: 'Updated', colSpan: 2, width: 400 },
      { text: 'Status', rowSpan: 3, width: 200 },
      // { text: 'Remark', rowSpan: 3, width: 400 },
    ],
    [
      // { text: 'User', colSpan: 1, width: 100 },
      // { text: 'IP', colSpan: 1, width: 100 },
      { text: 'Date', colSpan: 1, width: 50 },
      { text: 'Time', colSpan: 1, width: 50 },
      // { text: 'User', colSpan: 1, width: 100 },
      // { text: 'IP', colSpan: 1, width: 100 },
      { text: 'Date', colSpan: 1, width: 50 },
      { text: 'Time', colSpan: 1, width: 50 }
    ]
  ];

  let gmap = [
    {
      propName: 'Action',
      isAction: true,
      actcode: 'V,D,R',
      actcond: [
        { btncd: 'D', propNm: 'StatD', validprop: 'New' }
        // { btncd: 'R', propNm: 'StatD', validprop: 'Failed' },
        // { btncd: 'V', propNm: 'StatD', validprop: 'Sent' },
      ]
    },
    { propName: 'Id', class: 'text-center' },
    { propName: 'Sequence', class: 'text-center' },
    { propName: 'Number', class: 'text-center' },
    { propName: 'ModeMa', class: 'text-center' },
    // { propName: 'Message', class: 'text-center' },
    { propName: 'FilePath', class: 'text-center' },
    // { propName: 'CreatedBy', class: 'text-center' },
    // { propName: 'CreatedIP', class: 'text-center' },
    { propName: 'DateCreate', class: 'text-center' },
    { propName: 'TimeCreate', class: 'text-center' },
    // { propName: 'UpdatedBy', class: 'text-center' },
    // { propName: 'UpdatedIP', class: 'text-center' },
    { propName: 'DateUpdate', class: 'text-center' },
    { propName: 'TimeUpdate', class: 'text-center' },
    { propName: 'StatD', class: 'text-center' },
    // { propName: 'Error_Message', class: 'text-center' }
  ];

  const txtOnchange = e => {
    let b = { ...data };
    b[e.target.id] = e.target.value;
    setdata(b);
  };

  const EmptyData = () => {};

  const handleClickDo = e => {
    let id = e.currentTarget.id;
    let nm = e.currentTarget.name;
    idln = nm;
    dta = lsdata.find(x => x.Sequence == idln);

    if (id === 'BtnViewG') {
      setdata(dta);
      setIsNew(true);
    } else if (id === 'BtnRejectG') {
      confirmISI({
        title: 'Monitoring WhatsApp',
        msg: `Anda akan mengirim ulang pesan dengan nomor ${dta.Number} ?`,
        yesText: 'Yes',
        noText: 'No',
        yesAction: () => resendData(dta),
        noAction: () => {}
      });
    } else if (id === 'BtnDelG') {
      confirmISI({
        title: 'Monitoring WhatsApp',
        msg: `Anda akan membatalkan pengiriman pesan dengan nomor ${dta.Number} ?`,
        yesText: 'Yes',
        noText: 'No',
        yesAction: () => DeleteData(dta),
        noAction: () => {}
      });
    }
  };

  const resendData = async dataToResend => {
    try {
      const objToSend = {
        ...dataToResend,
        Proses_Status: 'UpdateToResend'
      };

      let response = await axios({
        url: `${link}/ProsesData`,
        method: 'POST',
        data: objToSend,
        headers: {
          Keys: lgdata.UserTkn,
          'Content-Type': 'application/json; charset=utf-8'
        }
      });
    } catch (err) {
      ISI.PopAlertFalcon('error', 'Error', err.response?.data?.Message || 'Gagal mengirim ulang data', '');
    }
  };

  const DeleteData = async dataToDelete => {
    try {
      const objToSend = {
        ...dataToDelete,
        Proses_Status: 'UpdateToDelete'
      };

      let response = await axios({
        url: `${link}/ProsesData`,
        method: 'POST',
        data: objToSend,
        headers: {
          Keys: lgdata.UserTkn,
          'Content-Type': 'application/json; charset=utf-8'
        }
      });
    } catch (err) {
      ISI.PopAlertFalcon('error', 'Error', err.response?.data?.Message || 'Gagal mengirim ulang data', '');
    }
  };

  // const resendData = async (dataToResend) => {
  //   try {
  //     let response = await axios.post(`${link}/UpdateToResend`, dataToResend, {
  //       headers: {
  //         Keys: lgdata.UserTkn,
  //         'Content-Type': 'application/json'
  //       }
  //     });
  //   } catch (err) {
  //     ISI.PopAlertFalcon('error', 'Error', err.response?.data?.Message || 'Gagal mengirim ulang data', '');
  //   }
  // };

  // const DeleteData = async (dataToDelete) => {
  //   try {
  //     let response = await axios.post(`${link}/UpdateToDelete`, dataToDelete, {
  //       headers: {
  //         Keys: lgdata.UserTkn,
  //         'Content-Type': 'application/json'
  //       }
  //     });
  //   } catch (err) {
  //     ISI.PopAlertFalcon('error', 'Error', err.response?.data?.Message || 'Gagal mengirim ulang data', '');
  //   }
  // };

  const styleFilter = {
    overflow: 'hidden',
    height: isOpen ? '86%' : 0,
    transition: 'height 1s ease-out',
    top: self == top ? (CheckDev.isMobile ? '30' : '13vh') : '5vh'
  };

  return (
    <>
      <Row className="g-0">
        <Col>
          <div className="card">
            <div className="card-header bg-light ps-2 pe-1 pt-2 pb-2" id="cardTitle">
              <div className="row g-0">
                <div className="col-md-8 col-sm-8 col-12 d-flex align-items-center">
                  <div className="icon-item icon-item-sm bg-soft-primary rounded-3 shadow-none me-1 bg-soft-success">
                    <span className="fas fa-table text-success"></span>
                  </div>
                  <h5 id="LblHdr" className="mb-0 ms-1">
                    Monitoring WhatsApp
                  </h5>
                </div>
                <div className="col-md-4 col-sm-4 col-12">
                  <Nav className="justify-content-end">
                    <BtnMenu id="btndtl" title={'Search'} icon={faSearch} color="text-info" evclick={() => setIsOpen(!isOpen)} />

                    <BtnMenu id="btnDownload" title={'Download'} icon={faDownload} color="text-info" evclick={HandleDownload}></BtnMenu>

                    <BtnMenu id="BtnBack" title="Back" icon={faSignOutAlt} color="text-info" evclick={() => navigate('/')} />
                  </Nav>
                </div>
              </div>
            </div>
            <div className="card-body p-2 pt-0" style={{ height: self == top ? htab : htabe }}>
              <div>
                <GridTable
                  propKey={'Sequence'}
                  datas={lsdata}
                  maping={gmap}
                  headers={ghdr}
                  clsname="dvListDtl"
                  tbstyle={{ width: '100%' }}
                  dvstyle={{
                    width: '100%',
                    maxHeight: self == top ? htab - 13 : htabe - 13
                  }}
                  clshdr="hdr1"
                  // showtotal={true}
                  parentFunction={handleClickDo}
                  //freezecol={6}
                  //handlescrol={handleScroll}
                />
              </div>

              {/* <div className="mt-2 d-flex justify-content-center"> */}
              {/* <p className="fw-bold">Total Data: {filteredData.length}</p> Menampilkan total data yang difilter */}
              {/* </div> */}
            </div>
          </div>
        </Col>
      </Row>

      <Modal
        show={isNew}
        onHide={e => {
          setIsNew(false);
        }}
        backdrop="static"
        keyboard={false}
        dialogClassName={CheckDev.isMobile ? 'modal-95w' : 'modal-60w'}
        // aria-labelledby="contained-modal-title-vcenter"
        // centered
      >
        <Modal.Header className="p-1 ps-3 pe-3 ">
          <Modal.Title>
            <h5 className="mt-1">Monitoring WhatsApp</h5>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-2 px-3 ">
          <div>
            <div className="row g-0 d-flex align-items-center">
              <div className="col-md-8 col-sm-8 col-xxl-8 col-lg-8 col-12 ps-1">
                <IsiTxt id="Sequence" label="Sequence" val={data?.Sequence} onchange={txtOnchange} disabled={lsdata}></IsiTxt>
                <IsiTxt id="Id" label="Id" val={data?.Id} onchange={txtOnchange} disabled={lsdata}></IsiTxt>
              </div>
              <div className="col-12 ps-1">
                <IsiTxt id="Number" label="Number" val={data?.Number} onchange={txtOnchange} disabled={lsdata}></IsiTxt>
              </div>
              <div className="col-12 ps-1">
                <IsiTxt id="FilePath" label="File Path" val={data?.FilePath} onchange={txtOnchange} disabled={lsdata}></IsiTxt>
              </div>
              <div className="col-12 ps-1">
                <IsiTxt id="Message" label="Message" row={3} val={data?.Message} onchange={txtOnchange} disabled={lsdata}></IsiTxt>
              </div>
              <div className="col-6 ps-1">
                <IsiTxt id="DateCreate" label="Date Create" val={data?.DateCreate} onchange={txtOnchange} disabled={lsdata}></IsiTxt>
              </div>
              <div className="col-6 ps-1">
                <IsiTxt id="DateUpdate" label="Date Update" val={data?.DateUpdate} onchange={txtOnchange} disabled={lsdata}></IsiTxt>
              </div>
              <div className="col-6 ps-1">
                <IsiTxt id="TimeCreate" label="Time Create" val={data?.TimeCreate} onchange={txtOnchange} disabled={lsdata}></IsiTxt>
              </div>
              <div className="col-6 ps-1">
                <IsiTxt id="TimeUpdate" label="Time Update" val={data?.TimeUpdate} onchange={txtOnchange} disabled={lsdata}></IsiTxt>
              </div>
              {/* <div className="col-6 ps-1">
                <IsiTxt id="CreatedBy" label="Create By" val={data?.CreatedBy} onchange={txtOnchange} disabled={lsdata}></IsiTxt>
              </div>
              <div className="col-6 ps-1">
                <IsiTxt id="UpdatedBy" label="Update By" val={data?.UpdatedBy} onchange={txtOnchange} disabled={lsdata}></IsiTxt>
              </div>
              <div className="col-6 ps-1">
                <IsiTxt id="CreatedIP" label="Create IP" val={data?.CreatedIP} onchange={txtOnchange} disabled={lsdata}></IsiTxt>
              </div>
              <div className="col-6 ps-1">
                <IsiTxt id="UpdatedIP" label="Update IP" val={data?.UpdatedIP} onchange={txtOnchange} disabled={lsdata}></IsiTxt>
              </div> */}
              <div className="col-12 ps-1">
                <IsiTxt id="ModeMa" label="Mode" val={data?.ModeMa} onchange={txtOnchange} disabled={lsdata}></IsiTxt>
                <IsiTxt id="StatD" label="Status" val={data?.StatD} onchange={txtOnchange} disabled={lsdata}></IsiTxt>
                <IsiTxt id="Remark" label="Remark" val={data?.Error_Message} onchange={txtOnchange} disabled={lsdata}></IsiTxt>
              </div>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer className="p-1 ps-3 ">
          <Button
            variant="secondary"
            size="sm"
            onClick={e => {
              setIsNew(false);
              EmptyData();
              setIsNew(false);
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Form untuk filter yang dapat dibuka/tutup */}
      <div className="form-boxentry bg-light" style={styleFilter}>
        <div className="card card-primary">
          <div className="card-body" style={{ paddingTop: '3px' }}>
            <div className="row g-1 ms-0 ps-0 d-flex align-items-top">
              {/* <div className="col-12 col-md-6 col-xl-3 col-sm-4 pe-1">
                <IsiDateTime
                  label="Date Create"
                  id="fdatefrom"
                  val={fdatefrom}
                  onchange={e => setfdatefrom(e)}
                  format={'DD/MM/YYYY'}
                  mode={'date'}
                />
              </div>
              <div className="col-12 col-md-6 col-xl-3 col-sm-4 pe-1">
                <IsiDateTime
                  label="Date Update"
                  id="fdateto"
                  val={fdateto}
                  onchange={e => setfdateto(e)}
                  format={'DD/MM/YYYY'}
                  mode={'date'}
                />
              </div> */}
              <div className="col-12 col-md-6 col-xl-3 col-sm-4 pe-1">
                <IsiDateTimeRange
                  label="Date"
                  id="fdatefrom"
                  val={fdatefrom}
                  onchange={e => setfdatefrom(e)}
                  labelx={'to'}
                  idx="fdateto"
                  valx={fdateto}
                  onchangex={e => setfdateto(e)}
                  format={'DD/MM/YYYY'}
                  mode={'date'}
                  // style={{
                  //   width: '100%'
                  // }}
                ></IsiDateTimeRange>
              </div>
            </div>
            <div className="row g-1 ms-0 ps-0 d-flex align-items-top">
              <div className="col-12 col-md-6 col-xl-3 col-sm-4 pe-1">
                <IsiTxt id="fnowa" label="No WhatsApp" val={fnowa} onchange={e => setfnowa(e.target.value)}></IsiTxt>
              </div>
              <div className="col-md-6 col-xl-3 col-sm-4 col-12 pe-1">
                <IsiTxt id="fmodema" typ="select" obj={LsMode} val={fmodema} label="Mode" onchange={e => setfmodema(e.target.value)}></IsiTxt>
              </div>
              <div className="col-md-6 col-xl-3 col-sm-4 col-12 pe-1">
                <IsiTxt id="fstatus" typ="select" obj={lsstat} val={fstatus} label="Status" onchange={e => setfstatus(e.target.value)}></IsiTxt>
              </div>
            </div>
            <div className="row g-1 ms-0 ps-0 d-flex align-items-top">
              <div className="col-md-6 col-xl-3 col-sm-4 col-12 pe-1">
                <IsiTxt id="fmessage" label="Message" val={fmessage} onchange={e => setfmessage(e.target.value)}></IsiTxt>
              </div>
            </div>
          </div>
          <div className="card-footer">
            <Button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={() => {
                GetData();
                setIsOpen(!isOpen);
              }}
            >
              Search
            </Button>

            <Button type="button" className="btn btn-sm btn-secondary ms-2" onClick={() => setIsOpen(!isOpen)}>
              Hide
            </Button>
            {/* <Button type="button" className="btn btn-sm btn-danger ms-2" onClick={() => setIsOpen(!isOpen)}>
              Reset
            </Button> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Mst062_MaintenanceWa;
