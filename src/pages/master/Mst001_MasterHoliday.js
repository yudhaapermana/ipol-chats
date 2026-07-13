import React, { useState, useEffect } from 'react';
import { Button, Nav, Modal, Form, Row, Col } from 'react-bootstrap';

import '@1stquad/react-bootstrap-datetimepicker/css/bootstrap-datetimepicker.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { faSignOutAlt, faSearch, faRetweet, faPlus } from '@fortawesome/free-solid-svg-icons';
import IsiTxt from 'components/form/IsiTxt';
import BtnMenu from 'components/navbar/headermenu/BtnMenu';
import IsiDateTime from 'components/form/IsiDateTime';
import GridTable from 'components/form/GridTable';
import GridCard from 'components/form/GridCard';
import * as ISI from 'script/ISI.js?2';
import { TglDate } from 'script/ISI';
import useIsMobile from 'hooks/useIsMobile';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { format } from 'date-fns';
import IsiDateTimeRange from 'components/form/IsiDateTimeRange';

const Mst001_MasterHoliday = () => {
  const defaultValidation = {
    type: [true, ''],
    keterangan: [true, ''],
    addHolidays: [true, ''],
    error: false,
    fromPeriod: [true, ''],
    toPeriod: [true, ''],
    date: [true, '']
  };
  const navigate = useNavigate();
  const URL = process.env.REACT_APP_URL_API;
  const link = `${URL}api/Mst001_Holiday`;
  const lgdata = JSON.parse(localStorage.getItem('userData'));
  const [loading, setLoading] = useState(false); // Loading state to manage data fetch status
  const isFrame = self != top;

  const { height, breakpoints, width } = useBreakpoints();
  const hlheight = height - (isFrame ? 56 : 125);

  // ADD
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [addHolidays, setAddHolidays] = useState(new Date());
  const [keterangan, setKeterangan] = useState('');
  const [isUpdate, setIsUpdate] = useState(false);
  const [type, setType] = useState('');
  const [isEditMode, setEditMode] = useState(false);
  const [isHoliday, setIsHoliday] = useState(false);

  // Delete
  const [isDelete, setIsDelete] = useState(false);
  const [Obj, setObj] = useState({
    Puasa: '',
    IdulFitri: ''
  });

  // Generate
  const startOfMonth = date => new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1));
  const endOfMonth = date => new Date(Date.UTC(date.getFullYear(), date.getMonth() + 1, 0));

  const [showModalGenerate, setShowModalGenerate] = useState(false);
  // const [generateFrom, setGenerateFrom] = useState(() => startOfMonth(new Date()));
  // const [generateTo, setGenerateTo] = useState(() => endOfMonth(new Date()));
  // const [generateFrom, setGenerateFrom] = useState(new Date());
  // const [generateTo, setGenerateTo] = useState(new Date());
  // const [confirmToDB, setConfirmToDB] = useState(false);
  // const [isGenerate, setGenerate] = useState(false);

  // Filtering
  const [showFilter, setShowFilter] = useState(false);
  const [fromPeriod, setFromPeriod] = useState(() => startOfMonth(new Date()));
  const [toPeriod, setToPeriod] = useState(() => endOfMonth(new Date()));

  const [dateFr, setDateFr] = useState(new Date());
  const [dateTo, setDateTo] = useState(new Date());
  // const [fromPeriod, setFromPeriod] = useState(new Date());
  // const [toPeriod, setToPeriod] = useState(new Date());
  const [tableData, setTableData] = useState([]);
  const [isWeekend, setIsWeekend] = useState(false);
  const [isPsaIed, setPsaIed] = useState(false);
  const [isPuasa, setPuasa] = useState(false);

  // Validation
  const [valid, setValid] = useState(defaultValidation);

  // source user
  const [isDesktop, setDesktop] = useState(window.innerWidth > 750);
  const [isMobile, setMobile] = useState(window.innerWidth <= 750);
  const CheckDev = useIsMobile();

  const updateMedia = () => {
    setDesktop(window.innerWidth > 750);
    setMobile(window.innerWidth <= 750);
  };

  const getFormattedDate = dateString => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const day = String(date.getDate()).padStart(2, '0');
    // console.log(`hasil format date nya: ${year}${month}${day}`)
    // return `${year}${month}${day}`;
    return `${day}/${month}/${year}`;
  };

  const getYYYYMMDD = dateString => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const day = String(date.getDate()).padStart(2, '0');
    // console.log(`hasil format date nya: ${year}${month}${day}`)
    // return `${year}${month}${day}`;
    return `${year}${month}${day}`;
  };

  const getHours = dateString => {
    const date = new Date(dateString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}${minutes}${seconds}`;
  };

  const handleSearch = () => {
    if (!checkSearchValidation()) {
      setShowFilter(false);
      fetchData(fromPeriod.toISOString().split('.')[0], toPeriod.toISOString().split('.')[0], type);
    }
  };

  useEffect(() => {
    if (showFilter) {
      // setConfirmToDB(false);
      // setGenerate(false);
    }
    if (!showModalAdd) {
      setAddHolidays(new Date());
      setKeterangan('');
      setEditMode(false);
      setIsUpdate(false);
      setValid(prevValid => ({
        ...prevValid,
        addHolidays: [true, '']
      }));
      // setType('')
    }

    if (showModalAdd) {
      setShowFilter(false);
    }

    if (showModalGenerate) {
      setShowFilter(false);
      setValid(prevValid => ({
        ...prevValid,
        fromPeriod: [true, ''],
        toPeriod: [true, '']
      }));

      if (!Obj.Puasa && !Obj.IdulFitri) {
        setFromPeriod(startOfMonth(new Date()));
        setToPeriod(endOfMonth(new Date()));
      }
    }
    if (!showModalGenerate) {
      setPuasa(false);
      setValid(prevValid => ({
        ...prevValid,
        fromPeriod: [true, ''],
        toPeriod: [true, '']
      }));
      // setFromPeriod(startOfMonth(new Date()))
      // setToPeriod(endOfMonth(new Date()))
    }
  }, [showFilter, showModalAdd, showModalGenerate]);

  useEffect(() => {
    fetchData(startOfMonth(new Date()).toISOString().split('.')[0], endOfMonth(new Date()).toISOString().split('.')[0], '');

    window.addEventListener('resize', updateMedia);
    return () => window.removeEventListener('resize', updateMedia);
  }, []);

  const styleFilter = {
    overflow: 'hidden',
    height: showFilter ? '100%' : 0,
    transition: 'height 1s ease-out',
    top: self == top ? '6vh' : '5vh'
  };

  const isDateInRange = dateToCheck => {
    const nilainya = dateToCheck >= fromPeriod.toISOString().split('.')[0] && dateToCheck <= toPeriod.toISOString().split('.')[0];
    console.log(`Nilainya: ${nilainya}`);
    return nilainya;
  };

  const handleAddUpdate = async obj => {
    try {
      const doHolidays = await axios({
        url: `${link}/AddHolidays`,
        method: 'POST',
        headers: {
          Keys: lgdata.UserTkn
        },
        data: obj
      });
      if (doHolidays.data?.ErrMsg === '') {
        addHolidays.setHours(0, 0, 0, 0);
        fromPeriod.setHours(0, 0, 0);
        toPeriod.setHours(23, 0, 0, 0);
        // setFromPeriod(addHolidays);
        // setToPeriod(addHolidays);
        // ISI.PopAlertFalcon('Success', 'Berhasil', 'Hari Libur berhasil di simpan')

        if (isDateInRange(addHolidays.toISOString().split('.')[0])) {
          fetchData(fromPeriod.toISOString().split('.')[0], toPeriod.toISOString().split('.')[0], '');
          setFromPeriod(fromPeriod);
          setToPeriod(toPeriod);
        } else {
          const data = [
            {
              Tanggal: getFormattedDate(doHolidays.data.Tanggal),
              CreatedBy: lgdata.UserName,
              Tipe: doHolidays.data.Tipe === 'WE' ? 'Weekend' : 'Libur Nasional',
              TypeCode: doHolidays.data.Tipe,
              Keterangan: doHolidays.data.Keterangan,
              Status: doHolidays.data.Status
            }
          ];
          setTableData(data);
        }
        // setGenerate(false);
        setShowModalAdd(false);
      } else {
        ISI.PopAlertFalcon('Warning', 'Warning', doHolidays.data.ErrMsg, '');
      }
    } catch (err) {
      ISI.AlertException(err);
    }
  };

  const checkSearchValidation = () => {
    const vld = { ...defaultValidation };
    vld.error = false;

    if (!fromPeriod || isNaN(new Date(fromPeriod).getTime())) {
      vld.fromPeriod = [false, 'Tanggal harus diisi dengan benar'];
      vld.error = true;
    } else {
      vld.fromPeriod = [true, ''];
    }

    if (!toPeriod || isNaN(new Date(toPeriod).getTime())) {
      vld.toPeriod = [false, 'Tanggal harus diisi dengan benar'];
      vld.error = true;
    } else {
      vld.toPeriod = [true, ''];
    }

    setValid({ ...vld });

    return vld.error;
  };

  const checkValidation = () => {
    const vld = { ...defaultValidation };
    vld.error = false;

    if (!addHolidays || isNaN(new Date(addHolidays).getTime())) {
      vld.addHolidays = [false, 'Tanggal harus diisi dengan benar'];
      vld.error = true;
    } else {
      vld.addHolidays = [true, ''];
    }

    // if (!fromPeriod || isNaN(new Date(fromPeriod).getTime())) {
    //     vld.fromPeriod = [false, "Tanggal harus diisi dengan benar"];
    //     vld.error = true;
    //   } else {
    //     vld.fromPeriod = [true, ''];
    // }

    // if (!toPeriod || isNaN(new Date(toPeriod).getTime())) {
    //     vld.toPeriod = [false, "Tanggal harus diisi dengan benar"];
    //     vld.error = true;
    //   } else {
    //     vld.toPeriod = [true, ''];
    // }

    setValid({ ...vld });

    return vld.error;
  };

  const checkGenValidation = () => {
    const vld = { ...defaultValidation };
    vld.error = false;

    if (!fromPeriod || isNaN(new Date(fromPeriod).getTime())) {
      vld.fromPeriod = [false, 'Tanggal harus diisi dengan benar'];
      vld.error = true;
    } else {
      vld.fromPeriod = [true, ''];
    }

    if (!toPeriod || isNaN(new Date(toPeriod).getTime())) {
      vld.toPeriod = [false, 'Tanggal harus diisi dengan benar'];
      vld.error = true;
    } else {
      vld.toPeriod = [true, ''];
    }

    setValid({ ...vld });

    return vld.error;
  };

  const handleFilterSearch = () => {
    setShowFilter(prevState => !prevState);
  };

  const reformatDate = dateString => {
    const [day, month, year] = dateString.split('/'); // Pisahkan dengan '/'
    return `${day}/${month}/${year}`;
  };

  const checkToDB = async obj => {
    try {
      const parseType = obj[0].Tipe;
      // console.log(`Tipenya bang: ${parseType}`)
      const response = await axios({
        url: `${link}/GetHoliday?from=${addHolidays.toISOString().split('.')[0]}&to=${addHolidays.toISOString().split('.')[0]}&type=${type}`,
        method: 'GET',
        headers: {
          Keys: lgdata.UserTkn
        }
      });

      if (response.data && response.data.length > 0) {
        setShowModalAdd(false);
        if (isUpdate) {
          return false;
        }
        ISI.PopAlertFalcon('Warning', 'Hari libur sudah tersedia', 'Silahkan check hari libur');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error di checkToDB:', error);
      return false;
    }
  };

  const handleBtnSave = () => {
    if (checkValidation()) {
      console.log(valid);
    } else {
      isAvailableToAdd();
    }
  };

  const isAvailableToAdd = async () => {
    try {
      // format(DateRespon, 'yyyyMMdd')
      let obj = {
        // Tanggal: addHolidays.toISOString().split(".")[0],
        Tanggal: format(addHolidays, 'yyyy-MM-dd'),
        Keterangan: keterangan,
        CreateDate: new Date().toISOString().split('.')[0],
        CreatedBy: lgdata.UserId,
        CreateTime: getHours(addHolidays),
        // Tipe: type ? type : 'HD',
        Tipe: isEditMode ? type : 'HD',
        ByIP: lgdata.IP,
        UserCreate: lgdata.UserId,
        ProsesId: isUpdate ? 'UPDT' : 'ADD'
      };

      console.log(`objeknya: ${JSON.stringify(obj)}`);

      ISI.confirmISI({
        title: `Konfirmasi ${isEditMode ? 'Perubahan Hari Libur' : 'Penambahan Hari Libur'}`,
        msg: `Anda Akan ${isEditMode ? 'Merubah Keterangan?' : `Menambah Tanggal ${getFormattedDate(addHolidays)}?`}`,
        yesText: 'Yes',
        yesAction: () => handleAddUpdate(obj),
        noText: 'No',
        noAction: () => {}
      });
    } catch (err) {
      ISI.AlertException(err);
    } finally {
      setLoading(false);
    }
  };

  const isPastDate = tgl => {
    let date = TglDate(tgl, '');
    return date < new Date();
  };

  const onShow = upData => {
    if (upData) {
      console.log(`sokin`);
      setEditMode(true);
      setAddHolidays(TglDate(upData.Tanggal, ''));
      const convertedType = upData['Tipe'] === 'Weekend' ? 'WE' : upData['Tipe'] === 'Libur Nasional' ? 'HD' : upData['Tipe'];
      setType(convertedType);
      setKeterangan(upData['Keterangan']);
      setIsUpdate(true);
    } else {
      setAddHolidays(new Date());
      setKeterangan('');
      setIsUpdate(false);
    }
    setShowModalAdd(true);
  };

  const handleAction = e => {
    var act = e.currentTarget.id;
    var key = e.currentTarget.name;
    var upData = tableData.find(c => c.Tanggal === key);

    if (act === 'BtnEditG') {
      if (upData.Tipe === 'Idul Fitri' || upData.Tipe === 'Puasa') {
        setObj({
          ...Obj,
          Puasa: true,
          IdulFitri: true
        });
        setFromPeriod(TglDate(upData.Tanggal.split('-')[0], ''));
        setToPeriod(TglDate(upData.Tanggal.split('-')[1].trim(), ''));
        setPuasa(true);
        setShowModalGenerate(true);
      } else {
        setPuasa(false);
        onShow(upData);
      }
    } else if (act === 'BtnDelG') {
      ISI.confirmISI({
        title: 'Konfirmasi',
        msg: `Hapus Tanggal ${upData.Tanggal}. Keterangan: ${upData.Keterangan ? upData.Keterangan : '-'} ?`,
        yesText: 'Yes',
        yesAction: () => handleDelete(key),
        noText: 'No',
        noAction: () => {}
      });
    }
  };

  const handleDelete = async id => {
    var delData = tableData.find(c => c.Tanggal === id);

    const parsingData = {
      Tanggal: TglDate(delData.Tanggal, ''),
      Keterangan: delData.Keterangan,
      Type: type,
      ProsesId: 'DEL'
    };

    try {
      var req = await axios({
        url: `${link}/AddHolidays`,
        method: 'POST',
        headers: {
          Keys: lgdata.UserTkn
        },
        data: parsingData
      });

      var res = (await req).data;

      if (res) {
        setTableData(prevData => prevData.filter(item => item.Tanggal !== id));
      }
    } catch (error) {
      ISI.AlertException(error);
    }
  };

  const types = [
    {
      Text: 'Libur Nasional',
      Value: 'HD'
    },
    {
      Text: 'Weekend',
      Value: 'WE'
    },
    {
      Text: 'Puasa',
      Value: 'TGLPSA'
    },
    {
      Text: 'Idul Fitri',
      Value: 'TGLIED'
    }
  ];

  const generateWeekend = async (from, to) => {
    const weekend = {
      CreateDate: new Date().toISOString().split('.')[0],
      CreatedBy: lgdata.UserId,
      CreateTime: getHours(new Date()),
      ByIP: lgdata.IP,
      ProsesId: isPuasa ? 'UPDT' : 'GEN',
      Tipe: type,
      From: from.toISOString().split('.')[0],
      To: to.toISOString().split('.')[0],
      UserCreate: lgdata.UserId
    };

    try {
      const generate = await axios({
        url: `${link}/AddHolidays`,
        method: 'POST',
        headers: {
          Keys: lgdata.UserTkn
        },
        data: weekend
      });
    } catch (err) {
      ISI.AlertException(err);
    }
    setShowModalGenerate(false);
    fetchData(fromPeriod.toISOString().split('.')[0], toPeriod.toISOString().split('.')[0], `${isPuasa ? type : ''}`);
  };

  const handleConfirmGenerate = async () => {
    if (!checkGenValidation()) {
      try {
        const from = getYYYYMMDD(fromPeriod);
        const to = getYYYYMMDD(toPeriod);
        console.log('Fetching data from API');

        const fromTanggal = formatDate(from);
        const toTanggal = formatDate(to);
        console.log(`${from} -> ${fromTanggal}. TO ${to} -> ${toTanggal}`);

        ISI.confirmISI({
          title: `Konfirmasi ${isPuasa ? 'Edit' : 'Generate Hari Libur'}`,
          msg: `${isPuasa ? 'Edit menjadi' : 'Tambah hari libur dari'} ${getFormattedDate(fromPeriod)} - ${getFormattedDate(toPeriod)}?`,
          yesText: 'Yes',
          yesAction: () => {
            generateWeekend(fromPeriod, toPeriod);
          },
          noText: 'No',
          noAction: () => {}
        });
      } catch (err) {
        ISI.AlertException(err);
      } finally {
        setLoading(false);
      }
    }
    // setShowModalGenerate(false);
  };

  const formatDate = dateString => {
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);

    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const monthName = monthNames[parseInt(month, 10) - 1];
    return `${parseInt(day, 10)}/${month}/${year}`;
  };

  const fetchData = async (from, to, type) => {
    setLoading(true);
    try {
      console.log('Fetching data from API');
      const response = await axios({
        url: `${link}/GetHoliday?from=${from}&to=${to}&type=${type}`,
        method: 'GET',
        headers: {
          Keys: lgdata.UserTkn
        }
      });

      if (response.data && response.data.length > 0) {
        let isWeekendFlag = false; //

        const filteredData = response.data.map(item => {
          const isWeekend = item.Tipe === 'WE' || item.Tipe === '';

          let typeText = '';
          let dateFilter = '';
          const matchedType = types.find(t => t.Value === item.Tipe);
          if (matchedType == undefined) {
          }

          if (type == 'TGLPSA' || type == 'TGLIED') {
            const fromDate = item.From ? getFormattedDate(item.From) : '';
            const toDate = item.To ? getFormattedDate(item.To) : '';
            dateFilter = `${fromDate} - ${toDate}`;
            typeText = matchedType.Text;
          } else {
            dateFilter = getFormattedDate(item.Tanggal);
            if (matchedType != undefined) {
              typeText = matchedType.Text;
            } else {
              typeText = '';
            }
          }
          if (isWeekend) {
            isWeekendFlag = true;
          }

          return {
            Status: item.Status,
            Tanggal: dateFilter,
            CreatedBy: item.CreatedBy,
            Tipe: typeText,
            TypeCode: item.Tipe,
            Keterangan: item.Keterangan
          };
        });
        setIsWeekend(isWeekendFlag);

        setTableData(filteredData);
      } else {
        setTableData([]);
      }
    } catch (err) {
      ISI.AlertException(err);
    } finally {
      setLoading(false);
    }
  };

  let headers = [
    [
      { text: 'Action', width: '10%' },
      { text: 'Tanggal', width: '15%' },
      { text: 'Tipe', width: '10%' },
      { text: 'Keterangan', width: '45%' },
      { text: 'Created By', width: '20%' }
    ]
  ];

  let generateHeaders = [
    [
      { text: 'Tanggal', width: '20%' },
      { text: 'Tipe', width: '10%' },
      { text: 'Keterangan', width: '45%' },
      { text: 'Created By', width: '20%' }
    ]
  ];

  let mapping = [
    {
      title: '',
      propName: 'Action',
      // isNumber: true,
      isAction: true,
      actcode: 'D,E',
      actcond: [
        {
          btncd: 'D',
          propNm: 'Tipe',
          validprop: 'Libur Nasional',
          btncd: 'D',
          propNm: 'Status',
          validprop: 'Deletable'
        }
      ],
      idEdit: 'Tanggal',
      class: 'text-center'
    },
    { propName: 'Tanggal', class: 'text-center' },
    { propName: 'Tipe', class: 'text-center' },
    { propName: 'Keterangan', class: 'keterangan-cell' },
    { propName: 'CreatedBy', class: 'text-center' }
  ];

  let mappingCard = [
    {
      title: '',
      propName: 'Action',
      isAction: true,
      actcode: 'D,E',
      actcond: [{ btncd: 'D', propNm: 'Tipe', validprop: 'Libur Nasional' }],
      idEdit: 'Tanggal',
      class: 'text-center',
      col: '12'
    },
    { propName: 'Tanggal', class: 'text-center' },
    { propName: 'Tipe', class: 'text-center' },
    { propName: 'Keterangan', class: 'keterangan-cell', col: '12' }
  ];

  let generateMapping = [
    { propName: 'Tanggal', class: 'text-center' },
    { propName: 'Tipe', class: 'text-center' },
    { propName: 'Keterangan', class: 'keterangan-cell' },
    { propName: 'CreatedBy', class: 'text-center' }
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
                    List of Holiday
                  </h5>
                </div>
                <div className="col">
                  <Nav className=" justify-content-end">
                    <BtnMenu id="btnAdd" title={'Add'} icon={faPlus} color="text-info" evclick={() => setShowModalAdd(true)}></BtnMenu>
                    <BtnMenu id="btnGenerate" title={'Generate'} icon={faRetweet} color="text-info" evclick={() => setShowModalGenerate(true)}></BtnMenu>
                    <BtnMenu id="btnFilter" title={'Filter'} icon={faSearch} color="text-info" evclick={handleFilterSearch}></BtnMenu>
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
              {/* Modal Component */}
              <Modal show={showModalGenerate} onHide={() => setShowModalGenerate(false)} backdrop="static" keyboard={false}>
                <Modal.Header>
                  <Modal.Title>
                    <h5 className="mb-0 ms-1">{isPuasa ? `Update Tanggal` : `Generate Hari Libur`}</h5>
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group controlId="formFromPeriod">
                      <Form.Label>From Date</Form.Label>
                      <IsiDateTime
                        id="formFromPeriod"
                        val={fromPeriod}
                        mode="day"
                        viewMode="day"
                        onchange={e => {
                          setFromPeriod(e);
                          if (e && !isNaN(new Date(e).getTime())) {
                            setValid(prevValid => ({
                              ...prevValid,
                              fromPeriod: [true, '']
                            }));
                          } else {
                            setValid(prevValid => ({
                              ...prevValid,
                              fromPeriod: [false, 'Tanggal harus diisi dengan benar']
                            }));
                          }
                        }}
                        format={'DD/MM/yyyy'}
                        isinvalid={valid.fromPeriod}
                      ></IsiDateTime>
                    </Form.Group>
                    <Form.Group controlId="formToPeriod" className="mt-3">
                      <Form.Label>To Date</Form.Label>
                      <IsiDateTime
                        id="formToPeriod"
                        val={toPeriod}
                        mode="day"
                        viewMode="day"
                        min={fromPeriod}
                        onchange={e => {
                          setToPeriod(e);
                          if (e && !isNaN(new Date(e).getTime())) {
                            setValid(prevValid => ({
                              ...prevValid,
                              toPeriod: [true, '']
                            }));
                          } else {
                            setValid(prevValid => ({
                              ...prevValid,
                              toPeriod: [false, 'Tanggal harus diisi dengan benar']
                            }));
                          }
                        }}
                        format={'DD/MM/yyyy'}
                        isinvalid={valid.toPeriod}
                      ></IsiDateTime>
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer className="p-1 ps-3 bg-light">
                  <Button size="sm" variant="success" onClick={handleConfirmGenerate}>
                    {isPuasa ? 'Save' : 'Generate'}
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => setShowModalGenerate(false)}>
                    Cancel
                  </Button>
                </Modal.Footer>
              </Modal>
              <Modal show={showModalAdd} onHide={() => setShowModalAdd(false)} backdrop="static" keyboard={false}>
                <Modal.Header>
                  <Modal.Title>
                    <h5 className="mb-0 ms-1">{isEditMode ? 'Edit Hari Libur' : 'Tambah Hari Libur'}</h5>
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group controlId="addHolidays">
                      <Form.Label>{isEditMode ? 'Tanggal' : 'Pilih Tanggal'}</Form.Label>
                      <IsiDateTime
                        id="formAddHolidays"
                        val={addHolidays}
                        disabled={isEditMode ? true : false && isHoliday ? true : false}
                        mode="day"
                        viewMode="day"
                        onchange={e => {
                          setAddHolidays(e);
                          if (e && !isNaN(new Date(e).getTime())) {
                            setValid(prevValid => ({
                              ...prevValid,
                              addHolidays: [true, '']
                            }));
                          } else {
                            setValid(prevValid => ({
                              ...prevValid,
                              addHolidays: [false, 'Tanggal harus diisi dengan benar']
                            }));
                          }
                        }}
                        format={'DD/MM/yyyy'}
                        isinvalid={valid.addHolidays}
                      ></IsiDateTime>
                      {/* {isEditMode ? 
                            <IsiTxt 
                                label="Type"
                                typ="select"
                                obj={types}
                                val={type}
                                onchange={e => setType(e.target.value)}
                                // isinvalid={valid.type}
                                css="d-flex w-100"
                            /> : false} */}

                      <Form.Label>Keterangan</Form.Label>
                      <Form.Control
                        as="textarea"
                        type="text"
                        placeholder="Masukkan keterangan hari libur"
                        value={keterangan}
                        // isInvalid={!valid.keterangan[0]}
                        onChange={e => {
                          setKeterangan(e.target.value);
                        }}
                      ></Form.Control>
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer className="p-1 ps-3 bg-light">
                  <Button size="sm" variant="success" onClick={handleBtnSave}>
                    Save
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => setShowModalAdd(false)}>
                    Cancel
                  </Button>
                </Modal.Footer>
              </Modal>

              <div className="form-boxentry bg-light" style={styleFilter}>
                <div className="card">
                  <div className="card-body">
                    <div className="row g-1 d-flex d-row">
                      {/* <h6 className="pt-1 ps-2.5 pe-0" style={{ width: '60' }}>From Date</h6> */}
                      <div className="col-2">
                        <IsiDateTime
                          label="From Date"
                          id="fromPeriod"
                          val={fromPeriod}
                          mode="day"
                          viewMode="day"
                          onchange={e => {
                            setFromPeriod(e);
                            if (e && !isNaN(new Date(e).getTime())) {
                              setValid(prevValid => ({
                                ...prevValid,
                                fromPeriod: [true, '']
                              }));
                            } else {
                              setValid(prevValid => ({
                                ...prevValid,
                                fromPeriod: [false, 'Tanggal harus diisi dengan benar']
                              }));
                            }
                          }}
                          format={'DD/MM/yyyy'}
                          isinvalid={valid.fromPeriod}
                        ></IsiDateTime>
                      </div>
                      <div className="col-2">
                        <IsiDateTime
                          label="To Date"
                          id="toPeriod"
                          val={toPeriod}
                          mode="day"
                          viewMode="day"
                          onchange={e => {
                            setToPeriod(e);
                            if (e && !isNaN(new Date(e).getTime())) {
                              setValid(prevValid => ({
                                ...prevValid,
                                toPeriod: [true, '']
                              }));
                            } else {
                              setValid(prevValid => ({
                                ...prevValid,
                                toPeriod: [false, 'Tanggal harus diisi dengan benar']
                              }));
                            }
                          }}
                          format={'DD/MM/yyyy'}
                          min={fromPeriod}
                          isinvalid={valid.toPeriod}
                        ></IsiDateTime>
                      </div>
                      <div className="col-2">
                        <IsiTxt label="Type" typ="select" defaultValue={type} obj={types} val={type} onchange={e => setType(e.target.value)} />
                      </div>
                    </div>
                    <div className="card-footer">
                      <Button className="btn btn-sm btn-primary me-2" id="btnfSearch" name="Search" onClick={handleSearch}>
                        Search
                      </Button>
                      <Button className="btn btn-sm btn-secondary me-2" id="btnfClose" name="Close" onClick={() => setShowFilter(false)}>
                        Hide
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-body p-2">
                <div className="row">
                  <div
                    className="card col-12 border border-300 p-2"
                    // style={{ minHeight: '80vh' }}
                    style={{ height: `${hlheight}px` }}
                  >
                    {!CheckDev.isMobile ? (
                      <GridTable
                        datas={tableData}
                        // maping={isGenerate? generateMapping : mapping}
                        maping={mapping}
                        // headers={isGenerate? generateHeaders : headers}
                        headers={headers}
                        parentFunction={handleAction}
                        tbstyle={{ width: 1000 }}
                        dvstyle={{
                          width: '68%',
                          maxHeight: self == top ? '75vh' : '80vh'
                        }}
                      />
                    ) : (
                      <div className="col-12 mt-2">
                        <GridCard
                          datas={tableData}
                          maping={mappingCard}
                          headers={headers}
                          clsname="dvListDtl"
                          tbstyle={{ maxWidth: '100%' }}
                          dvstyle={{ minWidth: '100%' }}
                          parentFunction={handleAction}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Mst001_MasterHoliday;
