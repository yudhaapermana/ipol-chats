import React, { useState, useEffect, useRef } from 'react';
import { Button, Row, Col, Nav, InputGroup, FormControl, Alert, Form } from 'react-bootstrap';
import {
  useParams,
  useSearchParams,
  useNavigate,
  useLocation
} from 'react-router-dom';
import * as ISI from 'script/ISI.js?20241219-02';
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import GridTable from 'components/form/GridTable';
import {
  faSignOutAlt,
  faSave,
  faPlusCircle,
  faPlus,
  faPrint,
  faTimes,
  faEdit,
  faTrashAlt
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BtnMenu from 'components/navbar/headermenu/BtnMenu';
import IsiTxt from 'components/form/IsiTxt';
import IsiTimeline from 'components/form/IsiTimeline';
import useIsMobile from 'hooks/useIsMobile';
import { useBreakpoints } from 'hooks/useBreakpoints';
import { left, right } from 'script/ISI';
import cloudUpload from 'assets/img/icons/cloud-upload.svg';
import Flex from 'components/common/Flex';
import IsiAttach from 'components/form/IsiAttach';

const mst061_formITOAEntry = () => {
  const CheckDev = useIsMobile();
  const navigate = useNavigate();
  const URL = process.env.REACT_APP_URL_API;
  const link = `${URL}api/mst061_FormITOA`;
  const lgdata = JSON.parse(localStorage.getItem('userData'));
  const isrunn = useRef(false);
  const fileInputRef = useRef();
  const [SearchParams, setSearchParams] = useSearchParams();
  const [fUNLstUsr, setfUNLstUsr] = useState('');
  const [fDepLstUsr, setfDepLstUsr] = useState('');
  const [KeteranganCurrent, setKeteranganCurrent] = useState([]);
  const [UserIDUB, setUserIDUB] = useState('');
  const [NIKUB, setNIKUB] = useState('');
  const [NmKarUB, setNmKarUB] = useState('');
  const [DepUB, setDepUB] = useState('');
  const [SecUB, setSecUB] = useState('');
  const [UntUB, setUntUB] = useState('');
  const [GolUB, setGolUB] = useState('');
  const [imageshow, setimageshow] = useState('');
  const [showimg, setshowimg] = useState(false);
  const [Obj, setObj] = useState({
    FormITOADetailList: [],
    LsAtt: [],
  });
  const [lsITOAAprv, setlsITOAAprv] = useState([]);
  const [lsAttach, setlsAttach] = useState([]);
  const [lsmdlusre, setlsmdlusre] = useState([]);
  const [lsmdlusr, setlsmdlusr] = useState([]);
  const [lsslcUB, setlsslcUB] = useState([]);
  const [lsdepartement, setlsdepartement] = useState([]);
  const defaultValidation = {
    TypPA: [true, ''],
    KeteranganA: [true, ''],
    RemarkRej: [true, ''],
    UserIDUB: [true, ''],
    error: false
  };
  const [ValidationAct, setValidationAct] = useState({});
  const [Valid, setValid] = useState(defaultValidation);
  const [showremarkS, setshowremarkS] = useState(false);
  const hideremarkS = () => setshowremarkS(false);
  const [showremarkJ, setshowremarkJ] = useState(false);
  const hideremarkJ = () => setshowremarkJ(false);
  const [showlstUserPA, setshowlstUserPA] = useState(false);
  const hidelstUserPA = () => setshowlstUserPA(false);
  const [showlstUserUB, setshowlstUserUB] = useState(false);
  const hidelstUserUB = () => setshowlstUserUB(false);
  const [showDtlKar, setshowDtlKar] = useState(false);
  const hideDtlKar = () => setshowDtlKar(false);
  const [DataTypP, setDataTypP] = useState([
    { Value: 'UB', Text: 'User Baru' },
    { Value: 'PA', Text: 'Perubahan Akses' }
  ]);

  const { state: params } = useLocation();


  let { width, height, breakpoints } = useBreakpoints();
  let { key } = useParams();
  let { act } = useParams();
  let ddelete = {};
  let htabo = height;
  let hcb = height - 245;
  let PActionB = '';

  if (act == 'A' || act == 'VA') {
    PActionB = 'A';
    htabo = htabo - 139;
    hcb = hcb - 139;
  } else if (act == 'S' || act == 'VS') {
    PActionB = 'S';
    htabo = htabo - 139;
    hcb = hcb - 139;
  } else {
    if (lsITOAAprv.length != 0) {
      if (Obj.Status == 'U') {
        htabo = htabo - 139;
        hcb = hcb - 139;
      } else if (Obj.Status == 'S' || Obj.Status == 'J') {
        htabo = htabo - 189;
        hcb = hcb - 189;
      }
    } else {
      hcb = hcb - 29;
    }
    PActionB = 'N';
  }

  if (CheckDev.isMobile && Obj.TypePermintaan == 'PA' && Obj.FormITOADetailList.length > 1) {
    hcb = hcb + (340 * (Obj.FormITOADetailList.length - 1));
  } else if (CheckDev.isMobile && Obj.TypePermintaan == 'UB' && Obj.FormITOADetailList.length > 2) {
    hcb = hcb + (170 * (Obj.FormITOADetailList.length - 2));
  }

  useEffect(() => {
    if (act == 'E') {
      ITOABCheck();
    }
    if (isrunn.current === false) {
      GetITOA();
      GetDdlDepts();
      return () => {
        isrunn.current = true;
      };
    }
  }, []);

  const txtOnchange = e => {
    let b = { ...Obj };
    b[e.target.id] = e.target.value;
    setObj(b);
  };
  //End LR Event


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
      setfDepLstUsr(lgdata.KdDept);
    } catch (err) {
      ISI.PopAlertFalcon('error', 'error', err.response.data.ExceptionMessage, '');
    }
  };

  const onShowMdlUB = upData => {
    if (upData) {
      setUserIDUB(upData.UserIDCRB);
      setNIKUB(upData.UserIDB);
      setNmKarUB(upData.UserNMB);
      setDepUB(upData.DepartementDescB);
      setSecUB(upData.SectionDescB);
      setUntUB(upData.UnitDescB);
      setGolUB(upData.GolonganB);
    } else {
      setUserIDUB('');
      setNIKUB('');
      setNmKarUB('');
      setDepUB('');
      setSecUB('');
      setUntUB('');
      setGolUB('');
    }
    setshowDtlKar(true);
  };

  const GetITOA = async () => {
    let PIP = '';
    if (act == 'N' || act == 'E') {
      PIP = lgdata.IP;
    }

    try {
      var param = '?IP=' + PIP + '&docno=' + key + '&pact=' + act;

      let temp = await axios({
        url: `${link}/GetITOA` + param,
        method: 'GET',
        //data: obj,
        contentType: 'application/json; charset=utf-8',
        headers: {
          Keys: lgdata.UserTkn
        }
      })
        .then(response => {
          if (lgdata.KdDept != 'HA' && lgdata.KdDept != 'IT' && act == 'E') {
            setDataTypP([
              { Value: 'PA', Text: 'Perubahan Akses' }
            ]);
            // let b = {
            //   ...Obj,
            //   TypePermintaan: 'PA'
            // };
            // setObj(b);
            response.data.TypePermintaan = 'PA';
          }
          setObj(response.data);
          if (response.data.Keterangan) {
            setKeteranganCurrent(response.data.Keterangan.split('[]'));
          }
          if (response.data.AprvList) {
            setlsITOAAprv(response.data.AprvList);
          }
          // if (act == 'E') {
          //   collectFilesTemp(response.data.DocumentNumber);
          // } else {
          //   collectFiles(response.data.DocumentNumber);
          // }
          if (response.data.TypePermintaan) {
            setfDepLstUsr(response.data.Departement);
            getListMdlUsr(response.data.TypePermintaan, response.data.Departement);
          }
          if (response.data.LsAtt.length > 0 && response.data.LsAtt) {
            const coll = response.data.LsAtt.map(item => ({
              path: item.FilePath,
              id: item.ID,
              type: item.FileExt,
              name: item.FileName,
              url: item.FileUrl,
              sfpath: item.SourceFPath
            }));
            setlsAttach(coll);
          }
        })
        .catch(err => {
          ISI.PopAlertFalcon('error', 'error', err.response.data.ExceptionMessage, '');
        });
    } catch (err) {
      console.log(err);
      ISI.PopAlertFalcon('error', 'error', err.response.data.ExceptionMessage, '');
    }
  };

  const ITOACancel = async () => {
    try {
      var obj = { ...Obj };
      obj.CreatedBy = lgdata.UserId;
      obj.CreatedIP = lgdata.IP;
      obj.ProsesId = 'CancelITOA';

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
        ISI.PopAlertFalcon('error', 'error', res.Ket1, '');
      } else {
        navigate(
          `/master/mst061_FormITOAList/${PActionB}?param=${SearchParams.get(
            'param'
          )}`,
          {
            state: {
              mode: params?.mode
            }
          }
        );
      }
    } catch (error) {
      ISI.PopAlertFalcon('error', 'error', error.response.data.ExceptionMessage, '');
    }
  };

  const ITOABCheck = async () => {
    try {
      var obj = {};

      let temp = await axios({
        url: `${link}/cekITOABTemp?IP=${lgdata.IP}&UpdatedBy=${lgdata.UserId}`,
        method: 'GET',
        contentType: 'application/json; charset=utf-8',
        headers: {
          Keys: lgdata.UserTkn
        }
      });
      if (temp.data != '') {
        let ar = temp.data.split('|');
        navigate(`/master/mst061_formITOAEntryDetail/${ar[0]}/${ar[2]}/${act}${ar[1]}N?param=${SearchParams.get('param')}`);
      }
    } catch (err) {
      ISI.PopAlertFalcon('error', 'error', err.response?.data?.ExceptionMessage || err.message, '');
    }
  };

  const cekITOAUBWApp = async (DocumentNumber) => {
    try {
      var obj = {};

      let temp = await axios({
        url: `${link}/cekITOAUBWApp?DocumentNumber=${DocumentNumber}`,
        method: 'GET',
        contentType: 'application/json; charset=utf-8',
        headers: {
          Keys: lgdata.UserTkn
        }
      });
      if (temp.data != '') {
        ISI.PopAlertFalcon('Warning', 'Warning', `Untuk karyawan berikut, saat ini sudah di daftarkan pada Form Otorisasi Akses Sistem IT, <br/> mohon menunggu hingga approval selesai ! <br/> atau hapus karyawan berikut dari list <br/> ${temp.data}`, '');
      } else {
        cekMNStdUB(Obj.DocumentNumber);
      }
    } catch (err) {
      ISI.PopAlertFalcon('error', 'error', err.response?.data?.ExceptionMessage || err.message, '');
    }
  };

  const cekMNStdUB = async (DocumentNumber) => {
    try {
      var obj = {};

      let temp = await axios({
        url: `${link}/cekMNStdUB?DocumentNumber=${DocumentNumber}`,
        method: 'GET',
        contentType: 'application/json; charset=utf-8',
        headers: {
          Keys: lgdata.UserTkn
        }
      });
      if (temp.data != '') {
        ISI.PopAlertFalcon('Warning', 'Warning', `Untuk karyawan berikut belum ada Standard Access Menu, <br/> Silahkan buat Standard Access Menu terlebih dahulu ! <br/> atau hapus karyawan berikut dari list <br/> ${temp.data}`, '');
      } else {
        ISI.confirmISI({
          title: 'Konfirmasi',
          msg: `Simpan Form Otorisasi Akses Sistem IT Nomor ${Obj.DocumentNumber} ?`,
          yesText: 'Yes',
          yesAction: () => {
            ITOASave();
          },
          noText: 'No',
          noAction: () => { }
        });
      }
    } catch (err) {
      ISI.PopAlertFalcon('error', 'error', err.response?.data?.ExceptionMessage || err.message, '');
    }
  };

  const ITOASave = async () => {
    try {
      var obj = { ...Obj };
      obj.Ket1 = '';
      obj.CreatedBy = lgdata.UserId;
      obj.CreatedIP = lgdata.IP;
      obj.DepUserLogin = lgdata.KdDept;
      obj.ProsesId = 'SaveITOA';

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
        ISI.PopAlertFalcon('error', 'error', res.Ket1, '');
      } else {
        navigate(
          `/master/mst061_FormITOAList/${PActionB}?param=${SearchParams.get(
            'param'
          )}`,
          {
            state: {
              mode: params?.mode
            }
          }
        );
        //PrintPdf();
      }
    } catch (error) {
      ISI.PopAlertFalcon('error', 'error', error.response?.data?.ExceptionMessage || error.message, '');
    }
  };

  const ITOAApproval = async pact => {
    try {
      let obj = { ...Obj };
      obj.UpdatedBy = lgdata.UserId;
      obj.UpdatedIP = lgdata.IP;
      obj.ProsesId =
        pact == 'A' ? 'AppITOA' : pact == 'J' ? 'RejITOA' : 'DisAppITOA';
      let temp = await axios({
        url: `${link}/Post`,
        method: 'POST',
        data: obj,
        contentType: 'application/json; charset=utf-8',
        headers: {
          Keys: lgdata.UserTkn
        }
      })
        .then(response => {
          if (response.data.Ket1) {
            ISI.PopAlertFalcon('error', 'error', response.data.Ket1, '');
          } else {
            navigate(
              `/master/mst061_FormITOAList/${PActionB}?param=${SearchParams.get(
                'param'
              )}`
            );
          }
        })
        .catch(err => {
          ISI.PopAlertFalcon('error', 'error', err.response?.data?.ExceptionMessage || err.message, '');
        });
    } catch (err) {
      ISI.PopAlertFalcon('error', 'error', err.response?.data?.ExceptionMessage || err.message, '');
    }
  };

  const cekUSIDEXIUB = async (UserIDCRB) => {
    try {
      var obj = {};

      let temp = await axios({
        url: `${link}/cekUSIDEXIUB?UserIDCRB=${UserIDCRB}`,
        method: 'GET',
        contentType: 'application/json; charset=utf-8',
        headers: {
          Keys: lgdata.UserTkn
        }
      });
      if (temp.data != '') {
        ISI.PopAlertFalcon('Warning', 'Warning', `User id ${temp.data} sudah digunakan, <br/> Silahkan gunakan user id yang lain ! <br/>`, '');
      } else {
        EditMdlUB();
      }
    } catch (err) {
      ISI.PopAlertFalcon('error', 'error', err.response?.data?.ExceptionMessage || err.message, '');
    }
  };

  const EditMdlUB = async () => {
    try {
      var obj = { ...Obj };
      obj.ProsesId = 'EditMdlUB';
      obj.CreatedByB = lgdata.UserId;
      obj.CreatedIPB = lgdata.IP;
      obj.UserIDCRB = UserIDUB;
      obj.UserIDB = NIKUB;

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
        ISI.PopAlertFalcon('error', 'error', res.Ket1, '');
      } else {
        setObj(res);
        hideDtlKar();
      }
    } catch (error) {
      ISI.PopAlertFalcon('error', 'error', error.response?.data?.ExceptionMessage || error.message, '');
    }
  };

  const cekUSIDEMUB = async (DocumentNumber) => {
    try {
      var obj = {};

      let temp = await axios({
        url: `${link}/cekUSIDEMUB?DocumentNumber=${DocumentNumber}`,
        method: 'GET',
        contentType: 'application/json; charset=utf-8',
        headers: {
          Keys: lgdata.UserTkn
        }
      });
      if (temp.data != '') {
        ISI.PopAlertFalcon('Warning', 'Warning', `User id untuk Nama Karyawan berikut belum diisi, <br/> Silahkan diisi terlebih dahulu ! <br/> ${temp.data}`, '');
      } else {
        //cekUSIDEXUB(DocumentNumber);
        ConfITOAApproval('A');
      }
    } catch (err) {
      ISI.PopAlertFalcon('error', 'error', err.response?.data?.ExceptionMessage || err.message, '');
    }
  };

  const cekUSIDEXUB = async (DocumentNumber) => {
    try {
      var obj = {};

      let temp = await axios({
        url: `${link}/cekUSIDEXUB?DocumentNumber=${DocumentNumber}`,
        method: 'GET',
        contentType: 'application/json; charset=utf-8',
        headers: {
          Keys: lgdata.UserTkn
        }
      });
      if (temp.data != '') {
        ISI.PopAlertFalcon('Warning', 'Warning', `User id untuk Nama Karyawan berikut sudah digunakan, <br/> Silahkan gunakan user id yang lain ! <br/> ${temp.data}`, '');
      } else {
        ConfITOAApproval('A');
      }
    } catch (err) {
      ISI.PopAlertFalcon('error', 'error', err.response?.data?.ExceptionMessage || err.message, '');
    }
  };

  const FormITOADeleteTempDetail = async usid => {
    var delData = Obj.FormITOADetailList.find(c => c.UserIDB == usid);

    try {
      var obj = { ...Obj };
      obj.ProsesId = 'CancelITOAD';
      obj.CreatedByB = lgdata.UserId;
      obj.CreatedIPB = lgdata.IP;
      obj.UserIDB = usid;
      obj.DocumentNumber = delData.DocumentNumberB;

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
        ISI.PopAlertFalcon('error', 'error', res.ErrMsg);
      } else {
        setObj(res);
      }
    } catch (error) {
      ISI.PopAlertFalcon('error', 'error', error.response?.data?.ExceptionMessage || error.message, '');
    }
  };

  const FormITOAUpdTempA = async (typp, ktrg) => {
    try {
      var obj = { ...Obj };
      obj.ProsesId = 'UpdTempA';
      obj.UpdatedBy = lgdata.UserId;
      obj.UpdatedIP = lgdata.IP;
      obj.TypePermintaan = typp;
      obj.Keterangan = ktrg;

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
        ISI.PopAlertFalcon('error', 'error', res.ErrMsg);
      }
    } catch (error) {
      ISI.PopAlertFalcon('error', 'error', error.response?.data?.ExceptionMessage || error.message, '');
    }
  };

  const mappingHeaderPA = [
    [
      { text: 'Action', rowSpan: 2, width: '7%' },
      { text: 'ID User', rowSpan: 2, width: '7%' },
      { text: 'Nama User', rowSpan: 2, width: '15%' },
      { text: 'Departemen', rowSpan: 2, width: '20%' },
      { text: 'Section', rowSpan: 2, width: '15%' },
      { text: 'Unit', rowSpan: 2, width: '15%' },
      { text: 'Golongan', rowSpan: 2, width: '5%' },
      { text: 'Total Menu ERP', colSpan: 3 },
      { text: 'Total Menu Mobile', colSpan: 3 },
      { text: 'Total Menu WHM', colSpan: 3 },
      { text: 'Total Menu APP', colSpan: 3 }
    ],
    [
      { text: 'Existing', width: 100 },
      { text: 'New', width: 100 },
      { text: 'Delete', width: 100 },
      { text: 'Existing', width: 100 },
      { text: 'New', width: 100 },
      { text: 'Delete', width: 100 },
      { text: 'Existing', width: 100 },
      { text: 'New', width: 100 },
      { text: 'Delete', width: 100 },
      { text: 'Existing', width: 100 },
      { text: 'New', width: 100 },
      { text: 'Delete', width: 100 }
    ]
  ];

  let mappingTablePA = [
    {
      title: '',
      propName: 'Action',
      isNumber: false,
      isAction: true,
      actcode: act != 'E' ? 'V' : 'D' + (Obj.TypePermintaan == 'PA' ? ',E' : ''),
      idEdit: 'UserIDB',
      class: 'text-center',
      col: '12'
    },
    { propName: 'UserIDB', class: 'text-center' },
    { propName: 'UserNMB', class: 'text-center' },
    { propName: 'DepartementDescB' },
    { propName: 'SectionDescB' },
    { propName: 'UnitDescB' },
    { propName: 'GolonganB', class: 'text-center' },
    { propName: 'CountERP', class: 'text-center' },
    { propName: 'CountNewERP', class: 'text-center' },
    { propName: 'CountDelERP', class: 'text-center' },
    { propName: 'CountMobile', class: 'text-center' },
    { propName: 'CountNewMobile', class: 'text-center' },
    { propName: 'CountDelMobile', class: 'text-center' },
    { propName: 'CountWHM', class: 'text-center' },
    { propName: 'CountNewWHM', class: 'text-center' },
    { propName: 'CountDelWHM', class: 'text-center' },
    { propName: 'CountAPP', class: 'text-center' },
    { propName: 'CountNewAPP', class: 'text-center' },
    { propName: 'CountDelAPP', class: 'text-center' }
  ];

  const mappingHeaderUB = [
    [
      { text: 'Action', width: 70 },
      { text: 'User ID', width: 60 },
      { text: 'NIK', width: 85 },
      { text: 'Nama Karyawan', width: 250 },
      { text: 'Departemen', width: 250 },
      { text: 'Section', width: 250 },
      { text: 'Unit', width: 250 },
      { text: 'Golongan', width: 80 }
    ]
  ];

  let mappingTableUB = [
    {
      title: '',
      propName: 'Action',
      isNumber: false,
      isAction: true,
      actcode: act != 'E' ? ((act == 'A' && Obj.IsLastApp) ? 'E' : '') : 'D' + (Obj.TypePermintaan == 'PA' ? ',E' : ''),
      idEdit: 'UserIDB',
      class: 'text-center',
      col: '12'
    },
    { propName: 'UserIDCRB' },
    { propName: 'UserIDB', class: 'text-center' },
    { propName: 'UserNMB' },
    { propName: 'DepartementDescB' },
    { propName: 'SectionDescB' },
    { propName: 'UnitDescB' },
    { propName: 'GolonganB', class: 'text-center' }
  ];

  const handleAction = e => {
    let pact = '';
    let usid = '';
    if (e.currentTarget) {
      pact = e.currentTarget.id;
      usid = e.currentTarget.name;
    } else {
      let ar = e.split('|');
      pact = ar[0];
      usid = ar[1];
    }
    var upData = Obj.FormITOADetailList.find(c => c.UserIDB == usid);
    if (pact === 'BtnEditG') {
      if (act == 'A' && Obj.IsLastApp) {
        onShowMdlUB(upData);
      } else {
        navigate(`/master/mst061_formITOAEntryDetail/${key}/${usid}/${act}${Obj.TypePermintaan}E?param=${SearchParams.get('param')}`);
      }
    } else if (pact === 'BtnDelG') {
      ISI.confirmISI({
        title: 'Konfirmasi',
        msg: `Hapus ${(Obj.TypePermintaan == 'PA' ? ' ID User' : ' NIK')} ${usid} ?`,
        yesText: 'Yes',
        yesAction: () => FormITOADeleteTempDetail(usid),
        noText: 'No',
        noAction: () => { }
      });
    } else if (pact === 'BtnViewG') {
      navigate(`/master/mst061_formITOAEntryDetail/${key}/${usid}/${act}${Obj.TypePermintaan}V?param=${SearchParams.get('param')}`);
    }
  };

  const ConfITOACancel = async () => {
    if (params?.mode == 'ST') PActionB = 'ST';
    if (act != 'E') {
      navigate(
        `/master/mst061_FormITOAList/${PActionB}?param=${SearchParams.get(
          'param'
        )}`
      );
    } else {
      ISI.confirmISI({
        title: 'Konfirmasi',
        msg: 'Cancel Form Otorisasi Akses Sistem IT ?',
        yesText: 'Yes',
        yesAction: () => {
          ITOACancel();
        },
        noText: 'No',
        noAction: () => { }
      });
    }
  };

  const ConfITOAApproval = async pact => {
    setValid(defaultValidation);
    let Vld = { ...defaultValidation };
    // if (
    //   (Keterangan == '' || Keterangan == undefined) &&
    //   act == 'A' &&
    //   lgdata.KdDept == 'IT' &&
    //   pact == 'A'
    // ) {
    //   Vld = {
    //     ...Vld,
    //     KeteranganA: [false, 'Keterangan harus diisi'],
    //     error: true
    //   };
    // }
    setValid(Vld);
    if (!Vld.error) {
      ISI.confirmISI({
        title: 'Konfirmasi',
        msg: `Are you sure want to ${pact == 'A' ? 'Approve' : pact == 'J' ? 'Reject' : 'Disapprove'
          } this data?`,
        yesText: 'Yes',
        yesAction: () => {
          ITOAApproval(pact);
        },
        noText: 'No',
        noAction: () => { }
      });
    }
  };

  const SaveITOA = async () => {
    try {
      setValid(defaultValidation);
      let Vld = { ...defaultValidation };
      if (Obj.TypePermintaan == '') {
        Vld = {
          ...Vld,
          TypPA: [false, 'Type harus dipilih'],
          error: true
        };
      }
      if (Obj.Keterangan == '') {
        Vld = {
          ...Vld,
          KeteranganA: [false, 'Keterangan harus diisi'],
          error: true
        };
      }
      setValid(Vld);
      if (!Vld.error) {
        if (Obj.FormITOADetailList.length == 0) {
          ISI.PopAlertFalcon(
            'Warning',
            'Warning',
            `Mohon isi setidaknya satu ${(Obj.TypePermintaan == 'PA' ? ' User' : ' Karyawan')}`,
            ''
          );
        } else {
          if (Obj.TypePermintaan == 'PA') {
            ISI.confirmISI({
              title: 'Konfirmasi',
              msg: `Simpan Form Otorisasi Akses Sistem IT Nomor ${Obj.DocumentNumber} ?`,
              yesText: 'Yes',
              yesAction: () => {
                ITOASave();
              },
              noText: 'No',
              noAction: () => { }
            });
          } else {
            cekITOAUBWApp(Obj.DocumentNumber);
          }
        }
      }
    } catch (err) {
      ISI.PopAlertFalcon('error', 'error', err.response.data.ExceptionMessage, '');
    }
  };

  const FileITARUpload = async event => {
    //const isValid = await checkValidation();
    //if (!isValid) {
    const file = event.target.files[0];
    if (file.size > 10000000)
      ISI.PopAlertFalcon('error', 'error', 'Max Size File Upload 10mb', '');
    else if (file.type != 'application/pdf') {
      ISI.PopAlertFalcon('error', 'error', 'Upload hanya boleh file pdf', '');
    }
    else {
      const formData = new FormData();
      formData.append('ID', key);
      formData.append('file', file);
      formData.append('IP', lgdata.IP);
      formData.append('Usid', lgdata.UserId);
      formData.append('Folder', 'ITAR');
      formData.append('DocNo', key);
      formData.append('Type', 'ITAR');
      try {
        var temp = await axios({
          url: `${URL}api/FileUpload/UploadToTemp`,
          method: 'POST',
          data: formData,
          contentType: 'multipart/form-data',
          headers: {
            Keys: lgdata.UserTkn
          }
        });
        if (temp.data.Msg == '' || temp.data.Msg == null) {
          var ls = [...lsAttach];
          ls.push({
            id: temp.data.ID,
            name: temp.data.FileName,
            type: temp.data.FileExt,
            url: temp.data.FileUrl,
            path: temp.data.FilePath,
            sfpath: temp.data.SourceFPath,
            folder: '',
            mode: ''
          });
          Obj.LsAtt.push(temp.data);
          setlsAttach(ls);
        } else {
          ISI.PopAlertFalcon('error', 'error', temp.data.Msg, '');
          fileInputRef.current.value = null;
        }
      } catch (err) {
        ISI.AlertException(err);
      }
    }
    //}
  };

  const DelITARAttach = async (id, name, path, folder) => {
    var ids = id;
    ddelete = Obj.LsAtt.find(x => x.ID == id);
    if (ddelete) {
      ISI.confirmISI({
        title: 'Form Otorisasi Akses Sistem IT',
        msg: `Anda akan Hapus File : ${name}`,
        yesText: 'Yes',
        yesAction: DoDelete,
        // yesAction: () => {},
        noText: 'No',
        noAction: () => { }
      });
    }
  };

  const DoDelete = async e => {
    ddelete.ID = '';
    await axios({
      url: `${URL}api/FileUpload/DeleteFileTemp`,
      method: 'POST',
      data: ddelete,
      contentType: 'application/json; charset=utf-8',
      headers: {
        Keys: lgdata.UserTkn
      }
    })
      .then(response => {
        Obj.LsAtt = Obj.LsAtt.filter(x => x.SeqNo != ddelete.SeqNo);
        const ls = Obj.LsAtt.filter(x => x.SeqNo != ddelete.SeqNo).map(dt => {
          return {
            id: dt.ID,
            name: dt.FileName,
            type: dt.FileExt,
            url: dt.FileUrl,
            path: dt.FilePath,
            sfpath: dt.SourceFPath,
            folder: '',
            mode: ''
          };
        });
        setlsAttach(ls);
        // } else ISI.PopAlertFalcon('Warning', 'Warning', response.data.Msg, '');
      })
      .catch(err => {
        // catch any unexpected errors
        ISI.AlertException(err);
      });
  };

  const ShowImage = async url => {
    setimageshow(url);
    setshowimg(true);
  };

  const FormITOAInsertTempB = async (KDUserL, typ) => {
    try {
      var obj = { ...Obj };
      obj.CreatedIPB = lgdata.IP;
      obj.ProsesId = 'InsTempB';
      obj.CreatedByB = lgdata.UserId;
      obj.KDUserL = KDUserL;
      obj.NoUrutB = '';

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
        ISI.PopAlertFalcon('error', 'error', res.Ket1, '');
      } else {
        FormITOAUpdTempA(Obj.TypePermintaan, Obj.Keterangan);
        if (typ == 'PA') {
          navigate(`/master/mst061_formITOAEntryDetail/${key}/${KDUserL}/${act}${Obj.TypePermintaan}N?param=${SearchParams.get('param')}`);
        }
        setObj(res);
      }
    } catch (error) {
      ISI.PopAlertFalcon('error', 'error', error.response.data.ExceptionMessage, '');
    }

  };

  const getListMdlUsr = async (typp, dep) => {
    try {
      let obj = { ...Obj };
      obj.TypePermintaan = typp;

      let temp = await axios({
        url: `${link}/GetListUser`,
        method: 'POST',
        data: obj,
        contentType: 'application/json; charset=utf-8',
        headers: {
          Keys: lgdata.UserTkn
        }
      })
        .then(response => {
          setlsmdlusre(response.data);
          setlsmdlusr(response.data);
          if (dep != '') setlsmdlusr(response.data.filter(x => x.DepartementL == dep));
        })
        .catch(err => {
          ISI.PopAlertFalcon('error', 'error', err.response?.data?.ExceptionMessage || err.message, '');
        });
    } catch (error) {
      ISI.PopAlertFalcon('', 'Error', error.message);
    }
  };

  const mpLstUsrHdr = [
    [
      { text: 'Action', width: 55 },
      { text: 'Kode User', width: 80 },
      { text: 'Nama User', width: 230 },
      { text: 'Departemen', width: 180 },
      { text: 'Section', width: 220 },
      { text: 'Unit', width: 200 },
      { text: 'Golongan', width: 70 }
    ]
  ];

  let mpLstUsrTbl = [
    {
      title: '',
      propName: 'Action',
      isNumber: false,
      isAction: true,
      actcode: '',
      addbtn: [
        {
          id: 'btnAU',
          nm: 'Add User',
          tool: 'Add User',
          icn: faPlus,
          color: 'text-success',
          validprop: true
        }
      ],
      idEdit: 'KDUserL',
      class: 'text-center',
      col: '12'
    },
    { propName: 'KDUserL' },
    { propName: 'NMUserL' },
    { propName: 'DepartementDescL' },
    { propName: 'SectionDescL' },
    { propName: 'UnitDescL', class: 'text-nowrap' },
    { propName: 'GolonganL', class: 'text-center' }
  ];

  const onSearch = (usr, dep) => {
    if (usr != '' || dep != '') {
      if (usr != '' && dep != '') {
        setlsmdlusr(lsmdlusre.filter(x => x.NMUserL.toUpperCase().includes(usr.toUpperCase())).filter(x => x.DepartementL == dep));
      } else if (usr != '' && dep == '') {
        setlsmdlusr(lsmdlusre.filter(x => x.NMUserL.toUpperCase().includes(usr.toUpperCase())));
      } if (usr == '' && dep != '') {
        setlsmdlusr(lsmdlusre.filter(x => x.DepartementL == dep));
      }
    } else if (usr == '' && dep == '') {
      setlsmdlusr(lsmdlusre);
    }
  };

  const handleActionLstUsr = e => {
    let pact = '';
    let kdus = '';
    if (e.currentTarget) {
      pact = e.currentTarget.id;
      kdus = e.currentTarget.name;
    } else {
      let ar = e.split('|');
      pact = ar[0];
      kdus = ar[1];
    }
    if (pact === 'btnAU') {
      FormITOAInsertTempB(kdus, 'PA');
    }
  };

  const handleCheck = e => {
    let ls = [...lsslcUB];
    let d = lsmdlusr.find(x => x.KDUserL == e.target.id);
    if (d) {
      if (e.target.checked) {
        ls.push(d);
      } else {
        ls = ls.filter(x => x.KDUserL != e.target.id);
      }
    }
    setlsslcUB(ls);
  };

  const SavelstUB = async () => {
    try {
      if (lsslcUB.length == 0) {
        ISI.PopAlertFalcon('Warning', 'Warning', 'Mohon Pilih setidaknya satu Karyawan', '');
      } else {
        FormITOAUpdTempA(Obj.TypePermintaan, Obj.Keterangan);
        lsslcUB.forEach(ls => {
          FormITOAInsertTempB(ls.KDUserL, 'UB');
        });
        const processPromises = [hidelstUserUB()];
        await Promise.all(processPromises);
        await GetITOA();
        //hidelstUserUB();
        //GetITOA();
      }
    } catch (err) {
      ISI.PopAlertFalcon('error', 'error', err.response?.data?.ExceptionMessage || err.message, '');
    }
  };

  return (
    <>
      <Row className="g-0">
        <Col>
          <div className="card">
            <div className="card-header bg-light ps-1 pe-1 pt-2 pb-2">
              <div className="row ">
                <div className="col pt-1">
                  <h5 id="LblHdr" className="mb-0">
                    Form Otorisasi Akses Sistem IT
                  </h5>
                </div>

                <div className="col-auto">
                  <Nav className="justify-content-end ">
                    <BtnMenu
                      id="BtnBack"
                      title="Back"
                      icon={faSignOutAlt}
                      color="text-info"
                      evclick={e => {
                        //Delete Temp
                        ConfITOACancel();
                      }}
                    ></BtnMenu>
                  </Nav>
                </div>
              </div>
            </div>
            <div className="card-body p-1">
              <div className="row g-1">
                <div className="col-12 col-lg-3 px-x1">
                  <div className="row g-1 d-flex">
                    <div className="col-12 col-md-12">
                      <IsiTxt
                        label={'Nomor Dokumen'}
                        val={Obj.DocumentNumber}
                        onchange={txtOnchange}
                        maxLength={300}
                        readonly={true}
                      ></IsiTxt>
                    </div>
                  </div>
                  <div className="row g-1 d-flex">
                    <div className="col-12 col-md-12">
                      <IsiTxt
                        label={'Tanggal'}
                        val={Obj.StrTgl}
                        onchange={txtOnchange}
                        maxLength={300}
                        readonly={true}
                      ></IsiTxt>
                    </div>
                  </div>
                  <div className="row g-1 d-flex">
                    <div className="col-12 col-md-12">
                      <IsiTxt
                        id={'TypePermintaan'}
                        label={'Type Permintaan'}
                        typ="select"
                        obj={DataTypP}
                        val={Obj.TypePermintaan}
                        onchange={e => {
                          txtOnchange(e);
                          FormITOAUpdTempA(e.target.value, Obj.Keterangan);
                          getListMdlUsr(e.target.value, Obj.Departement);
                          let Vld = { ...Valid };
                          if (e.target.value == '') {
                            Vld = {
                              ...Vld,
                              TypPA: [false, 'Type harus dipilih'],
                              error: true
                            };
                          } else {
                            Vld = {
                              ...Vld,
                              TypPA: [true, ''],
                              error: false
                            };
                          }
                          setValid(Vld);
                        }}
                        name={'TypePermintaan'}
                        disabled={act != 'E' || Obj.FormITOADetailList.length > 0}
                        //disabled={act != 'E'}
                        isinvalid={Valid.TypPA}
                      ></IsiTxt>
                    </div>
                  </div>
                </div>
                <div className={`col-12 col-lg-3 ${(!CheckDev.isMobile) ? '' : 'px-x1'}`}>
                  <div className="row g-1 d-flex">
                    <div className="col-12 col-md-12">
                      <IsiTxt
                        id="Keterangan"
                        label={'Keterangan'}
                        row={6}
                        val={Obj.Keterangan}
                        css={'ps-1 pe-1 '}
                        onchange={e => {
                          txtOnchange(e);
                          let Vld = { ...Valid };
                          if (e.target.value == '') {
                            Vld = {
                              ...Vld,
                              KeteranganA: [false, 'Keterangan harus diisi'],
                              error: true
                            };
                          } else {
                            Vld = {
                              ...Vld,
                              KeteranganA: [true, ''],
                              error: false
                            };
                          }
                          setValid(Vld);
                        }}
                        // onblur={e => {
                        //   if (act == 'E') {
                        //     FormITOAUpdTempA(Obj.TypePermintaan, e.target.value);
                        //   }
                        // }}
                        readonly={act != 'E'}
                        isinvalid={Valid.KeteranganA}></IsiTxt>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-lg-6 px-x1">
                  <div className={`dropzone-area mt-1`} style={{ height: '90%' }}>
                    <div
                      className={` ${(act != 'E') ? 'd-none' : ''}`}
                      style={{ height: '40px' }}
                    >
                      <Form.Control
                        id="SALFileUpload"
                        size="sm"
                        type="file"
                        accept="image/*,.doc,.docx,.xls,.xlsx,.pdf"
                        capture="environment"
                        ref={fileInputRef}
                        onChange={FileITARUpload}
                        onClick={e => (e.target.value = null)}
                        className="d-none"
                        disabled={(act != 'E')}
                      ></Form.Control>
                      <label htmlFor="SALFileUpload">
                        <Flex justifyContent="center">
                          <img
                            src={cloudUpload}
                            alt=""
                            width={25}
                            className="me-2 mt-1"
                          />
                          <p className="fs-9 mb-0 mt-1 text-700">
                            Browse your files here
                          </p>
                        </Flex>
                      </label>
                    </div>

                    <div className="row g-1">
                      {lsAttach.map(attachment => (
                        <IsiAttach
                          {...attachment}
                          key={attachment.id}
                          handleDelete={DelITARAttach}
                          handleShow={ShowImage}
                          col={'4'}
                          mode={((act != 'E') || !attachment.sfpath.includes('Temp')) ? 'L' : ''}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="card ms-3 me-3" style={{ height: hcb }}>
                    <div className="card-header border-bottom border-200 ps-1 pe-1 pt-1 pb-1 bg-body-tertiary">
                      <div className="row ">
                        <div className="col pt-1">
                          <h5 className="mb-0 fs--2">List  {(Obj.TypePermintaan == 'PA' ? ' User' : ' Karyawan')}</h5>
                        </div>
                        <div className="col-auto">
                          <Nav className={`justify-content-end ${(Obj.TypePermintaan == '' || act != 'E') ? 'd-none' : ''}`}>
                            <BtnMenu
                              id="btnAdd"
                              title="Add"
                              icon={faPlusCircle}
                              color="text-info"
                              evclick={e => {
                                if (Obj.TypePermintaan == 'PA') {
                                  setshowlstUserPA(true);
                                }
                                else {
                                  setlsslcUB([]);
                                  setshowlstUserUB(true);
                                }
                              }}
                            ></BtnMenu>
                          </Nav>
                        </div>
                      </div>
                    </div>

                    <div className="card-body p-0">
                      <div className="pt-0 pt-2 px-x1 ask-analytics">

                        <div className="row g-1">
                          <div
                            className="col-sm-12 col-lg-12"
                            style={{ height: !CheckDev.isMobile ? htabo - 345 : '100%' }}
                          >
                            {!CheckDev.isMobile ? (
                              <GridTable
                                datas={
                                  Obj.FormITOADetailList
                                    ? Obj.FormITOADetailList
                                    : []
                                }
                                clsname="dvListDtl mt-1"
                                maping={(Obj.TypePermintaan == 'PA' ? mappingTablePA : mappingTableUB)}
                                headers={(Obj.TypePermintaan == 'PA' ? mappingHeaderPA : mappingHeaderUB)}
                                parentFunction={handleAction}
                                tbstyle={{
                                  width: '100%',
                                  maxHeight: '100%'
                                }}
                                dvstyle={{
                                  width: '100%',
                                  maxHeight: '100%'
                                }}
                              />
                            ) : (
                              <div
                                className="overflow-auto"
                                style={{ height: '100%' }}
                              >
                                {Obj.FormITOADetailList.map(cl => {
                                  return (
                                    <div className="row g-1">
                                      <div className="col-12 col-lg-4">
                                        <div className="border border-1 border-300 rounded-2 p-2 ask-analytics-item position-relative mb-1">
                                          <div className="row g-0">
                                            <div className="col-12">
                                              <div className="d-flex align-items-center mb-1">
                                                <a
                                                  className="text-decoration-none w-100"
                                                  href="#!"
                                                >
                                                  <h6 className="ps-2 fs--1 text-1000 w-100 ">
                                                    {Obj.TypePermintaan == 'UB' ? (
                                                      <>
                                                        <span className="text-secondary pe-1">
                                                          User ID :
                                                        </span>
                                                        {`${cl.UserIDCRB}`}
                                                        <br />
                                                      </>) : ('')}
                                                    <span className="text-secondary pe-1">
                                                      {`${Obj.TypePermintaan == 'PA' ? 'ID User :' : 'NIK :'}`}
                                                    </span>
                                                    {`${cl.UserIDB}`}
                                                    <br />
                                                    <span className="text-secondary pe-1">
                                                      {`${Obj.TypePermintaan == 'PA' ? 'Nama User :' : 'Nama Karyawan :'}`}
                                                    </span>
                                                    {`${cl.UserNMB}`}
                                                    <br />
                                                    <span className="text-secondary pe-1">
                                                      Departemen :
                                                    </span>
                                                    {`${cl.DepartementDescB}`}
                                                    <br />
                                                    <span className="text-secondary pe-1">
                                                      Seksi :
                                                    </span>
                                                    {`${cl.SectionDescB}`}
                                                    <br />
                                                    <span className="text-secondary pe-1">
                                                      Unit :
                                                    </span>
                                                    {`${cl.UnitDescB}`}
                                                    <br />
                                                    <span className="text-secondary pe-1">
                                                      Golongan :
                                                    </span>
                                                    {`${cl.GolonganB}`}
                                                    <br />

                                                    {Obj.TypePermintaan == 'PA' ? (
                                                      <>
                                                        <span className="text-secondary pe-1">
                                                          Total Existing Menu ERP :
                                                        </span>
                                                        {`${cl.CountERP}`}
                                                        <br />
                                                        <span className="text-secondary pe-1">
                                                          Total New Menu ERP :
                                                        </span>
                                                        {`${cl.CountNewERP}`}
                                                        <br />
                                                        <span className="text-secondary pe-1">
                                                          Total Delete Menu ERP :
                                                        </span>
                                                        {`${cl.CountDelERP}`}
                                                        <br />
                                                        <span className="text-secondary pe-1">
                                                          Total Existing Menu Mobile :
                                                        </span>
                                                        {`${cl.CountMobile}`}
                                                        <br />
                                                        <span className="text-secondary pe-1">
                                                          Total New Menu Mobile :
                                                        </span>
                                                        {`${cl.CountNewMobile}`}
                                                        <br />
                                                        <span className="text-secondary pe-1">
                                                          Total Delete Menu Mobile :
                                                        </span>
                                                        {`${cl.CountDelMobile}`}
                                                        <br />
                                                        <span className="text-secondary pe-1">
                                                          Total Existing Menu WHM :
                                                        </span>
                                                        {`${cl.CountWHM}`}
                                                        <br />
                                                        <span className="text-secondary pe-1">
                                                          Total New Menu WHM :
                                                        </span>
                                                        {`${cl.CountNewWHM}`}
                                                        <br />
                                                        <span className="text-secondary pe-1">
                                                          Total Delete Menu WHM :
                                                        </span>
                                                        {`${cl.CountDelWHM}`}
                                                        <br />
                                                        <span className="text-secondary pe-1">
                                                          Total Existing Menu APP :
                                                        </span>
                                                        {`${cl.CountAPP}`}
                                                        <br />
                                                        <span className="text-secondary pe-1">
                                                          Total New Menu APP :
                                                        </span>
                                                        {`${cl.CountNewAPP}`}
                                                        <br />
                                                        <span className="text-secondary pe-1">
                                                          Total Delete Menu APP :
                                                        </span>
                                                        {`${cl.CountDelAPP}`}
                                                        <br />
                                                      </>) : ('')}
                                                  </h6>
                                                </a>
                                              </div>
                                            </div>
                                            <div className="col-12 text-center">
                                              <div>
                                                <span
                                                  className={`text-warning fa-1x pointer ${act == 'E'
                                                    ? 'm-2'
                                                    : 'd-none'
                                                    }`}
                                                  title="Delete"
                                                  role="button"
                                                  onClick={() => {
                                                    handleAction(
                                                      'BtnDelG|' + cl.UserIDB
                                                    );
                                                  }}
                                                >
                                                  <FontAwesomeIcon
                                                    icon={faTrashAlt}
                                                  />
                                                </span>
                                                <span
                                                  className={`text-danger  fa-1x pointer ${act == 'E'
                                                    ? 'm-2'
                                                    : 'd-none'
                                                    }`}
                                                  title="Edit"
                                                  role="button"
                                                  onClick={() => {
                                                    handleAction(
                                                      'BtnEditG|' + cl.UserIDB
                                                    );
                                                  }}
                                                >
                                                  <FontAwesomeIcon
                                                    icon={faEdit}
                                                  />
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
                        </div>
                      </div>
                    </div>
                  </div>

                  {Obj.RemarkReject && Obj.Status != 'U' ? (
                    <Alert
                      key="danger"
                      variant="danger"
                      show={Obj.RemarkReject}
                      className="mt-3 ms-3 me-3"
                    >
                      Remark : {Obj.RemarkReject}
                    </Alert>
                  ) : (
                    ''
                  )}
                  {lsITOAAprv.length != 0 ? (
                    <div className="mt-3">
                      <IsiTimeline
                        Show={lsITOAAprv.length != 0}
                        Data={lsITOAAprv}
                      ></IsiTimeline>
                    </div>
                  ) : (
                    ''
                  )}
                </div>
                <div className="card-footer border-top border-200 ps-3 pe-1 pt-2 pb-1">
                  <Nav className="justify-content">
                    {act != 'E' ? (
                      ''
                    ) : (
                      <Button
                        variant="success"
                        size="sm"
                        className="me-2"
                        onClick={SaveITOA}
                      >
                        Save
                      </Button>
                    )}
                    {act == 'S' && Obj.Status == 'U' ? (
                      <Button
                        variant="warning"
                        size="sm"
                        className="me-2"
                        onClick={() => {
                          setshowremarkS(true);
                        }}
                      >
                        Disapprove
                      </Button>
                    ) : (
                      ''
                    )}

                    {act == 'A' && Obj.Status == 'U' ? (
                      <>
                        <Button
                          variant="warning"
                          size="sm"
                          className="me-2"
                          onClick={() => {
                            setshowremarkJ(true);
                          }}
                        >
                          Reject
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          className="me-2"
                          onClick={e => {
                            if (act == 'A' && Obj.IsLastApp) {
                              cekUSIDEMUB(Obj.DocumentNumber);
                            } else {
                              ConfITOAApproval('A');
                            }
                          }}
                        >
                          Approve
                        </Button>
                      </>
                    ) : (
                      ''
                    )}
                    {/* {lsITOAAprv.length != 0 ? (
                      <Button
                        variant="primary"
                        size="sm"
                        className="me-2"
                        onClick={e => {
                          PrintPdf();
                        }}
                      >
                        Print
                      </Button>
                    ) : (
                      ''
                    )} */}
                    <Button
                      variant="secondary"
                      size="sm"
                      className="me-2"
                      onClick={e => {
                        //Delete Temp
                        ConfITOACancel();
                      }}
                    >
                      {act != 'E' ? 'Close' : 'Cancel'}
                    </Button>
                  </Nav>
                </div>

                <Modal
                  show={showlstUserPA}
                  onHide={hidelstUserPA}
                  backdrop="static"
                  keyboard={false}
                  size="xl"
                >
                  <Modal.Header
                    className="p-0 ps-3 pe-3 bg-primary"
                    closeVariant='white' closeButton
                  >
                    <Modal.Title className="text-white">List User Perubahan Akses</Modal.Title>
                  </Modal.Header>
                  <Modal.Body className="ps-3 pt-0 rounded-bottom">
                    <div className="pt-2">
                      <IsiTxt
                        id={'Name'}
                        label={'Nama User'}
                        val={fUNLstUsr}
                        onchange={e => {
                          setfUNLstUsr(e.target.value);
                          //onSearch(e.target.value, fDepLstUsr);
                        }}
                      ></IsiTxt>
                      <IsiTxt
                        id="Departement"
                        label="Departemen"
                        typ="select"
                        obj={lsdepartement}
                        val={fDepLstUsr}
                        onchange={e => {
                          setfDepLstUsr(e.target.value);
                          //onSearch(fUNLstUsr, e.target.value);
                        }}
                        name={'Departement'}
                      ></IsiTxt>
                      <Button
                        className="btn btn-sm btn-success me-2"
                        id="btnfSearch"
                        name="Search"
                        onClick={e => onSearch(fUNLstUsr, fDepLstUsr)}
                      >
                        Search
                      </Button>
                      <div className="d-flex">
                        <GridTable
                          datas={lsmdlusr.filter(i => !Obj.FormITOADetailList.map(car => car.UserIDB).includes(i.KDUserL))}
                          clsname="dvListDtl mt-1"
                          maping={mpLstUsrTbl}
                          headers={mpLstUsrHdr}
                          parentFunction={handleActionLstUsr}
                          tbstyle={{
                            width: '100%',
                            height: '100%'
                          }}
                          dvstyle={{
                            width: '100%',
                            //height: '100%',
                            maxHeight: htabo - 300
                          }}
                        />
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer className={`p-1 ps-3 bg-light`}>
                    <Button variant="secondary" size="sm" onClick={hidelstUserPA}>
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>

                <Modal
                  show={showlstUserUB}
                  onHide={hidelstUserUB}
                  backdrop="static"
                  keyboard={false}
                  size="xl"
                >
                  <Modal.Header
                    className="p-0 ps-3 pe-3 bg-primary"
                    closeVariant='white' closeButton
                  >
                    <Modal.Title className="text-white">List User Baru</Modal.Title>
                  </Modal.Header>
                  <Modal.Body className="ps-3 pt-0 rounded-bottom">
                    <div className="pt-2">
                      <IsiTxt
                        id={'Name'}
                        label={'Nama User'}
                        val={fUNLstUsr}
                        onchange={e => {
                          setfUNLstUsr(e.target.value);
                          //onSearch(e.target.value, fDepLstUsr);
                        }}
                      ></IsiTxt>
                      <IsiTxt
                        id="Departement"
                        label="Departemen"
                        typ="select"
                        obj={lsdepartement}
                        val={fDepLstUsr}
                        onchange={e => {
                          setfDepLstUsr(e.target.value);
                          //onSearch(fUNLstUsr, e.target.value);
                        }}
                        name={'Departement'}
                      ></IsiTxt>
                      <Button
                        className="btn btn-sm btn-success me-2"
                        id="btnfSearch"
                        name="Search"
                        onClick={e => {
                          //setlsslcUB([]);
                          onSearch(fUNLstUsr, fDepLstUsr);
                        }}
                      >
                        Search
                      </Button>
                      <div className="d-flex mt-3">
                        <div class="table-responsive floatHeader frezeLeft dvListDtl" style={{ overflow: 'auto', maxHeight: htabo - 450 }}>
                          <div />
                          <table class="GridItem">
                            <thead>
                              <tr class="hdr">
                                <th scope="col" class="tdcenter" width="55">Action</th>
                                <th scope="col" class="tdcenter" width="80">NIK Karyawan</th>
                                <th scope="col" class="tdcenter" width="230">Nama Karyawan</th>
                                <th scope="col" class="tdcenter" width="180">Departemen</th>
                                <th scope="col" class="tdcenter" width="220">Section</th>
                                <th scope="col" class="tdcenter" width="260">Unit</th>
                                <th scope="col" class="text-center" width="70">Golongan</th>
                              </tr>
                            </thead>
                            <tbody>
                              {/* .filter(i => !lsslcUB.map(car => car.KDUserL).includes(i.KDUserL)) Obj.FormITOADetailList*/}
                              {(lsmdlusr.filter(i => !Obj.FormITOADetailList.map(car => car.UserIDB).includes(i.KDUserL))).map((data, idx) => {
                                var d = lsslcUB.find(x => x.KDUserL == data.KDUserL);
                                var ck = d ? true : false;
                                return (
                                  <tr key={idx}>
                                    <td class="text-center">
                                      <input
                                        type="checkbox"
                                        className="fs-8"
                                        id={data.KDUserL}
                                        checked={ck}
                                        onChange={handleCheck}
                                      ></input>
                                    </td>
                                    <td>{data.KDUserL}</td>
                                    <td>{data.NMUserL}</td>
                                    <td>{data.DepartementDescL}</td>
                                    <td>{data.SectionDescL}</td>
                                    <td>{data.UnitDescL}</td>
                                    <td class="text-center">{data.GolonganL}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer className={`p-1 ps-3 bg-light`}>
                    <Button variant="success" size="sm" className="me-2" onClick={SavelstUB}>
                      Save
                    </Button>
                    <Button variant="secondary" size="sm" onClick={hidelstUserUB}>
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>

                <Modal
                  show={showDtlKar}
                  onHide={hideDtlKar}
                  backdrop="static"
                  keyboard={false}
                  size="lg"
                >
                  <Modal.Header
                    className="p-0 ps-3 pe-3 bg-primary"
                    closeVariant='white' closeButton
                  >
                    <Modal.Title className="text-white">Detail Karyawan</Modal.Title>
                  </Modal.Header>
                  <Modal.Body className="ps-3 pt-0 rounded-bottom">
                    <div className="d-flex flex-column gap-2 w-100">
                      <div className="w-100">
                        <IsiTxt
                          label="NIK Karyawan"
                          css="d-flex w-100"
                          disabled={true}
                          val={NIKUB}
                        />
                      </div>
                      <div className="w-100">
                        <IsiTxt
                          label="Nama Karyawan"
                          css="d-flex w-100"
                          disabled={true}
                          val={NmKarUB}
                        />
                      </div>
                      <div className="w-100">
                        <IsiTxt
                          label="Departemen"
                          css="d-flex w-100"
                          disabled={true}
                          val={DepUB}
                        />
                      </div>
                      <div className="w-100">
                        <IsiTxt
                          label="Seksi"
                          css="d-flex w-100"
                          disabled={true}
                          val={SecUB}
                        />
                      </div>
                      <div className="w-100">
                        <IsiTxt
                          label="Unit"
                          css="d-flex w-100"
                          disabled={true}
                          val={UntUB}
                        />
                      </div>
                      <div className="w-100">
                        <IsiTxt
                          label="Golongan"
                          css="d-flex w-100"
                          disabled={true}
                          val={GolUB}
                        />
                      </div>
                      <div className="w-100">
                        <IsiTxt
                          label="User ID"
                          css="d-flex w-100"
                          disabled={false}
                          val={UserIDUB}
                          onchange={e => {
                            setUserIDUB(e.target.value.toLowerCase());
                            let Vld = { ...Valid };
                            if (e.target.value == '') {
                              Vld = {
                                ...Vld,
                                UserIDUB: [false, 'User ID harus diisi!'],
                                error: true
                              };
                            } else {
                              Vld = {
                                ...Vld,
                                UserIDUB: [true, ''],
                                error: false
                              };
                            }
                            setValid(Vld);
                          }}
                          isinvalid={Valid.UserIDUB}
                        />
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer className={`p-1 ps-3 bg-light`}>
                    <Button variant="success" size="sm" className="me-2"
                      onClick={() => {
                        setValid(defaultValidation);
                        let Vld = { ...defaultValidation };
                        if (
                          UserIDUB == '' ||
                          UserIDUB == null
                        ) {
                          Vld = {
                            ...Vld,
                            UserIDUB: [false, 'User ID harus diisi!'],
                            Err: true
                          };
                        }
                        setValid(Vld);
                        if (!Vld.Err) cekUSIDEXIUB(UserIDUB);
                      }}>
                      Save
                    </Button>
                    <Button variant="secondary" size="sm" onClick={hideDtlKar}>
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>

                <Modal
                  show={showremarkS}
                  onHide={hideremarkS}
                  backdrop="static"
                  keyboard={false}
                  size="lg"
                >
                  <Modal.Header
                    className="p-0 ps-3 pe-3 bg-primary"
                    closeVariant='white' closeButton
                  >
                    <Modal.Title className="text-white">Remark Disapprove</Modal.Title>
                  </Modal.Header>
                  <Modal.Body className="ps-3 pt-0 rounded-bottom">
                    <div className="pt-2">
                      <div className="row g-1">
                        <div className="col-12">
                          <IsiTxt
                            id="RemarkReject"
                            key={'RemarkReject'}
                            label={'Remark'}
                            row={5}
                            maxlength={200}
                            val={Obj.RemarkReject}
                            css={'ps-1 pe-1'}
                            onchange={txtOnchange}
                            isinvalid={Valid.RemarkRej}
                          ></IsiTxt>
                        </div>
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer className={`p-1 ps-3 bg-light`}>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => {
                        setValid(defaultValidation);
                        let Vld = { ...defaultValidation };
                        if (
                          Obj.RemarkReject == '' ||
                          Obj.RemarkReject == null
                        ) {
                          Vld = {
                            ...Vld,
                            RemarkRej: [false, 'Remark harus diisi!'],
                            Err: true
                          };
                        }
                        setValid(Vld);
                        if (!Vld.Err) ConfITOAApproval('S'); //jika user create = user login maka disapprove
                      }}
                      Y
                    >
                      Confirm
                    </Button>
                    <Button variant="secondary" size="sm" onClick={hideremarkS}>
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>
                <Modal
                  show={showremarkJ}
                  onHide={hideremarkJ}
                  backdrop="static"
                  keyboard={false}
                  size="lg"
                >
                  <Modal.Header
                    className="p-0 ps-3 pe-3 bg-primary"
                    closeVariant='white' closeButton
                  >
                    <Modal.Title className="text-white">Remark Reject</Modal.Title>
                  </Modal.Header>
                  <Modal.Body className="ps-3 pt-0 rounded-bottom">
                    <div className="pt-2">
                      <div className="row g-1">
                        <div className="col-12">
                          <IsiTxt
                            id="RemarkReject"
                            key={'RemarkReject'}
                            label={'Remark'}
                            row={5}
                            maxlength={200}
                            val={Obj.RemarkReject}
                            css={'ps-1 pe-1'}
                            onchange={txtOnchange}
                            isinvalid={Valid.RemarkRej}
                          ></IsiTxt>
                        </div>
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer className={`p-1 ps-3 bg-light`}>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => {
                        setValid(defaultValidation);
                        let Vld = { ...defaultValidation };
                        if (
                          Obj.RemarkReject == '' ||
                          Obj.RemarkReject == null
                        ) {
                          Vld = {
                            ...Vld,
                            RemarkRej: [false, 'Remark harus diisi!'],
                            Err: true
                          };
                        }
                        setValid(Vld);
                        if (!Vld.Err) ConfITOAApproval('J'); //jika user create = user login maka disapprove
                      }}
                      Y
                    >
                      Confirm
                    </Button>
                    <Button variant="secondary" size="sm" onClick={hideremarkJ}>
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>
            </div>
          </div>
        </Col>
      </Row >
    </>
  );
};
export default mst061_formITOAEntry;

