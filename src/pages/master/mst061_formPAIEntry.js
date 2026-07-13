import React, { useState, useEffect, useRef } from 'react';
import { Button, Row, Col, Nav, Alert, Form } from 'react-bootstrap';
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
import cloudUpload from 'assets/img/icons/cloud-upload.svg';
import Flex from 'components/common/Flex';
import IsiAttach from 'components/form/IsiAttach';

const mst061_formPAIEntry = () => {
  const CheckDev = useIsMobile();
  const navigate = useNavigate();
  const URL = process.env.REACT_APP_URL_API;
  const link = `${URL}api/mst061_FormPAI`;
  const lgdata = JSON.parse(localStorage.getItem('userData'));
  const isrunn = useRef(false);
  const txtKeteranganAsset = useRef(null);
  const fileInputRef = useRef();
  const [SearchParams, setSearchParams] = useSearchParams();
  const [SeqAssetDetail, setSeqAssetDetail] = useState('');
  const [Keterangan, setKeterangan] = useState('');
  const [KeteranganAsset, setKeteranganAsset] = useState('');
  const [QtyAsset, setQtyAsset] = useState('');
  const [JustifikasiAsset, setJustifikasiAsset] = useState('');
  const [Obj, setObj] = useState({
    FormPAIDetailList: [],
    LsAtt: []
  });
  const [lsFPAIAprv, setlsFPAIAprv] = useState([]);
  const [lsAttach, setlsAttach] = useState([]);
  const defaultValidation = {
    BudgetA: [true, ''],
    KeteranganA: [true, ''],
    KeteranganAsset: [true, ''],
    QtyAsset: [true, ''],
    JustifikasiAsset: [true, ''],
    RemarkRej: [true, ''],
    error: false
  };
  const [Valid, setValid] = useState(defaultValidation);
  const [showremarkS, setshowremarkS] = useState(false);
  const hideremarkS = () => setshowremarkS(false);
  const [showremarkJ, setshowremarkJ] = useState(false);
  const hideremarkJ = () => setshowremarkJ(false);
  const [DataBudget, setDataBudget] = useState([
    { Value: 'Y', Text: 'Budget' },
    { Value: 'N', Text: 'Non Budget' }
  ]);

  const { state: params } = useLocation();

  let { height } = useBreakpoints();
  let { key, act } = useParams();
  let ddelete = {};
  let htabo = height;
  let hcb = height - 245;
  let PActionB = '';

  if (act == 'A' || act == 'VA') {
    PActionB = 'A';
    htabo = htabo - 120;
    hcb = hcb - 120;
  } else if (act == 'S' || act == 'VS') {
    PActionB = 'S';
    htabo = htabo - 120;
    hcb = hcb - 120;
  } else {
    if (lsFPAIAprv.length != 0) {
      if (Obj.Status == 'U') {
        htabo = htabo - 120;
        hcb = hcb - 120;
      } else if (Obj.Status == 'S' || Obj.Status == 'J') {
        htabo = htabo - 170;
        hcb = hcb - 170;
      }
    }
    PActionB = 'N';
  }

  if (
    KeteranganAsset.split('\n').length > JustifikasiAsset.split('\n').length
  ) {
    hcb = hcb + KeteranganAsset.split('\n').length * 20;
  } else {
    hcb = hcb + JustifikasiAsset.split('\n').length * 20;
  }

  useEffect(() => {
    if (isrunn.current === false) {
      GetFPAI();
      return () => {
        isrunn.current = true;
      };
    }
  }, [key, act]);

  const txtOnchange = e => {
    let b = { ...Obj };
    b[e.target.id] = e.target.value;
    setObj(b);
  };
  //End LR Event

  const GetFPAI = async () => {
    let PIP = '';
    if (act == 'N' || act == 'E') {
      PIP = lgdata.IP;
    }

    try {
      var param = '?IP=' + PIP + '&docno=' + key + '&pact=' + act;

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
          setObj(response.data);
          if (response.data.Keterangan) {
            setKeteranganCurrent(response.data.Keterangan.split('[]'));
          }
          if (response.data.AprvList) {
            setlsFPAIAprv(response.data.AprvList);
          }
          // if (act == 'E') {
          //   collectFilesTemp(response.data.DocumentNumber);
          // } else {
          //   collectFiles(response.data.DocumentNumber);
          // }
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
          ISI.PopAlertFalcon('error', 'error', err.message, '');
        });
    } catch (err) {
      ISI.PopAlertFalcon('error', 'error', err, '');
    }
  };

  const FPAICancel = async () => {
    try {
      var obj = { ...Obj };
      obj.CreatedBy = lgdata.UserId;
      obj.CreatedIP = lgdata.IP;
      obj.ProsesId = 'CancelFPAI';

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
          `/master/mst061_formPAIList/${PActionB}?param=${SearchParams.get(
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
      ISI.PopAlertFalcon('error', 'error', error.response.message, '');
    }
  };

  const FPAISave = async () => {
    try {
      var obj = { ...Obj };
      obj.Ket1 = '';
      obj.CreatedBy = lgdata.UserId;
      obj.CreatedIP = lgdata.IP;
      obj.DepUserLogin = lgdata.KdDept;
      obj.ProsesId = 'SaveFPAI';

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
          `/master/mst061_formPAIList/${PActionB}?param=${SearchParams.get(
            'param'
          )}`,
          {
            state: {
              mode: params?.mode
            }
          }
        );
        PrintPdf();
      }
    } catch (error) {
      ISI.PopAlertFalcon('error', 'error', error.response.message, '');
    }
  };

  const FPAIApproval = async pact => {
    try {
      let obj = { ...Obj };
      obj.UpdatedBy = lgdata.UserId;
      obj.UpdatedIP = lgdata.IP;
      obj.Keterangan = Keterangan;
      obj.NIKLogin = lgdata.NIK;
      obj.ProsesId =
        pact == 'A' ? 'AppFPAI' : pact == 'J' ? 'RejFPAI' : 'DisAppFPAI';
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
          if (response.data.Ket1) {
            ISI.PopAlertFalcon('error', 'error', response.data.Ket1, '');
          } else {
            navigate(
              `/master/mst061_formPAIList/${PActionB}?param=${SearchParams.get(
                'param'
              )}`
            );
          }
        })
        .catch(err => {
          ISI.PopAlertFalcon('error', 'error', err.message, '');
        });
    } catch (err) {
      ISI.PopAlertFalcon('error', 'error', err, '');
    }
  };

  const PrintPdf = async () => {
    try {
      let obj = { ...Obj };
      obj.UpdatedBy = lgdata.UserId;
      obj.UpdatedIP = lgdata.IP;

      let temp = await axios({
        url: `${link}/PrintPdf`,
        method: 'POST',
        data: obj,
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

  const FormPAIInsertTempDetail = async () => {
    try {
      var obj = { ...Obj };
      obj.CreatedIPB = lgdata.IP;
      obj.ProsesId = 'PostDetail';
      obj.CreatedByB = lgdata.UserId;
      obj.KeteranganAssetB = KeteranganAsset;
      obj.QtyAssetB = QtyAsset;
      obj.JustifikasiAssetB = JustifikasiAsset;
      obj.NoUrutB = '';

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
        setObj(res);
        txtKeteranganAsset.current.focus();
      }
    } catch (error) {
      ISI.PopAlertFalcon('error', 'error', error.response.message, '');
    }
  };

  const FormPAIEditTempDetail = async () => {
    try {
      var obj = { ...Obj };
      obj.ProsesId = 'PostDetail';
      obj.CreatedByB = lgdata.UserId;
      obj.CreatedIPB = lgdata.IP;
      obj.KeteranganAssetB = KeteranganAsset;
      obj.QtyAssetB = QtyAsset;
      obj.JustifikasiAssetB = JustifikasiAsset;
      obj.NoUrutB = SeqAssetDetail;

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
        setObj(res);
        txtKeteranganAsset.current.focus();
      }
    } catch (error) {
      ISI.PopAlertFalcon('error', 'error', error.response.message, '');
    }
  };

  const FormPAIDeleteTempDetail = async seq => {
    var delData = Obj.FormPAIDetailList.find(c => c.NoUrutB == seq);

    try {
      var obj = { ...Obj };
      obj.ProsesId = 'DelDetail';
      obj.CreatedByB = lgdata.UserId;
      obj.CreatedIPB = lgdata.IP;
      obj.NoUrutB = seq;
      obj.DocumentNumber = delData.DocumentNumberB;

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
        ISI.PopAlertFalcon('Warning', 'Warning', res.ErrMsg);
      } else {
        setObj(res);
      }
    } catch (error) {
      ISI.PopAlertFalcon('error', 'error', error.response.message, '');
    }
  };

  const FormPAIUpdTempA = async bdgt => {
    try {
      var obj = { ...Obj };
      obj.ProsesId = 'UpdTempA';
      obj.UpdatedBy = lgdata.UserId;
      obj.UpdatedIP = lgdata.IP;
      obj.Budget = bdgt;

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
        ISI.PopAlertFalcon('Warning', 'Warning', res.ErrMsg);
      }
    } catch (error) {
      ISI.PopAlertFalcon('error', 'error', error.response.message, '');
    }
  };

  const onShowTempDetail = upData => {
    if (upData) {
      setSeqAssetDetail(upData.NoUrutB);
      setKeteranganAsset(upData.KeteranganAssetB);
      setQtyAsset(upData.QtyAssetB);
      setJustifikasiAsset(upData.JustifikasiAssetB);
    } else {
      setSeqAssetDetail('');
      setKeteranganAsset('');
      setQtyAsset('');
      setJustifikasiAsset('');
    }
  };

  const mappingHeader = [
    [
      { text: 'Action', width: '10%' },
      {
        text: 'Keterangan Barang (Termasuk Software berlisensi)',
        width: '40%'
      },
      { text: 'Qty', width: '10%' },
      { text: 'Justifikasi', width: '20%' }
    ]
  ];

  let mappingTable = [
    {
      title: '',
      propName: 'Action',
      isNumber: false,
      isAction: true,
      actcode: act != 'E' ? '' : 'D,E',
      idEdit: 'NoUrutB',
      class: 'text-center',
      col: '12'
    },
    { propName: 'KeteranganAssetB' },
    { propName: 'QtyAssetB', class: 'text-center' },
    { propName: 'JustifikasiAssetB' }
  ];

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
    var upData = Obj.FormPAIDetailList.find(c => c.NoUrutB == key);
    if (pact === 'BtnEditG') {
      onShowTempDetail(upData);
    } else if (pact === 'BtnDelG') {
      ISI.confirmISI({
        title: 'Konfirmasi',
        msg: `Hapus Barang ${upData.KeteranganAssetB} ?`,
        yesText: 'Yes',
        yesAction: () => FormPAIDeleteTempDetail(key),
        noText: 'No',
        noAction: () => { }
      });
    }
  };

  const ConfSubmitDetail = () => {
    // if (checkValidation()) {
    //   return;
    // }
    // ISI.confirmISI({
    //   title: 'Konfirmasi',
    //   msg: 'Simpan data ?',
    //   yesText: 'Yes',
    //   yesAction: () => {
    if (SeqAssetDetail == '') {
      FormPAIInsertTempDetail(); //true
    } else {
      FormPAIEditTempDetail(); //false
    }
    onShowTempDetail(null);
    //   },
    //   noText: 'No',
    //   noAction: () => { }
    // });
  };

  const checkValidation = () => {
    const vld = { ...defaultValidation };
    vld.error = false;

    if (!KeteranganAsset) {
      vld.KeteranganAsset = [false, 'Keterangan Asset harus diisi'];
      vld.error = true;
    } else {
      vld.KeteranganAsset = [true, ''];
    }
    if (!QtyAsset) {
      vld.QtyAsset = [false, 'Qty Asset harus diisi'];
      vld.error = true;
    } else if (isNaN(+QtyAsset)) {
      vld.QtyAsset = [false, 'Qty Asset harus diisi dengan angka'];
      vld.error = true;
    } else if (QtyAsset < 1) {
      vld.QtyAsset = [false, 'Qty Asset harus diisi minimal 1'];
      vld.error = true;
    } else {
      vld.QtyAsset = [true, ''];
    }

    if (!JustifikasiAsset) {
      vld.JustifikasiAsset = [false, 'Justifikasi Asset harus diisi'];
      vld.error = true;
    } else {
      vld.JustifikasiAsset = [true, ''];
    }

    setValid({ ...vld });

    return vld.error;
  };

  const ConfFPAICancel = async () => {
    if (params?.mode == 'ST') PActionB = 'ST';
    if (act != 'E') {
      navigate(
        `/master/mst061_formPAIList/${PActionB}?param=${SearchParams.get(
          'param'
        )}`
      );
    } else {
      ISI.confirmISI({
        title: 'Konfirmasi',
        msg: 'Cancel Permintaan Asset IT ?',
        yesText: 'Yes',
        yesAction: () => {
          FPAICancel();
        },
        noText: 'No',
        noAction: () => { }
      });
    }
  };

  const ConfFPAIApproval = async pact => {
    setValid(defaultValidation);
    let Vld = { ...defaultValidation };
    if (
      (Keterangan == '' || Keterangan == undefined) &&
      act == 'A' &&
      lgdata.KdDept == 'IT' &&
      pact == 'A'
    ) {
      Vld = {
        ...Vld,
        KeteranganA: [false, 'Keterangan harus diisi'],
        error: true
      };
    }
    setValid(Vld);
    if (!Vld.error) {
      ISI.confirmISI({
        title: 'Konfirmasi',
        msg: `Are you sure want to ${pact == 'A' ? 'Approve' : pact == 'J' ? 'Reject' : 'Disapprove'
          } this data?`,
        yesText: 'Yes',
        yesAction: () => {
          FPAIApproval(pact);
        },
        noText: 'No',
        noAction: () => { }
      });
    }
  };

  const SaveFPAI = async () => {
    try {
      setValid(defaultValidation);
      let Vld = { ...defaultValidation };
      if (Obj.Budget == '') {
        Vld = {
          ...Vld,
          BudgetA: [false, 'Budget harus dipilih'],
          error: true
        };
      }
      setValid(Vld);
      if (Obj.FormPAIDetailList.length == 0) {
        ISI.PopAlertFalcon(
          'Warning',
          'Warning',
          'Mohon isi setidaknya satu asset',
          ''
        );
      } else {
        if (!Vld.error) {
          ISI.confirmISI({
            title: 'Konfirmasi',
            msg: `Simpan Form Permintaan Asset IT Nomor ${Obj.DocumentNumber} ?`,
            yesText: 'Yes',
            yesAction: () => {
              FPAISave();
            },
            noText: 'No',
            noAction: () => { }
          });
        }
      }
    } catch (err) {
      ISI.PopAlertFalcon('error', 'error', err.Message, '');
    }
  };


  const FileITARUpload = async event => {
    //const isValid = await checkValidation();
    //if (!isValid) {
    const file = event.target.files[0];
    //alert(file.type);
    if (file.size > 10000000)
      ISI.PopAlertFalcon('error', 'error', 'Max Size File Upload 10mb', '');
    // else if (file.type != 'application/pdf') {
    //   ISI.PopAlertFalcon('error', 'error', 'Upload hanya boleh file pdf', '');
    // }
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
          ISI.PopAlertFalcon('Warning', 'Warning', temp.data.Msg, '');
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
        title: 'Form Permintaan Asset IT',
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

  return (
    <>
      <Row className="g-0">
        <Col>
          <div className="card">
            <div className="card-header bg-light ps-1 pe-1 pt-2 pb-2">
              <div className="row ">
                <div className="col pt-1">
                  <h5 id="LblHdr" className="mb-0">
                    Form Permintaan Asset IT
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
                        ConfFPAICancel();
                      }}
                    ></BtnMenu>
                  </Nav>
                </div>
              </div>
            </div>
            <div className="card-body p-1">
              <div className="row g-1">
                <div className="col-12 col-lg-6 px-x1">
                  <div className="row g-1 d-flex">
                    <div className="col-12 col-md-5">
                      <IsiTxt
                        label={'Nomor Document'}
                        val={Obj.DocumentNumber}
                        onchange={txtOnchange}
                        maxLength={300}
                        readonly={true}
                      ></IsiTxt>
                    </div>
                    <div className="col-12 col-md-7">
                      <IsiTxt
                        label={'Departemen'}
                        val={Obj.DepartementDesc}
                        onchange={txtOnchange}
                        maxLength={300}
                        readonly={true}
                      ></IsiTxt>
                    </div>
                  </div>
                  <div className="row g-1 d-flex">
                    <div className="col-12 col-md-5">
                      <IsiTxt
                        label={'Tanggal'}
                        val={Obj.StrTgl}
                        onchange={txtOnchange}
                        maxLength={300}
                        readonly={true}
                      ></IsiTxt>
                    </div>
                    <div className="col-12 col-md-7">
                      <IsiTxt
                        id={'Budget'}
                        label={'Budget'}
                        typ="select"
                        obj={DataBudget}
                        val={Obj.Budget}
                        onchange={e => {
                          txtOnchange(e);
                          FormPAIUpdTempA(e.target.value);
                        }}
                        name={'Budget'}
                        disabled={act != 'E'}
                        isinvalid={Valid.BudgetA}
                      ></IsiTxt>
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
                          <h5 className="mb-0 fs--2">List Asset IT</h5>
                        </div>
                      </div>
                    </div>

                    <div className="card-body p-0">
                      <div className="pt-0 pt-2 px-x1 ask-analytics">

                        <div className="row g-1">
                          <div
                            className="col-sm-12 col-lg-8"
                            style={{ height: htabo - 345 }}
                          >
                            {!CheckDev.isMobile ? (
                              <GridTable
                                datas={
                                  Obj.FormPAIDetailList
                                    ? Obj.FormPAIDetailList
                                    : []
                                }
                                clsname="dvListDtl mt-1"
                                maping={mappingTable}
                                headers={mappingHeader}
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
                                {Obj.FormPAIDetailList.map(cl => {
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
                                                    <span className="text-secondary pe-1">
                                                      Keterangan Barang :
                                                    </span>
                                                    {`${cl.KeteranganAssetB}`}
                                                    <br />
                                                    <span className="text-secondary pe-1">
                                                      Qty :
                                                    </span>
                                                    {`${cl.QtyAssetB}`}
                                                    <br />
                                                    <span className="text-secondary pe-1">
                                                      Justifikasi :
                                                    </span>
                                                    {`${cl.JustifikasiAssetB}`}
                                                    <br />
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
                                                      'BtnDelG|' + cl.NoUrutB
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
                                                      'BtnEditG|' + cl.NoUrutB
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
                            {act != 'E' ? (
                              ''
                            ) : (
                              <table className="GridItem">
                                <tr>
                                  <td width={'10%'} className="text-center">
                                    <div className="row g-2 justify-content-center">
                                      <div className="col-auto">
                                        <button
                                          type="button"
                                          key={`save`}
                                          id={'BtnSave'}
                                          className="btn btn-link btn-sm p-0 text-success"
                                          onClick={ConfSubmitDetail}
                                          title={'Add Data'}
                                        >
                                          <FontAwesomeIcon
                                            icon={faSave}
                                            className={`fs-7`}
                                          />
                                        </button>
                                      </div>
                                      {SeqAssetDetail != '' && (
                                        <div className="col-auto">
                                          <button
                                            type="button"
                                            key={`cancel`}
                                            id={'BtnSave'}
                                            className="btn btn-link btn-sm p-0 text-danger"
                                            onClick={e => {
                                              onShowTempDetail(null);
                                            }}
                                            title={'Cancel'}
                                          >
                                            <FontAwesomeIcon
                                              icon={faTimes}
                                              className={`fs-7`}
                                            />
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                  <td className="pb-0" width={'40%'}>
                                    <IsiTxt
                                      css="d-flex w-100"
                                      row={
                                        KeteranganAsset
                                          ? KeteranganAsset.split('\n').length
                                          : 1
                                      }
                                      val={KeteranganAsset}
                                      rf={txtKeteranganAsset}
                                      onchange={e =>
                                        setKeteranganAsset(e.target.value)
                                      }
                                      isinvalid={Valid.KeteranganAsset}
                                      style={{ resize: 'none' }}
                                    ></IsiTxt>
                                  </td>
                                  <td className="pb-0" width={'10%'}>
                                    <IsiTxt
                                      css="d-flex w-100"
                                      val={QtyAsset}
                                      onchange={e =>
                                        setQtyAsset(e.target.value)
                                      }
                                      isinvalid={Valid.QtyAsset}
                                      isnumber={true}
                                    />
                                  </td>
                                  <td className="pb-0" width={'20%'}>
                                    <IsiTxt
                                      css="d-flex w-100"
                                      row={
                                        JustifikasiAsset
                                          ? JustifikasiAsset.split('\n').length
                                          : 1
                                      }
                                      val={JustifikasiAsset}
                                      onchange={e =>
                                        setJustifikasiAsset(e.target.value)
                                      }
                                      isinvalid={Valid.JustifikasiAsset}
                                      style={{ resize: 'none' }}
                                    />
                                  </td>
                                </tr>
                              </table>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`card mt-3 ms-3 me-3 ${KeteranganCurrent.length < 2 &&
                      !(act == 'A' && lgdata.KdDept == 'IT')
                      ? 'd-none'
                      : ''
                      }`}
                  >
                    <div className="card-header border-bottom border-200 ps-1 pe-1 pt-1 pb-1 bg-body-tertiary">
                      <div className="row ">
                        <div className="col pt-1">
                          <h5 className="mb-0 fs--2">
                            Keterangan (Diisi oleh IT)
                          </h5>
                        </div>
                      </div>
                    </div>

                    <div className="card-body p-0">
                      <div className="py-3 px-x1 ask-analytics">
                        <div className="row g-1">
                          <div className="col-sm-12 col-lg-8">
                            <SimpleBar style={{ maxHeight: 300 }}>
                              <div
                                className={`d-flex py-2 border-top border-200 ${!(act == 'A' && lgdata.KdDept == 'IT')
                                  ? 'd-none'
                                  : ''
                                  }`}
                              >
                                <div className="avatar avatar-l ">
                                  <img
                                    className="rounded-circle "
                                    src={`https://m.indopoly.co.id/imagesrv/ilc/images/${lgdata.NIK}.jpg?666`}
                                    alt=""
                                  />
                                </div>
                                <IsiTxt
                                  id={'Keterangan'}
                                  key={'Keterangan'}
                                  group="flex-grow-1 me-2"
                                  placeholder="Keterangan"
                                  row={
                                    Keterangan
                                      ? Keterangan.split('\n').length
                                      : 1
                                  }
                                  val={Keterangan}
                                  css="ms-3 fs-10"
                                  onchange={e => {
                                    setKeterangan(e.target.value);
                                  }}
                                  readonly={
                                    !(act == 'A' && lgdata.KdDept == 'IT')
                                  }
                                  isinvalid={Valid.KeteranganA}
                                  style={{ resize: 'none', width: '80%' }}
                                ></IsiTxt>
                              </div>
                              {KeteranganCurrent.map(a => {
                                if (a) {
                                  let ar = a.split('|');

                                  return (
                                    <>
                                      <div className="d-flex align-items-center mt-2 ">
                                        <a href="#">
                                          <div className="avatar avatar-l ">
                                            <img
                                              className="rounded-circle "
                                              src={`https://m.indopoly.co.id/imagesrv/ilc/images/${ar[1]}.jpg?666`}
                                              alt=""
                                            />
                                          </div>
                                        </a>
                                        <div className="ms-2 fs-10">
                                          <div
                                            className="mb-1 bg-200 rounded-3 p-2"
                                            style={{ whiteSpace: 'pre-line' }}
                                          >
                                            <a className="fw-semibold" href="#">
                                              {ar[0]} :{' '}
                                            </a>
                                            {ar[2]}
                                          </div>
                                          <div className="px-2">{ar[3]}</div>
                                        </div>
                                      </div>
                                    </>
                                  );
                                }
                              })}
                            </SimpleBar>
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
                  {lsFPAIAprv.length != 0 ? (
                    <div className="mt-3">
                      <IsiTimeline
                        Show={lsFPAIAprv.length != 0}
                        Data={lsFPAIAprv}
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
                        onClick={SaveFPAI}
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
                            ConfFPAIApproval('A');
                          }}
                        >
                          Approve
                        </Button>
                      </>
                    ) : (
                      ''
                    )}
                    {lsFPAIAprv.length != 0 ? (
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
                    )}
                    <Button
                      variant="secondary"
                      size="sm"
                      className="me-2"
                      onClick={e => {
                        //Delete Temp
                        ConfFPAICancel();
                      }}
                    >
                      {act != 'E' ? 'Close' : 'Cancel'}
                    </Button>
                  </Nav>
                </div>
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
                        if (!Vld.Err) ConfFPAIApproval('S'); //jika user create = user login maka disapprove
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
                        if (!Vld.Err) ConfFPAIApproval('J'); //jika user create = user login maka disapprove
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


      {showimg && (
        <Lightbox
          mainSrc={imageshow}
          onCloseRequest={() => setshowimg(false)}
          reactModalStyle={{ overlay: { zIndex: 999999 } }}
          onImageLoad={() => {
            window.dispatchEvent(new Event('resize'));
          }}
        />
      )}
    </>
  );
};
export default mst061_formPAIEntry;

