import React, { useState, useEffect, useRef } from 'react';
import { Button, Row, Col, Nav, Alert, Form } from 'react-bootstrap';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import * as ISI from 'script/ISI.js?20241219-02';
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import GridTable from 'components/form/GridTable';
import { faSignOutAlt, faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';
import BtnMenu from 'components/navbar/headermenu/BtnMenu';
import IsiTxt from 'components/form/IsiTxt';
import IsiTimeline from 'components/form/IsiTimeline';
import useIsMobile from 'hooks/useIsMobile';
import { useBreakpoints } from 'hooks/useBreakpoints';
import IsiTabs from 'components/form/IsiTabs';
import IsiTreeview from 'components/form/IsiTreeview';
import IsiCheck from 'components/form/IsiCheck';

const mst061_formITOAEntryDetail = () => {
  const CheckDev = useIsMobile();
  const navigate = useNavigate();
  const URL = process.env.REACT_APP_URL_API;
  const link = `${URL}api/mst061_FormITOA`;
  const lgdata = JSON.parse(localStorage.getItem('userData'));
  const isrunn = useRef(false);
  const txtKeteranganAsset = useRef(null);
  const [SearchParams, setSearchParams] = useSearchParams();
  const [Obj, setObj] = useState({
    SAMDetailList: [],
    StdAcsMenuDetailListb: []
  });
  const [fUNLstUsr, setfUNLstUsr] = useState('');
  const [fDepLstUsr, setfDepLstUsr] = useState('');
  const [TabActiveScroll, setTabActiveScroll] = useState('Tab1');
  const [lsmdlusre, setlsmdlusre] = useState([]);
  const [lsmdlusr, setlsmdlusr] = useState([]);
  const [lsdepartement, setlsdepartement] = useState([]);
  const [lssection, setlssection] = useState([]);
  const [lsSAMAprv, setlsSAMAprv] = useState([]);
  const [lsMenuDetail, setlsMenuDetail] = useState([]);
  const [lsMenuDetailb, setlsMenuDetailb] = useState([]);
  const [lsMenuDetailc, setlsMenuDetailc] = useState([]);
  const [lsMenuDetailEB, setlsMenuDetailEB] = useState([]);
  const [lsMenuDetailEF, setlsMenuDetailEF] = useState([]);
  const [selectedItemsE, setselectedItemsE] = useState([]);
  const [selectedItemsEE, setselectedItemsEE] = useState([]);
  const [lsMenuDetailMB, setlsMenuDetailMB] = useState([]);
  const [lsMenuDetailMF, setlsMenuDetailMF] = useState([]);
  const [selectedItemsM, setselectedItemsM] = useState([]);
  const [selectedItemsME, setselectedItemsME] = useState([]);
  const [lsMenuDetailWB, setlsMenuDetailWB] = useState([]);
  const [lsMenuDetailWF, setlsMenuDetailWF] = useState([]);
  const [selectedItemsW, setselectedItemsW] = useState([]);
  const [selectedItemsWE, setselectedItemsWE] = useState([]);
  const [lsMenuDetailAB, setlsMenuDetailAB] = useState([]);
  const [lsMenuDetailAF, setlsMenuDetailAF] = useState([]);
  const [selectedItemsA, setselectedItemsA] = useState([]);
  const [selectedItemsAE, setselectedItemsAE] = useState([]);
  const [ddlGroupERP, setddlGroupERP] = useState([]);
  const [ddlTitleERP, setddlTitleERP] = useState([]);
  const [ddlMenuListERP, setddlMenuListERP] = useState([]);
  const [ddlMenuListItemERP, setddlMenuListItemERP] = useState([]);
  const [ddlGroupMobile, setddlGroupMobile] = useState([]);
  const [ddlMenuListMobile, setddlMenuListMobile] = useState([]);
  const [ddlGroupWHM, setddlGroupWHM] = useState([]);
  const [ddlMenuListWHM, setddlMenuListWHM] = useState([]);
  const [ddlGroupAPP, setddlGroupAPP] = useState([]);
  const [ddlTitleAPP, setddlTitleAPP] = useState([]);
  const [ddlMenuListAPP, setddlMenuListAPP] = useState([]);
  const [ddlMenuListItemAPP, setddlMenuListItemAPP] = useState([]);
  const [lsunit, setlsunit] = useState([]);
  const [selectedMNCP, setselectedMNCP] = useState([]);
  const defaultValidation = {
    DepartementA: [true, ''],
    SectionA: [true, ''],
    UnitA: [true, ''],
    GolonganA: [true, ''],
    error: false
  };
  const [Valid, setValid] = useState(defaultValidation);
  const [showremarkS, setshowremarkS] = useState(false);
  const hideremarkS = () => setshowremarkS(false);
  const [showremarkJ, setshowremarkJ] = useState(false);
  const hideremarkJ = () => setshowremarkJ(false);
  const [showlstUserCP, setshowlstUserCP] = useState(false);
  const hidelstUserCP = () => setshowlstUserCP(false);
  const showinglstUserCP = () => setshowlstUserCP(true);

  let { width, height, breakpoints } = useBreakpoints();
  let { key } = useParams();
  let { kdus } = useParams();
  let { act } = useParams();
  let hcb = height - 175;
  let PActionB = '';

  let cnewERP = 0;
  let cdelERP = 0;
  let cnewMobile = 0;
  let cdelMobile = 0;
  let cnewWHM = 0;
  let cdelWHM = 0;
  let cnewAPP = 0;
  let cdelAPP = 0;


  if (act.substring(0, 1) == 'V') { // VA, VS, VN
    PActionB = act.substring(0, 2);
  } else if (act.substring(0, 1) == 'S' || act.substring(0, 1) == 'A' || act.substring(0, 1) == 'E') {
    PActionB = act.substring(0, 1);
  } else {
    PActionB = 'VN';
  }

  useEffect(() => {
    if (isrunn.current === false) {
      GetITOADetail(kdus, act.substring(act.length - 3, act.length - 1));
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

  const GetITOADetail = async (usrid, typp) => {
    let PIP = (act.substring(0, 1) == 'E') ? lgdata.IP : '';
    let pact = (act.substring(0, 1) == 'E') ? act.substring(0, 1) : act;

    try {
      var param = '?IP=' + PIP + '&docno=' + key + '&pact=' + pact + '&usrid=' + usrid + '&typp=' + typp;
      let temp = await axios({
        url: `${link}/GetITOADetail` + param,
        method: 'GET',
        //data: obj,
        contentType: 'application/json; charset=utf-8',
        headers: {
          Keys: lgdata.UserTkn
        }
      })
        .then(response => {
          setObj(response.data);
          if (usrid == null) {
            usrid = response.data.UserIDB;
          }
          if (response.data != null) {
            getListMdlUsr(response.data.DepartementB);
          }
          if (response.data.FormITOAListSummary) {
            setlsMenuDetail(response.data.FormITOAListSummary);
            if (usrid != '') { //Untuk set tree Front
              if (key != '' && key != null) {
                //setlsMenuDetailb(response.data.FormITOAListSummary.filter(c => c.DocumentNumberC == key && (c.UserIDC == usrid)));
                setlsMenuDetailc(response.data.FormITOAListSummary.filter(c => c.DocumentNumberC != key && (c.UserIDC == usrid)));
              }
              SetTreeFront('ERP', response.data.FormITOAListSummary.filter(c => c.UserIDC != '' && (c.UserIDC == usrid) && c.TypeMenuC == 'ERP'));
              SetTreeFront('MOBILE', response.data.FormITOAListSummary.filter(c => c.UserIDC != '' && (c.UserIDC == usrid) && c.TypeMenuC == 'MOBILE'));
              SetTreeFront('WHM', response.data.FormITOAListSummary.filter(c => c.UserIDC != '' && (c.UserIDC == usrid) && c.TypeMenuC == 'WHM'));
              SetTreeFront('APP', response.data.FormITOAListSummary.filter(c => c.UserIDC != '' && (c.UserIDC == usrid) && c.TypeMenuC == 'APP'));
            }

            let lstMenuDetailE = [];
            const lsGrpE = response.data.FormITOAListSummary.sort((a, b) => (a.GroupDescC > b.GroupDescC) ? 1 : ((b.GroupDescC > a.GroupDescC) ? -1 : 0))
              .filter(c => c.TypeMenuC == 'ERP').filter((obj, index, self) =>
                index === self.findIndex((t) => t.GroupIDC === obj.GroupIDC && t.GroupDescC === obj.GroupDescC)
              );
            const lsTtlE = response.data.FormITOAListSummary.sort((a, b) => (a.TitleDescC > b.TitleDescC) ? 1 : ((b.TitleDescC > a.TitleDescC) ? -1 : 0))
              .filter(c => c.TypeMenuC == 'ERP').filter((obj, index, self) =>
                index === self.findIndex((t) => t.TitleIDC === obj.TitleIDC && t.GroupIDC === obj.GroupIDC)
              );
            const lsTabE = response.data.FormITOAListSummary.sort((a, b) => (a.MenuTabDescC > b.MenuTabDescC) ? 1 : ((b.MenuTabDescC > a.MenuTabDescC) ? -1 : 0))
              .filter(c => c.TypeMenuC == 'ERP').filter((obj, index, self) =>
                index === self.findIndex((t) => t.MenuTabIDC === obj.MenuTabIDC && t.TitleIDC === obj.TitleIDC)
              );
            const lsHdrE = response.data.FormITOAListSummary.sort((a, b) => (a.MenuHeaderDescC > b.MenuHeaderDescC) ? 1 : ((b.MenuHeaderDescC > a.MenuHeaderDescC) ? -1 : 0))
              .filter(c => c.TypeMenuC == 'ERP').filter((obj, index, self) =>
                index === self.findIndex((t) => t.MenuHeaderIDC === obj.MenuHeaderIDC && t.MenuTabIDC === obj.MenuTabIDC)
              );
            const lsDtlE = response.data.FormITOAListSummary.sort((a, b) => (a.DocumentNumberC < b.DocumentNumberC) ? 1 : ((b.DocumentNumberC < a.DocumentNumberC) ? -1 : 0))
              .sort((a, b) => (a.MenuDetailDescC > b.MenuDetailDescC) ? 1 : ((b.MenuDetailDescC > a.MenuDetailDescC) ? -1 : 0))
              .filter(c => c.TypeMenuC == 'ERP').filter((obj, index, self) =>
                index === self.findIndex((t) => t.MenuDetailIDC === obj.MenuDetailIDC && t.MenuHeaderIDC === obj.MenuHeaderIDC)
              );

            //console.log(lsDtlE.filter(c => c.MenuDetailIDC == '2848'));

            lsGrpE.forEach(elg => {
              let cekTtl = [];
              let bdTtlAS = [];
              let cnewTtlAS = 0;
              let cdelTtlAS = 0;
              lsTtlE.filter(x => x.GroupIDC == elg.GroupIDC).forEach(elt => {
                let cekTab = [];
                let bdTabAS = [];
                let cnewTabAS = 0;
                let cdelTabAS = 0;
                lsTabE.filter(x => x.TitleIDC == elt.TitleIDC).forEach(elta => {
                  let cekHdr = [];
                  let bdHdrAS = [];
                  let cnewHdrAS = 0;
                  let cdelHdrAS = 0;
                  lsHdrE.filter(x => x.MenuTabIDC == elta.MenuTabIDC).forEach(elh => {
                    let cekdtl = [];
                    let bddtlAS = [];
                    let cnewdtlAS = 0;
                    let cdeldtlAS = 0;
                    lsDtlE.filter(x => x.MenuHeaderIDC == elh.MenuHeaderIDC).forEach(eldtl => {
                      cekdtl.push({
                        id: 'dtl' + eldtl.MenuDetailIDC,
                        name: eldtl.MenuDetailDescC,
                        typemenu: 'dtl',
                        badge: [((eldtl.StatusActC == 'N') ? { type: 'primary', text: 'New' } : (eldtl.StatusActC == 'D') ? { type: 'danger', text: 'Deleted' } : {})],
                        style: { color: ((eldtl.StatusActC == 'N') ? '#3498db' : (eldtl.StatusActC == 'D') ? '#e74c3c' : '') },
                        del: ((eldtl.StatusActC == 'D') ? true : false)
                      });
                      if (eldtl.StatusActC == 'N') {
                        cnewERP = cnewERP++;
                        Obj.CountNewERP = cnewERP;
                        cnewTtlAS++;
                        cnewTabAS++;
                        cnewHdrAS++;
                        cnewdtlAS++;
                      } else if (eldtl.StatusActC == 'D') {
                        cdelERP = cdelERP++;
                        Obj.CountDelERP = cdelERP;
                        cdelTtlAS++;
                        cdelTabAS++;
                        cdelHdrAS++;
                        cdeldtlAS++;
                      }
                      // } else {
                      //   cekdtlAS.push({
                      //     id: 'dtl' + eldtl.MenuDetailIDC,
                      //     name: eldtl.MenuDetailDescC + ` (${eldtl.DocumentNumberB})`,
                      //     typemenu: 'dtl',
                      //   });
                      // }
                    });
                    if (cnewdtlAS > 0) {
                      bddtlAS.push({
                        type: 'primary',
                        text: cnewdtlAS + ' New'
                      });
                    }
                    if (cdeldtlAS > 0) {
                      bddtlAS.push({
                        type: 'danger',
                        text: cdeldtlAS + ' Deleted'
                      });
                    }
                    cekHdr.push({
                      id: 'hdr' + elh.MenuHeaderIDC,
                      name: elh.MenuHeaderDescC,
                      typemenu: 'hdr',
                      children: cekdtl,
                      badge: bddtlAS
                    });
                  });
                  if (cnewHdrAS > 0) {
                    bdHdrAS.push({
                      type: 'primary',
                      text: cnewHdrAS + ' New'
                    });
                  }
                  if (cdelHdrAS > 0) {
                    bdHdrAS.push({
                      type: 'danger',
                      text: cdelHdrAS + ' Deleted'
                    });
                  }
                  cekTab.push({
                    id: 'tab' + elta.MenuTabIDC,
                    name: elta.MenuTabDescC,
                    typemenu: 'tab',
                    children: cekHdr,
                    badge: bdHdrAS
                  });
                });
                if (cnewTabAS > 0) {
                  bdTabAS.push({
                    type: 'primary',
                    text: cnewTabAS + ' New'
                  });
                }
                if (cdelTabAS > 0) {
                  bdTabAS.push({
                    type: 'danger',
                    text: cdelTabAS + ' Deleted'
                  });
                }
                cekTtl.push({
                  id: 'ttl' + elt.TitleIDC,
                  name: elt.TitleDescC,
                  typemenu: 'ttl',
                  children: cekTab,
                  badge: bdTabAS
                });
              });
              if (cnewTtlAS > 0) {
                bdTtlAS.push({
                  type: 'primary',
                  text: cnewTtlAS + ' New'
                });
              }
              if (cdelTtlAS > 0) {
                bdTtlAS.push({
                  type: 'danger',
                  text: cdelTtlAS + ' Deleted'
                });
              }
              lstMenuDetailE.push({
                id: 'grp' + elg.GroupIDC,
                name: elg.GroupDescC,
                typemenu: 'grp',
                children: cekTtl,
                badge: bdTtlAS
              });
            });
            setlsMenuDetailEB(lstMenuDetailE);

            let lstMenuDetailM = [];
            const lsGrpM = response.data.FormITOAListSummary.sort((a, b) => (a.GroupDescC > b.GroupDescC) ? 1 : ((b.GroupDescC > a.GroupDescC) ? -1 : 0))
              .filter(c => c.TypeMenuC == 'MOBILE').filter((obj, index, self) =>
                index === self.findIndex((t) => t.GroupIDC === obj.GroupIDC && t.GroupDescC === obj.GroupDescC)
              );
            const lsHdrM = response.data.FormITOAListSummary.sort((a, b) => (a.MenuHeaderDescC > b.MenuHeaderDescC) ? 1 : ((b.MenuHeaderDescC > a.MenuHeaderDescC) ? -1 : 0))
              .filter(c => c.TypeMenuC == 'MOBILE').filter((obj, index, self) =>
                index === self.findIndex((t) => t.MenuHeaderIDC === obj.MenuHeaderIDC && t.MenuTabIDC === obj.MenuTabIDC)
              );
            const lsDtlM = response.data.FormITOAListSummary.sort((a, b) => (a.DocumentNumberC < b.DocumentNumberC) ? 1 : ((b.DocumentNumberC < a.DocumentNumberC) ? -1 : 0))
              .sort((a, b) => (a.MenuDetailDescC > b.MenuDetailDescC) ? 1 : ((b.MenuDetailDescC > a.MenuDetailDescC) ? -1 : 0))
              .filter(c => c.TypeMenuC == 'MOBILE').filter((obj, index, self) =>
                index === self.findIndex((t) => t.MenuDetailIDC === obj.MenuDetailIDC && t.MenuHeaderIDC === obj.MenuHeaderIDC)
              );

            lsGrpM.forEach(elg => {
              let cekHdr = [];
              let bdHdr = [];
              let cnewHdr = 0;
              let cdelHdr = 0;
              lsHdrM.filter(x => x.GroupIDC == elg.GroupIDC).forEach(elh => {
                let cekdtl = [];
                let bddtl = [];
                let cnewdtl = 0;
                let cdeldtl = 0;
                lsDtlM.filter(x => x.MenuHeaderIDC == elh.MenuHeaderIDC).forEach(eldtl => {
                  cekdtl.push({
                    id: 'dtl' + eldtl.MenuDetailIDC,
                    name: eldtl.MenuDetailDescC,
                    typemenu: 'dtl',
                    badge: [((eldtl.StatusActC == 'N') ? { type: 'primary', text: 'New' } : (eldtl.StatusActC == 'D') ? { type: 'danger', text: 'Deleted' } : {})],
                    style: { color: ((eldtl.StatusActC == 'N') ? '#3498db' : (eldtl.StatusActC == 'D') ? '#e74c3c' : '') },
                    del: ((eldtl.StatusActC == 'D') ? true : false)
                  });
                  if (eldtl.StatusActC == 'N') {
                    cnewMobile = cnewMobile++;
                    Obj.CountNewMobile = cnewMobile;
                    cnewHdr++;
                    cnewdtl++;
                  } else if (eldtl.StatusActC == 'D') {
                    cdelMobile = cdelMobile++;
                    Obj.CountDelMobile = cdelMobile;
                    cdelHdr++;
                    cdeldtl++;
                  }
                });
                if (cnewdtl > 0) {
                  bddtl.push({
                    type: 'primary',
                    text: cnewdtl + ' New'
                  });
                }
                if (cdeldtl > 0) {
                  bddtl.push({
                    type: 'danger',
                    text: cdeldtl + ' Deleted'
                  });
                }
                cekHdr.push({
                  id: 'hdr' + elh.MenuHeaderIDC,
                  name: elh.MenuHeaderDescC,
                  typemenu: 'hdr',
                  children: cekdtl,
                  badge: bddtl
                });
              });
              if (cnewHdr > 0) {
                bdHdr.push({
                  type: 'primary',
                  text: cnewHdr + ' New'
                });
              }
              if (cdelHdr > 0) {
                bdHdr.push({
                  type: 'danger',
                  text: cdelHdr + ' Deleted'
                });
              }
              lstMenuDetailM.push({
                id: 'grp' + elg.GroupIDC,
                name: elg.GroupDescC,
                typemenu: 'grp',
                children: cekHdr,
                badge: bdHdr
              });
            });
            setlsMenuDetailMB(lstMenuDetailM);

            let lstMenuDetailW = [];
            const lsGrpW = response.data.FormITOAListSummary.sort((a, b) => (a.GroupDescC > b.GroupDescC) ? 1 : ((b.GroupDescC > a.GroupDescC) ? -1 : 0))
              .filter(c => c.TypeMenuC == 'WHM').filter((obj, index, self) =>
                index === self.findIndex((t) => t.GroupIDC === obj.GroupIDC && t.GroupDescC === obj.GroupDescC)
              );
            const lsHdrW = response.data.FormITOAListSummary.sort((a, b) => (a.MenuHeaderDescC > b.MenuHeaderDescC) ? 1 : ((b.MenuHeaderDescC > a.MenuHeaderDescC) ? -1 : 0))
              .filter(c => c.TypeMenuC == 'WHM').filter((obj, index, self) =>
                index === self.findIndex((t) => t.MenuHeaderIDC === obj.MenuHeaderIDC && t.MenuTabIDC === obj.MenuTabIDC)
              );
            const lsDtlW = response.data.FormITOAListSummary.sort((a, b) => (a.MenuDetailDescC > b.MenuDetailDescC) ? 1 : ((b.MenuDetailDescC > a.MenuDetailDescC) ? -1 : 0))
              .filter(c => c.TypeMenuC == 'WHM').filter((obj, index, self) =>
                index === self.findIndex((t) => t.MenuDetailIDC === obj.MenuDetailIDC && t.MenuHeaderIDC === obj.MenuHeaderIDC)
              );

            lsGrpW.forEach(elg => {
              let cekHdr = [];
              let bdHdr = [];
              let cnewHdr = 0;
              let cdelHdr = 0;
              lsHdrW.filter(x => x.GroupIDC == elg.GroupIDC).forEach(elh => {
                let cekdtl = [];
                let bddtl = [];
                let cnewdtl = 0;
                let cdeldtl = 0;
                lsDtlW.filter(x => x.MenuHeaderIDC == elh.MenuHeaderIDC).forEach(eldtl => {
                  cekdtl.push({
                    id: 'dtl' + eldtl.MenuDetailIDC,
                    name: eldtl.MenuDetailDescC,
                    typemenu: 'dtl',
                    badge: [((eldtl.StatusActC == 'N') ? { type: 'primary', text: 'New' } : (eldtl.StatusActC == 'D') ? { type: 'danger', text: 'Deleted' } : {})],
                    style: { color: ((eldtl.StatusActC == 'N') ? '#3498db' : (eldtl.StatusActC == 'D') ? '#e74c3c' : '') },
                    del: ((eldtl.StatusActC == 'D') ? true : false)
                  });
                  if (eldtl.StatusActC == 'N') {
                    cnewWHM = cnewWHM++;
                    Obj.CountNewWHM = cnewWHM;
                    cnewHdr++;
                    cnewdtl++;
                  } else if (eldtl.StatusActC == 'D') {
                    cdelWHM = cdelWHM++;
                    Obj.CountDelWHM = cdelWHM;
                    cdelHdr++;
                    cdeldtl++;
                  }
                });
                if (cnewdtl > 0) {
                  bddtl.push({
                    type: 'primary',
                    text: cnewdtl + ' New'
                  });
                }
                if (cdeldtl > 0) {
                  bddtl.push({
                    type: 'danger',
                    text: cdeldtl + ' Deleted'
                  });
                }
                cekHdr.push({
                  id: 'hdr' + elh.MenuHeaderIDC,
                  name: elh.MenuHeaderDescC,
                  typemenu: 'hdr',
                  children: cekdtl,
                  badge: bddtl
                });
              });
              if (cnewHdr > 0) {
                bdHdr.push({
                  type: 'primary',
                  text: cnewHdr + ' New'
                });
              }
              if (cdelHdr > 0) {
                bdHdr.push({
                  type: 'danger',
                  text: cdelHdr + ' Deleted'
                });
              }
              lstMenuDetailW.push({
                id: 'grp' + elg.GroupIDC,
                name: elg.GroupDescC,
                typemenu: 'grp',
                children: cekHdr,
                badge: bdHdr
              });
            });
            setlsMenuDetailWB(lstMenuDetailW);

            let lstMenuDetailA = [];
            const lsGrpA = response.data.FormITOAListSummary.sort((a, b) => (a.GroupDescC > b.GroupDescC) ? 1 : ((b.GroupDescC > a.GroupDescC) ? -1 : 0))
              .filter(c => c.TypeMenuC == 'APP').filter((obj, index, self) =>
                index === self.findIndex((t) => t.GroupIDC === obj.GroupIDC && t.GroupDescC === obj.GroupDescC)
              );
            const lsTtlA = response.data.FormITOAListSummary.sort((a, b) => (a.TitleDescC > b.TitleDescC) ? 1 : ((b.TitleDescC > a.TitleDescC) ? -1 : 0))
              .filter(c => c.TypeMenuC == 'APP').filter((obj, index, self) =>
                index === self.findIndex((t) => t.TitleIDC === obj.TitleIDC && t.GroupIDC === obj.GroupIDC)
              );
            const lsTabA = response.data.FormITOAListSummary.sort((a, b) => (a.MenuTabDescC > b.MenuTabDescC) ? 1 : ((b.MenuTabDescC > a.MenuTabDescC) ? -1 : 0))
              .filter(c => c.TypeMenuC == 'APP').filter((obj, index, self) =>
                index === self.findIndex((t) => t.MenuTabIDC === obj.MenuTabIDC && t.TitleIDC === obj.TitleIDC)
              );
            const lsHdrA = response.data.FormITOAListSummary.sort((a, b) => (a.MenuHeaderDescC > b.MenuHeaderDescC) ? 1 : ((b.MenuHeaderDescC > a.MenuHeaderDescC) ? -1 : 0))
              .filter(c => c.TypeMenuC == 'APP').filter((obj, index, self) =>
                index === self.findIndex((t) => t.MenuHeaderIDC === obj.MenuHeaderIDC && t.MenuTabIDC === obj.MenuTabIDC)
              );
            const lsDtlA = response.data.FormITOAListSummary.sort((a, b) => (a.DocumentNumberC < b.DocumentNumberC) ? 1 : ((b.DocumentNumberC < a.DocumentNumberC) ? -1 : 0))
              .sort((a, b) => (a.MenuDetailDescC > b.MenuDetailDescC) ? 1 : ((b.MenuDetailDescC > a.MenuDetailDescC) ? -1 : 0))
              .filter(c => c.TypeMenuC == 'APP').filter((obj, index, self) =>
                index === self.findIndex((t) => t.MenuDetailIDC === obj.MenuDetailIDC && t.MenuHeaderIDC === obj.MenuHeaderIDC)
              );

            lsGrpA.forEach(elg => {
              let cekTtl = [];
              let bdTtlAS = [];
              let cnewTtlAS = 0;
              let cdelTtlAS = 0;
              lsTtlA.filter(x => x.GroupIDC == elg.GroupIDC).forEach(elt => {
                let cekTab = [];
                let bdTabAS = [];
                let cnewTabAS = 0;
                let cdelTabAS = 0;
                lsTabA.filter(x => x.TitleIDC == elt.TitleIDC).forEach(elta => {
                  let cekHdr = [];
                  let bdHdrAS = [];
                  let cnewHdrAS = 0;
                  let cdelHdrAS = 0;
                  lsHdrA.filter(x => x.MenuTabIDC == elta.MenuTabIDC).forEach(elh => {
                    let cekdtl = [];
                    let bddtlAS = [];
                    let cnewdtlAS = 0;
                    let cdeldtlAS = 0;
                    lsDtlA.filter(x => x.MenuHeaderIDC == elh.MenuHeaderIDC).forEach(eldtl => {
                      cekdtl.push({
                        id: 'dtl' + eldtl.MenuDetailIDC,
                        name: eldtl.MenuDetailDescC,
                        typemenu: 'dtl',
                        badge: [((eldtl.StatusActC == 'N') ? { type: 'primary', text: 'New' } : (eldtl.StatusActC == 'D') ? { type: 'danger', text: 'Deleted' } : {})],
                        style: { color: ((eldtl.StatusActC == 'N') ? '#3498db' : (eldtl.StatusActC == 'D') ? '#e74c3c' : '') },
                        del: ((eldtl.StatusActC == 'D') ? true : false)
                      });
                      if (eldtl.StatusActC == 'N') {
                        cnewAPP = cnewAPP++;
                        Obj.CountNewAPP = cnewAPP;
                        cnewTtlAS++;
                        cnewTabAS++;
                        cnewHdrAS++;
                        cnewdtlAS++;
                      } else if (eldtl.StatusActC == 'D') {
                        cdelAPP = cdelAPP++;
                        Obj.CountDelAPP = cdelAPP;
                        cdelTtlAS++;
                        cdelTabAS++;
                        cdelHdrAS++;
                        cdeldtlAS++;
                      }
                    });
                    if (cnewdtlAS > 0) {
                      bddtlAS.push({
                        type: 'primary',
                        text: cnewdtlAS + ' New'
                      });
                    }
                    if (cdeldtlAS > 0) {
                      bddtlAS.push({
                        type: 'danger',
                        text: cdeldtlAS + ' Deleted'
                      });
                    }
                    cekHdr.push({
                      id: 'hdr' + elh.MenuHeaderIDC,
                      name: elh.MenuHeaderDescC,
                      typemenu: 'hdr',
                      children: cekdtl,
                      badge: bddtlAS
                    });
                  });
                  if (cnewHdrAS > 0) {
                    bdHdrAS.push({
                      type: 'primary',
                      text: cnewHdrAS + ' New'
                    });
                  }
                  if (cdelHdrAS > 0) {
                    bdHdrAS.push({
                      type: 'danger',
                      text: cdelHdrAS + ' Deleted'
                    });
                  }
                  cekTab.push({
                    id: 'tab' + elta.MenuTabIDC,
                    name: elta.MenuTabDescC,
                    typemenu: 'tab',
                    children: cekHdr,
                    badge: bdHdrAS
                  });
                });
                if (cnewTabAS > 0) {
                  bdTabAS.push({
                    type: 'primary',
                    text: cnewTabAS + ' New'
                  });
                }
                if (cdelTabAS > 0) {
                  bdTabAS.push({
                    type: 'danger',
                    text: cdelTabAS + ' Deleted'
                  });
                }
                cekTtl.push({
                  id: 'ttl' + elt.TitleIDC,
                  name: elt.TitleDescC,
                  typemenu: 'ttl',
                  children: cekTab,
                  badge: bdTabAS
                });
              });
              if (cnewTtlAS > 0) {
                bdTtlAS.push({
                  type: 'primary',
                  text: cnewTtlAS + ' New'
                });
              }
              if (cdelTtlAS > 0) {
                bdTtlAS.push({
                  type: 'danger',
                  text: cdelTtlAS + ' Deleted'
                });
              }
              lstMenuDetailA.push({
                id: 'grp' + elg.GroupIDC,
                name: elg.GroupDescC,
                typemenu: 'grp',
                children: cekTtl,
                badge: bdTtlAS
              });
            });
            setlsMenuDetailAB(lstMenuDetailA);
          }
        })
        .catch(err => {
          ISI.PopAlertFalcon('error', 'error', err.message, '');
        });
    } catch (err) {
      ISI.PopAlertFalcon('error', 'error', err.response?.data?.ExceptionMessage || err.message, '');
    }
  };

  /*
  const ITOADCheckWApp = async (UserIDB) => {
    try {
      var obj = {};

      let temp = await axios({
        url: `${link}/cekITOADWApp?UserIDB=${UserIDB}`,
        method: 'GET',
        contentType: 'application/json; charset=utf-8',
        headers: {
          Keys: lgdata.UserTkn
        }
      });
      if (temp.data != '') {
        let ar = temp.data.split('|');
        ISI.PopAlertFalcon('Warning', 'Warning', `Form Daftar Menu untuk User : ${Obj.UserIDB} <br/><br/> Saat ini sedang waiting approve,<br/> dengan nomor dokumen : ${ar[0]},<br/> mohon menunggu hingga approval selesai, untuk merubah Form Daftar Menu yang baru.`, '');
      } else {
        const processPromises = [DelTempC('ERP', UserIDB), DelTempC('MOBILE', UserIDB), DelTempC('WHM', UserIDB), DelTempC('APP', UserIDB)];
        await Promise.all(processPromises);
        await ITOADSave();
      }
    } catch (err) {
      ISI.PopAlertFalcon('error', 'error', err.response?.data?.ExceptionMessage || err.message, '');
    }
  };
  */

  const ITOADCancel = async () => {
    try {
      //var DTTemp = { ...Obj };
      var DTTemp = {};
      DTTemp.CreatedBy = lgdata.UserId;
      DTTemp.CreatedIPB = lgdata.IP;
      DTTemp.ProsesId = 'CancelITOAD';
      DTTemp.UserIDB = Obj.UserIDB;
      DTTemp.DocumentNumber = key;
      console.log(Obj.UserIDB);

      let temp = await axios({
        url: `${link}/Post`,
        method: 'POST',
        data: DTTemp,
        contentType: 'application/json; charset=utf-8',
        headers: {
          Keys: lgdata.UserTkn
        }
      });
      var res = (await temp).data;
      if (res.Ket1) {
        ISI.PopAlertFalcon('Warning', 'Warning', res.Ket1, '');
      } else {
        navigate(`/master/mst061_FormITOAEntry/${key}/${act.substring(0, 1)}?param=${SearchParams.get('param')}`);
      }
    } catch (error) {
      ISI.PopAlertFalcon('error', 'error', error.response?.data?.ExceptionMessage || error.message, '');
    }
  };

  const ITOADSave = async () => {
    try {
      const promises = [];
      lsMenuDetailb.forEach(eldtl => {
        promises.push(InsTempC(eldtl));
      });
      let mdb = lsMenuDetailb.map(car => car.MenuDetailIDC);
      lsMenuDetailc.filter(i => !mdb.includes(i.MenuDetailIDC)).forEach(eldtl => {
        promises.push(InsTempC(eldtl));
      });

      await Promise.all(promises);

      navigate(`/master/mst061_FormITOAEntry/${key}/${act.substring(0, 1)}?param=${SearchParams.get('param')}`);
    } catch (error) {
      ISI.PopAlertFalcon('error', 'error', error.response?.data?.ExceptionMessage || error.message, '');
    }
  };

  const SAMApproval = async act => {
    try {
      let obj = { ...Obj };
      obj.UpdatedBy = lgdata.UserId;
      obj.UpdatedIP = lgdata.IP;
      obj.NIKLogin = lgdata.NIK;
      obj.StdAcsMenuDetailListb = lsMenuDetailb;
      obj.ProsesId = act == 'A' ? 'AppSAM' : act == 'J' ? 'RejSAM' : 'DisAppSAM';
      obj.DocumentNumber = key;
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
            ISI.PopAlertFalcon('error', 'error', response.data.Ket1, '')
          }
          else {
            navigate(`/master/mst061_StdAcsMenuList/${PActionB}?param=${SearchParams.get('param')}`);
          };
        })
        .catch(err => {
          ISI.PopAlertFalcon('error', 'error', err.response?.data?.ExceptionMessage || err.message, '');
        });
    } catch (err) {
      ISI.PopAlertFalcon('error', 'error', err.response?.data?.ExceptionMessage || err.message, '');
    }
  };

  const CopyTempC = async (UserIDCPYC, TypeMenuCPYC, TypeCPYC) => {
    try {
      //let obj = { ...Obj };      
      var DTTemp = {};
      DTTemp.ProsesId = 'CopyTempC';
      DTTemp.DocumentNumberC = key;
      //DTTemp.UserIDC = DTTemp.UserIDB;
      DTTemp.UserIDCPYC = UserIDCPYC;
      DTTemp.TypeMenuCPYC = TypeMenuCPYC;
      DTTemp.UserIDB = Obj.UserIDB;
      DTTemp.CreatedIPB = lgdata.IP;
      DTTemp.TypeCPYC = TypeCPYC;
      let temp = await axios({
        url: `${link}/Post`,
        method: 'POST',
        data: DTTemp,
        contentType: 'application/json; charset=utf-8',
        headers: {
          Keys: lgdata.UserTkn
        }
      });

      var res = (await temp).data;
      //SetTreeFront(TypeMenuCPYC, lsMenuDetail.filter(c => c.UserIDC != '' && (c.UserIDC == UserIDCPYC) && c.TypeMenuC == TypeMenuCPYC));
      GetITOADetail(kdus, act.substring(act.length - 3, act.length - 1));

      if (res.Ket1) {
        ISI.PopAlertFalcon('Warning', 'Warning', res.Ket1);
      }
    } catch (error) {
      ISI.PopAlertFalcon('error', 'error', error.response?.data?.ExceptionMessage || error.message, '');
    }
  };

  const InsTempC = async eldtl => {
    try {
      eldtl.ProsesId = 'InsTempC';
      eldtl.UpdatedByB = lgdata.UserId;
      eldtl.UpdatedIPB = lgdata.IP;
      eldtl.DocumentNumberC = key;
      //eldtl.UserIDC = Obj.UserIDB;
      let temp = await axios({
        url: `${link}/Post`,
        method: 'POST',
        data: eldtl,
        contentType: 'application/json; charset=utf-8',
        headers: {
          Keys: lgdata.UserTkn
        }
      });

      var res = (await temp).data;

      if (res.Ket1) {
        ISI.PopAlertFalcon('Warning', 'Warning', res.Ket1);
      }
    } catch (error) {
      ISI.PopAlertFalcon('error', 'error', error.response?.data?.ExceptionMessage || error.message, '');
    }
  };

  const DelTempC = async (typ, usrc) => {
    try {
      var DTTemp = {};
      DTTemp.ProsesId = 'DelTempC';
      DTTemp.TypeMenuC = typ.substring(0, 1);
      DTTemp.DocumentNumberC = key;
      DTTemp.UserIDC = usrc;
      let temp = await axios({
        url: `${link}/Post`,
        method: 'POST',
        data: DTTemp,
        contentType: 'application/json; charset=utf-8',
        headers: {
          Keys: lgdata.UserTkn
        }
      });
      var res = (await temp).data;
      if (res.Ket1) {
        ISI.PopAlertFalcon('Warning', 'Warning', res.Ket1);
      }
    } catch (error) {
      ISI.PopAlertFalcon('error', 'error', error.response?.data?.ExceptionMessage || error.message, '');
    }
  };

  const ConfITOADCancel = async () => {
    if (act.substring(act.length - 1) != 'N') { //last char
      navigate(`/master/mst061_FormITOAEntry/${key}/${PActionB}?param=${SearchParams.get('param')}`);
    } else {
      ISI.confirmISI({
        title: 'Konfirmasi',
        msg: 'Cancel Input Form Daftar Menu ?',
        yesText: 'Yes',
        yesAction: () => {
          ITOADCancel();
        },
        noText: 'No',
        noAction: () => { }
      });
    }
  };

  const ConfSAMApproval = async act => {
    ISI.confirmISI({
      title: 'Konfirmasi',
      msg: `Are you sure want to ${act == 'A' ? 'Approve' : act == 'J' ? 'Reject' : 'Disapprove'} this data?`,
      yesText: 'Yes',
      yesAction: () => {
        SAMApproval(act);
      },
      noText: 'No',
      noAction: () => { }
    });
  };

  const ITOADSaveBatch = async () => {
    try {
      // 1. Construct list of items to insert (replicating ITOADSave logic)
      let itemsToInsert = [...lsMenuDetailb]; // Copy b
      let mdb = lsMenuDetailb.map(car => car.MenuDetailIDC);
      let itemsFromC = lsMenuDetailc.filter(i => !mdb.includes(i.MenuDetailIDC));

      // Merge and Map UserIDC to ensure backend receives it for each item
      let allItems = [...itemsToInsert, ...itemsFromC];
      // Note: We use Obj.UserIDB as the UserIDC for these items
      allItems = allItems.map(item => ({
        ...item,
        UserIDC: Obj.UserIDB
      }));

      itemsToInsert = allItems;

      // 2. Prepare Payload
      var obj = {}; // Copy Obj
      obj.ProsesId = 'SaveBatch';
      obj.UserIDB = Obj.UserIDB;
      obj.DocumentNumberC = key;
      obj.UserIDC = Obj.UserIDB;
      obj.LsMenuDetailC = itemsToInsert;

      // 3. Call API
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
        navigate(`/master/mst061_FormITOAEntry/${key}/${act.substring(0, 1)}?param=${SearchParams.get('param')}`);
      }
    } catch (error) {
      ISI.PopAlertFalcon('error', 'error', error.response?.data?.ExceptionMessage || error.message, '');
    }
  };

  const ConfITOADSave = async () => {
    if (lsMenuDetailb.length == 0) {
      ISI.PopAlertFalcon('Warning', 'Warning', 'Mohon lakukan perubahan setidaknya satu menu !', '');
    } else {
      //console.log(lsMenuDetailb);
      ISI.confirmISI({
        title: 'Konfirmasi',
        msg: `Simpan Form Daftar Menu User ${Obj.UserIDB} ?`,
        yesText: 'Yes',
        yesAction: () => {
          //ITOADCheckWApp(Obj.UserIDB)
          ITOADSaveBatch();
        },
        noText: 'No',
        noAction: () => { }
      });
    }
  };

  const SaveSAM = async () => {
    try {

      const processPromises = [SaveTreeFront('ERP', selectedItemsE), SaveTreeFront('MOBILE', selectedItemsM), SaveTreeFront('WHM', selectedItemsW), SaveTreeFront('APP', selectedItemsA)];
      await Promise.all(processPromises);
      await ConfITOADSave();
    } catch (err) {
      ISI.PopAlertFalcon('error', 'error', err.response?.data?.ExceptionMessage || err.message, '');
    }
  };

  const SetTreeFront = async (type, list) => {
    let arrTreedetail = [];
    let lstTreeFront = [];
    if (type == 'ERP' || type == 'APP') {
      const lsGrpA = list.sort((a, b) => (a.GroupDescC > b.GroupDescC) ? 1 : ((b.GroupDescC > a.GroupDescC) ? -1 : 0)).filter((obj, index, self) =>
        index === self.findIndex((t) => t.GroupIDC === obj.GroupIDC && t.GroupDescC === obj.GroupDescC)
      );
      const lsTtlA = list.sort((a, b) => (a.TitleDescC > b.TitleDescC) ? 1 : ((b.TitleDescC > a.TitleDescC) ? -1 : 0)).filter((obj, index, self) =>
        index === self.findIndex((t) => t.TitleIDC === obj.TitleIDC && t.GroupIDC === obj.GroupIDC)
      );
      const lsTabA = list.sort((a, b) => (a.MenuTabDescC > b.MenuTabDescC) ? 1 : ((b.MenuTabDescC > a.MenuTabDescC) ? -1 : 0)).filter((obj, index, self) =>
        index === self.findIndex((t) => t.MenuTabIDC === obj.MenuTabIDC && t.TitleIDC === obj.TitleIDC)
      );
      const lsHdrA = list.sort((a, b) => (a.MenuHeaderDescC > b.MenuHeaderDescC) ? 1 : ((b.MenuHeaderDescC > a.MenuHeaderDescC) ? -1 : 0)).filter((obj, index, self) =>
        index === self.findIndex((t) => t.MenuHeaderIDC === obj.MenuHeaderIDC && t.MenuTabIDC === obj.MenuTabIDC)
      );
      const lsDtlA = list.sort((a, b) => (a.DocumentNumberC < b.DocumentNumberC) ? 1 : ((b.DocumentNumberC < a.DocumentNumberC) ? -1 : 0))
        .sort((a, b) => (a.MenuDetailDescC > b.MenuDetailDescC) ? 1 : ((b.MenuDetailDescC > a.MenuDetailDescC) ? -1 : 0)).filter((obj, index, self) =>
          index === self.findIndex((t) => t.MenuDetailIDC === obj.MenuDetailIDC && t.MenuHeaderIDC === obj.MenuHeaderIDC)
        );

      lsGrpA.forEach(elg => {
        let cekTtlAS = [];
        let bdTtlAS = [];
        let cnewTtlAS = 0;
        let cdelTtlAS = 0;
        lsTtlA.filter(x => x.GroupIDC == elg.GroupIDC).forEach(elt => {
          let cekTabAS = [];
          let bdTabAS = [];
          let cnewTabAS = 0;
          let cdelTabAS = 0;
          lsTabA.filter(x => x.TitleIDC == elt.TitleIDC).forEach(elta => {
            let cekHdrAS = [];
            let bdHdrAS = [];
            let cnewHdrAS = 0;
            let cdelHdrAS = 0;
            lsHdrA.filter(x => x.MenuTabIDC == elta.MenuTabIDC).forEach(elh => {
              let cekdtlAS = [];
              let bddtlAS = [];
              let cnewdtlAS = 0;
              let cdeldtlAS = 0;
              lsDtlA.filter(x => x.MenuHeaderIDC == elh.MenuHeaderIDC).forEach(eldtl => {
                // if (act != 'VH') {
                cekdtlAS.push({
                  id: 'dtl' + eldtl.MenuDetailIDC,
                  name: eldtl.MenuDetailDescC,
                  typemenu: 'dtl',
                  badge: [((eldtl.StatusActC == 'N') ? { type: 'primary', text: 'New' } : (eldtl.StatusActC == 'D') ? { type: 'danger', text: 'Deleted' } : {})],
                  style: { color: ((eldtl.StatusActC == 'N') ? '#3498db' : (eldtl.StatusActC == 'D') ? '#e74c3c' : '') },
                  del: ((eldtl.StatusActC == 'D') ? true : false)
                });
                if (eldtl.StatusActC == 'N') {
                  if (type == 'ERP') {
                    cnewERP = cnewERP++;
                    Obj.CountNewERP = cnewERP;
                  } else if (type == 'APP') {
                    cnewAPP = cnewAPP++;
                    Obj.CountNewAPP = cnewAPP;
                  }
                  cnewTtlAS++;
                  cnewTabAS++;
                  cnewHdrAS++;
                  cnewdtlAS++;
                } else if (eldtl.StatusActC == 'D') {
                  if (type == 'ERP') {
                    cdelERP = cdelERP++;
                    Obj.CountDelERP = cdelERP;
                  } else if (type == 'APP') {
                    cdelAPP = cdelAPP++;
                    Obj.CountDelAPP = cdelAPP;
                  }
                  cdelTtlAS++;
                  cdelTabAS++;
                  cdelHdrAS++;
                  cdeldtlAS++;
                }
                // } else {
                //   cekdtlAS.push({
                //     id: 'dtl' + eldtl.MenuDetailIDC,
                //     name: eldtl.MenuDetailDescC + ` (${eldtl.DocumentNumberB})`,
                //     typemenu: 'dtl',
                //   });
                // }
                if (eldtl.StatusActC != 'D') {
                  arrTreedetail.push('dtl' + eldtl.MenuDetailIDC);
                }
              });
              if (cnewdtlAS > 0) {
                bddtlAS.push({
                  type: 'primary',
                  text: cnewdtlAS + ' New'
                });
              }
              if (cdeldtlAS > 0) {
                bddtlAS.push({
                  type: 'danger',
                  text: cdeldtlAS + ' Deleted'
                });
              }
              cekHdrAS.push({
                id: 'hdr' + elh.MenuHeaderIDC,
                name: elh.MenuHeaderDescC,
                typemenu: 'hdr',
                children: cekdtlAS,
                badge: bddtlAS
              });
              arrTreedetail.push('hdr' + elh.MenuHeaderIDC);
            });
            if (cnewHdrAS > 0) {
              bdHdrAS.push({
                type: 'primary',
                text: cnewHdrAS + ' New'
              });
            }
            if (cdelHdrAS > 0) {
              bdHdrAS.push({
                type: 'danger',
                text: cdelHdrAS + ' Deleted'
              });
            }
            cekTabAS.push({
              id: 'tab' + elta.MenuTabIDC,
              name: elta.MenuTabDescC,
              typemenu: 'tab',
              children: cekHdrAS,
              badge: bdHdrAS
            });
            arrTreedetail.push('tab' + elta.MenuTabIDC);
          });
          if (cnewTabAS > 0) {
            bdTabAS.push({
              type: 'primary',
              text: cnewTabAS + ' New'
            });
          }
          if (cdelTabAS > 0) {
            bdTabAS.push({
              type: 'danger',
              text: cdelTabAS + ' Deleted'
            });
          }
          cekTtlAS.push({
            id: 'ttl' + elt.TitleIDC,
            name: elt.TitleDescC,
            typemenu: 'ttl',
            children: cekTabAS,
            badge: bdTabAS
          });
          arrTreedetail.push('ttl' + elt.TitleIDC);
        });
        if (cnewTtlAS > 0) {
          bdTtlAS.push({
            type: 'primary',
            text: cnewTtlAS + ' New'
          });
        }
        if (cdelTtlAS > 0) {
          bdTtlAS.push({
            type: 'danger',
            text: cdelTtlAS + ' Deleted'
          });
        }
        lstTreeFront.push({
          id: 'grp' + elg.GroupIDC,
          name: elg.GroupDescC,
          typemenu: 'grp',
          children: cekTtlAS,
          badge: bdTtlAS
        });
        arrTreedetail.push('grp' + elg.GroupIDC);
      });
      if (type == 'APP') {
        setlsMenuDetailAF(lstTreeFront);
        setselectedItemsA(arrTreedetail);
        setselectedItemsAE(arrTreedetail);
        //DelTempC('APP', arrTreedetail);
      } else if (type == 'ERP') {
        setlsMenuDetailEF(lstTreeFront);
        setselectedItemsE(arrTreedetail);
        setselectedItemsEE(arrTreedetail);
        //DelTempC('ERP', arrTreedetail);
      }

    }
    if (type == 'MOBILE' || type == 'WHM') {
      const lsGrp = list.sort((a, b) => (a.GroupDescC > b.GroupDescC) ? 1 : ((b.GroupDescC > a.GroupDescC) ? -1 : 0)).filter((obj, index, self) =>
        index === self.findIndex((t) => t.GroupIDC === obj.GroupIDC && t.GroupDescC === obj.GroupDescC)
      );
      const lsHdr = list.sort((a, b) => (a.MenuHeaderDescC > b.MenuHeaderDescC) ? 1 : ((b.MenuHeaderDescC > a.MenuHeaderDescC) ? -1 : 0)).filter((obj, index, self) =>
        index === self.findIndex((t) => t.MenuHeaderIDC === obj.MenuHeaderIDC && t.MenuTabIDC === obj.MenuTabIDC)
      );
      const lsDtl = list.sort((a, b) => (a.DocumentNumberC < b.DocumentNumberC) ? 1 : ((b.DocumentNumberC < a.DocumentNumberC) ? -1 : 0))
        .sort((a, b) => (a.MenuDetailDescC > b.MenuDetailDescC) ? 1 : ((b.MenuDetailDescC > a.MenuDetailDescC) ? -1 : 0)).filter((obj, index, self) =>
          index === self.findIndex((t) => t.MenuDetailIDC === obj.MenuDetailIDC && t.MenuHeaderIDC === obj.MenuHeaderIDC)
        );

      lsGrp.forEach(elg => {
        let cekHdr = [];
        let bdHdr = [];
        let cnewHdr = 0;
        let cdelHdr = 0;
        lsHdr.filter(x => x.GroupIDC == elg.GroupIDC).forEach(elh => {
          let cekdtl = [];
          let bddtl = [];
          let cnewdtl = 0;
          let cdeldtl = 0;
          lsDtl.filter(x => x.MenuHeaderIDC == elh.MenuHeaderIDC).forEach(eldtl => {
            // if (act != 'VH') {
            cekdtl.push({
              id: 'dtl' + eldtl.MenuDetailIDC,
              name: eldtl.MenuDetailDescC,
              typemenu: 'dtl',
              badge: [((eldtl.StatusActC == 'N') ? { type: 'primary', text: 'New' } : (eldtl.StatusActC == 'D') ? { type: 'danger', text: 'Deleted' } : {})],
              style: { color: ((eldtl.StatusActC == 'N') ? '#3498db' : (eldtl.StatusActC == 'D') ? '#e74c3c' : '') },
              del: ((eldtl.StatusActC == 'D') ? true : false)
            });
            if (eldtl.StatusActC == 'N') {
              if (type == 'MOBILE') {
                cnewMobile = cnewMobile++;
                Obj.CountNewMobile = cnewMobile;
              } else if (type == 'WHM') {
                cnewWHM = cnewWHM++;
                Obj.CountNewWHM = cnewWHM;
              }
              cnewHdr++;
              cnewdtl++;
            } else if (eldtl.StatusActC == 'D') {
              if (type == 'MOBILE') {
                cdelMobile = cdelMobile++;
                Obj.CountDelMobile = cdelMobile;
              } else if (type == 'WHM') {
                cdelWHM = cdelWHM++;
                Obj.CountDelWHM = cdelWHM;
              }
              cdelHdr++;
              cdeldtl++;
            }
            // } else {
            //   //   cekdtl.push({
            //   //     id: 'dtl' + eldtl.MenuDetailIDC,
            //   //     name: eldtl.MenuDetailDescC + ` (${eldtl.DocumentNumberB})`,
            //   //     typemenu: 'dtl',
            //   //   });
            // }
            if (eldtl.StatusActC != 'D') {
              arrTreedetail.push('dtl' + eldtl.MenuDetailIDC);
            }
          });
          if (cnewdtl > 0) {
            bddtl.push({
              type: 'primary',
              text: cnewdtl + ' New'
            });
          }
          if (cdeldtl > 0) {
            bddtl.push({
              type: 'danger',
              text: cdeldtl + ' Deleted'
            });
          }
          cekHdr.push({
            id: 'hdr' + elh.MenuHeaderIDC,
            name: elh.MenuHeaderDescC,
            typemenu: 'hdr',
            children: cekdtl,
            badge: bddtl
          });
          arrTreedetail.push('hdr' + elh.MenuHeaderIDC);
        });
        if (cnewHdr > 0) {
          bdHdr.push({
            type: 'primary',
            text: cnewHdr + ' New'
          });
        }
        if (cdelHdr > 0) {
          bdHdr.push({
            type: 'danger',
            text: cdelHdr + ' Deleted'
          });
        }
        lstTreeFront.push({
          id: 'grp' + elg.GroupIDC,
          name: elg.GroupDescC,
          typemenu: 'grp',
          children: cekHdr,
          badge: bdHdr
        });
        arrTreedetail.push('grp' + elg.GroupIDC);
      });
      if (type == 'MOBILE') {
        setlsMenuDetailMF(lstTreeFront);
        setselectedItemsM(arrTreedetail);
        setselectedItemsME(arrTreedetail);
        //DelTempC('MOBILE', arrTreedetail);
      } else if (type == 'WHM') {
        setlsMenuDetailWF(lstTreeFront);
        setselectedItemsW(arrTreedetail);
        setselectedItemsWE(arrTreedetail);
        //DelTempC('WHM', arrTreedetail);
      }
    }

  };

  const SaveTreeFront = async (typ, arrc) => {
    let lstMenuSelected = [];
    let lstMenuExisting = [];
    if (typ == 'ERP') {
      arrc = arrc.concat(selectedItemsEE);
      lstMenuSelected = selectedItemsE;
      lstMenuExisting = selectedItemsEE;
    } else if (typ == 'APP') {
      arrc = arrc.concat(selectedItemsAE);
      lstMenuSelected = selectedItemsA;
      lstMenuExisting = selectedItemsAE;
    } else if (typ == 'MOBILE') {
      arrc = arrc.concat(selectedItemsME);
      lstMenuSelected = selectedItemsM;
      lstMenuExisting = selectedItemsME;
    } else if (typ == 'WHM') {
      arrc = arrc.concat(selectedItemsWE);
      lstMenuSelected = selectedItemsW;
      lstMenuExisting = selectedItemsWE;
    }
    var lsdtltr = arrc.filter(name => name.includes('dtl'));
    for (var i = 0; i < lsdtltr.length; i++) {
      lsdtltr[i] = lsdtltr[i].replace('dtl', '');
    }


    if (typ == 'ERP' || typ == 'APP') {
      let lstMenuDetail = [];
      const lsGrp = lsMenuDetail.sort((a, b) => (a.GroupDescC > b.GroupDescC) ? 1 : ((b.GroupDescC > a.GroupDescC) ? -1 : 0))
        .filter(c => c.TypeMenuC == typ && (lsdtltr.includes(c.MenuDetailIDC) || c.StatusActC == 'D')).filter((obj, index, self) =>
          index === self.findIndex((t) => t.GroupIDC === obj.GroupIDC && t.GroupDescC === obj.GroupDescC)
        );
      const lsTtl = lsMenuDetail.sort((a, b) => (a.TitleDescC > b.TitleDescC) ? 1 : ((b.TitleDescC > a.TitleDescC) ? -1 : 0))
        .filter(c => c.TypeMenuC == typ && (lsdtltr.includes(c.MenuDetailIDC) || c.StatusActC == 'D')).filter((obj, index, self) =>
          index === self.findIndex((t) => t.TitleIDC === obj.TitleIDC && t.GroupIDC === obj.GroupIDC)
        );
      const lsTab = lsMenuDetail.sort((a, b) => (a.MenuTabDescC > b.MenuTabDescC) ? 1 : ((b.MenuTabDescC > a.MenuTabDescC) ? -1 : 0))
        .filter(c => c.TypeMenuC == typ && (lsdtltr.includes(c.MenuDetailIDC) || c.StatusActC == 'D')).filter((obj, index, self) =>
          index === self.findIndex((t) => t.MenuTabIDC === obj.MenuTabIDC && t.TitleIDC === obj.TitleIDC)
        );
      const lsHdr = lsMenuDetail.sort((a, b) => (a.MenuHeaderDescC > b.MenuHeaderDescC) ? 1 : ((b.MenuHeaderDescC > a.MenuHeaderDescC) ? -1 : 0))
        .filter(c => c.TypeMenuC == typ && (lsdtltr.includes(c.MenuDetailIDC) || c.StatusActC == 'D')).filter((obj, index, self) =>
          index === self.findIndex((t) => t.MenuHeaderIDC === obj.MenuHeaderIDC && t.MenuTabIDC === obj.MenuTabIDC)
        );
      // const lsDtl = lsMenuDetail.filter(c => c.TypeMenuC == typ && lsdtltr.includes(c.MenuDetailIDC)).filter((obj, index, self) =>
      //   index === self.findIndex((t) => t.MenuDetailIDC === obj.MenuDetailIDC && t.MenuHeaderIDC === obj.MenuHeaderIDC)
      // );.filter(c => c.MenuDetailIDC == '2848')
      const lsDtl = lsMenuDetail.sort((a, b) => (a.DocumentNumberC < b.DocumentNumberC) ? 1 : ((b.DocumentNumberC < a.DocumentNumberC) ? -1 : 0))
        .sort((a, b) => (a.MenuDetailDescC > b.MenuDetailDescC) ? 1 : ((b.MenuDetailDescC > a.MenuDetailDescC) ? -1 : 0))
        .filter(c => c.TypeMenuC == typ && (lsdtltr.includes(c.MenuDetailIDC) || c.StatusActC == 'D'))
        .filter((obj, index, self) => index === self.findIndex((t) => t.MenuDetailIDC === obj.MenuDetailIDC && t.MenuHeaderIDC === obj.MenuHeaderIDC));

      // console.log(lsdtltr);
      //console.log(lsDtl.map(car => car.MenuDetailIDC));

      lsGrp.forEach(elg => {
        let cekTtl = [];
        let bdTtl = [];
        let cnewTtl = 0;
        let cdelTtl = 0;
        lsTtl.filter(x => x.GroupIDC == elg.GroupIDC).forEach(elt => {
          let cekTab = [];
          let bdTab = [];
          let cnewTab = 0;
          let cdelTab = 0;
          lsTab.filter(x => x.TitleIDC == elt.TitleIDC).forEach(elta => {
            let cekHdr = [];
            let bdHdr = [];
            let cnewHdr = 0;
            let cdelHdr = 0;
            lsHdr.filter(x => x.MenuTabIDC == elta.MenuTabIDC).forEach(elh => {
              let cekdtl = [];
              let bddtl = [];
              let cnewdtl = 0;
              let cdeldtl = 0;
              lsDtl.filter(x => x.MenuHeaderIDC == elh.MenuHeaderIDC && x.MenuHeaderDescC == elh.MenuHeaderDescC).forEach(eldtl => {
                // if (eldtl.MenuDetailIDC == '2850') {
                //   console.log(eldtl);
                //   console.log(lstMenuSelected.indexOf('dtl' + eldtl.MenuDetailIDC));
                //   console.log(lstMenuExisting.indexOf('dtl' + eldtl.MenuDetailIDC));
                //   console.log(eldtl.StatusActC);
                //   console.log('tes');
                //   // debugger;
                // }
                // == -1 (Tidak ada) != -1 (ada)
                if (((lstMenuSelected.indexOf('dtl' + eldtl.MenuDetailIDC) != -1 && lstMenuExisting.indexOf('dtl' + eldtl.MenuDetailIDC) != -1) && eldtl.StatusActC == 'E') ||
                  ((lstMenuSelected.indexOf('dtl' + eldtl.MenuDetailIDC) != -1 && lstMenuExisting.indexOf('dtl' + eldtl.MenuDetailIDC) == -1) && eldtl.StatusActC == 'D')) {
                  cekdtl.push({
                    id: 'dtl' + eldtl.MenuDetailIDC,
                    name: eldtl.MenuDetailDescC,
                    typemenu: 'dtl',
                  });
                  if ((lstMenuSelected.indexOf('dtl' + eldtl.MenuDetailIDC) != -1 && lstMenuExisting.indexOf('dtl' + eldtl.MenuDetailIDC) == -1) && eldtl.StatusActC == 'D') {//jika delete dan sebelumnya ada
                    lsMenuDetailb.push(eldtl);
                  }
                  eldtl.StatusActC = 'E';
                } else if ((lstMenuSelected.indexOf('dtl' + eldtl.MenuDetailIDC) != -1 && lstMenuExisting.indexOf('dtl' + eldtl.MenuDetailIDC) == -1) ||
                  ((lstMenuSelected.indexOf('dtl' + eldtl.MenuDetailIDC) != -1 && lstMenuExisting.indexOf('dtl' + eldtl.MenuDetailIDC) != -1) && eldtl.StatusActC == 'N')) {
                  eldtl.StatusActC = 'N';
                  cekdtl.push({
                    id: 'dtl' + eldtl.MenuDetailIDC,
                    name: eldtl.MenuDetailDescC,
                    typemenu: 'dtl',
                    badge: [{ type: 'primary', text: 'New' }],
                    style: { color: '#3498db' }
                  });
                  if (typ == 'ERP') {
                    cnewERP = cnewERP++;
                    Obj.CountNewERP = cnewERP;
                  } else if (typ == 'APP') {
                    cnewAPP = cnewAPP++;
                    Obj.CountNewAPP = cnewAPP;
                  }
                  cnewTtl++;
                  cnewTab++;
                  cnewHdr++;
                  cnewdtl++;
                  lsMenuDetailb.push(eldtl);
                } else if (((lstMenuSelected.indexOf('dtl' + eldtl.MenuDetailIDC) == -1 && lstMenuExisting.indexOf('dtl' + eldtl.MenuDetailIDC) != -1) && eldtl.StatusActC == 'E') ||
                  ((lstMenuSelected.indexOf('dtl' + eldtl.MenuDetailIDC) == -1 && lstMenuExisting.indexOf('dtl' + eldtl.MenuDetailIDC) == -1) && eldtl.StatusActC == 'D')) {
                  eldtl.StatusActC = 'D';
                  cekdtl.push({
                    id: 'dtl' + eldtl.MenuDetailIDC,
                    name: eldtl.MenuDetailDescC,
                    typemenu: 'dtl',
                    badge: [{ type: 'danger', text: 'Deleted' }],
                    style: { color: '#e74c3c' },
                    del: true
                  });
                  if (typ == 'ERP') {
                    cdelERP = cdelERP++;
                    Obj.CountDelERP = cdelERP;
                  } else if (typ == 'APP') {
                    cdelAPP = cdelAPP++;
                    Obj.CountDelAPP = cdelAPP;
                  }
                  cdelTtl++;
                  cdelTab++;
                  cdelHdr++;
                  cdeldtl++;
                  lsMenuDetailb.push(eldtl);
                }
                //InsTempC(eldtl);
              });
              if (cnewdtl > 0) {
                bddtl.push({
                  type: 'primary',
                  text: cnewdtl + ' New'
                });
              }
              if (cdeldtl > 0) {
                bddtl.push({
                  type: 'danger',
                  text: cdeldtl + ' Deleted'
                });
              }
              cekHdr.push({
                id: 'hdr' + elh.MenuHeaderIDC,
                name: elh.MenuHeaderDescC,
                typemenu: 'hdr',
                children: cekdtl,
                badge: bddtl
              });
            });
            if (cnewHdr > 0) {
              bdHdr.push({
                type: 'primary',
                text: cnewHdr + ' New'
              });
            }
            if (cdelHdr > 0) {
              bdHdr.push({
                type: 'danger',
                text: cdelHdr + ' Deleted'
              });
            }
            cekTab.push({
              id: 'tab' + elta.MenuTabIDC,
              name: elta.MenuTabDescC,
              typemenu: 'tab',
              children: cekHdr,
              badge: bdHdr
            });
          });
          if (cnewTab > 0) {
            bdTab.push({
              type: 'primary',
              text: cnewTab + ' New'
            });
          }
          if (cdelTab > 0) {
            bdTab.push({
              type: 'danger',
              text: cdelTab + ' Deleted'
            });
          }
          cekTtl.push({
            id: 'ttl' + elt.TitleIDC,
            name: elt.TitleDescC,
            typemenu: 'ttl',
            children: cekTab,
            badge: bdTab
          });
        });
        if (cnewTtl > 0) {
          bdTtl.push({
            type: 'primary',
            text: cnewTtl + ' New'
          });
        }
        if (cdelTtl > 0) {
          bdTtl.push({
            type: 'danger',
            text: cdelTtl + ' Deleted'
          });
        }
        lstMenuDetail.push({
          id: 'grp' + elg.GroupIDC,
          name: elg.GroupDescC,
          typemenu: 'grp',
          children: cekTtl,
          badge: bdTtl
        });
      });
      if (typ == 'ERP') {
        setlsMenuDetailEF(lstMenuDetail);
      } else if (typ == 'APP') {
        setlsMenuDetailAF(lstMenuDetail);
      }
    }

    if (typ == 'MOBILE' || typ == 'WHM') {
      let lstMenuDetail = [];
      const lsGrp = lsMenuDetail.sort((a, b) => (a.GroupDescC > b.GroupDescC) ? 1 : ((b.GroupDescC > a.GroupDescC) ? -1 : 0))
        .filter(c => c.TypeMenuC == typ && (lsdtltr.includes(c.MenuDetailIDC) || c.StatusActC == 'D')).filter((obj, index, self) =>
          index === self.findIndex((t) => t.GroupIDC === obj.GroupIDC && t.GroupDescC === obj.GroupDescC)
        );
      const lsHdr = lsMenuDetail.sort((a, b) => (a.MenuHeaderDescC > b.MenuHeaderDescC) ? 1 : ((b.MenuHeaderDescC > a.MenuHeaderDescC) ? -1 : 0))
        .filter(c => c.TypeMenuC == typ && (lsdtltr.includes(c.MenuDetailIDC) || c.StatusActC == 'D')).filter((obj, index, self) =>
          index === self.findIndex((t) => t.MenuHeaderIDC === obj.MenuHeaderIDC && t.MenuTabIDC === obj.MenuTabIDC)
        );
      // const lsDtl = lsMenuDetail.sort((a, b) => (a.MenuDetailDescC > b.MenuDetailDescC) ? 1 : ((b.MenuDetailDescC > a.MenuDetailDescC) ? -1 : 0))
      //   .filter(c => c.TypeMenuC == typ && lsdtltr.includes(c.MenuDetailIDC)).filter((obj, index, self) =>
      //     index === self.findIndex((t) => t.MenuDetailIDC === obj.MenuDetailIDC && t.MenuHeaderIDC === obj.MenuHeaderIDC)
      //   );
      const lsDtl = lsMenuDetail.sort((a, b) => (a.DocumentNumberC < b.DocumentNumberC) ? 1 : ((b.DocumentNumberC < a.DocumentNumberC) ? -1 : 0))
        .sort((a, b) => (a.MenuDetailDescC > b.MenuDetailDescC) ? 1 : ((b.MenuDetailDescC > a.MenuDetailDescC) ? -1 : 0))
        .filter(c => c.TypeMenuC == typ && (lsdtltr.includes(c.MenuDetailIDC) || c.StatusActC == 'D'))
        .filter((obj, index, self) => index === self.findIndex((t) => t.MenuDetailIDC === obj.MenuDetailIDC && t.MenuHeaderIDC === obj.MenuHeaderIDC));

      lsGrp.forEach(elg => {
        let cekHdr = [];
        let bdHdr = [];
        let cnewHdr = 0;
        let cdelHdr = 0;
        lsHdr.filter(x => x.GroupIDC == elg.GroupIDC).forEach(elh => {
          let cekdtl = [];
          let bddtl = [];
          let cnewdtl = 0;
          let cdeldtl = 0;
          lsDtl.filter(x => x.MenuHeaderIDC == elh.MenuHeaderIDC && x.MenuHeaderDescC == elh.MenuHeaderDescC).forEach(eldtl => {

            // if (eldtl.MenuDetailIDC == '2851') {
            //   console.log(eldtl);
            //   console.log(lstMenuSelected.indexOf('dtl' + eldtl.MenuDetailIDC));
            //   console.log(lstMenuExisting.indexOf('dtl' + eldtl.MenuDetailIDC));
            //   console.log(eldtl.StatusActC);
            //   debugger;
            // }
            if (((lstMenuSelected.indexOf('dtl' + eldtl.MenuDetailIDC) != -1 && lstMenuExisting.indexOf('dtl' + eldtl.MenuDetailIDC) != -1) && eldtl.StatusActC == 'E') ||
              ((lstMenuSelected.indexOf('dtl' + eldtl.MenuDetailIDC) != -1 && lstMenuExisting.indexOf('dtl' + eldtl.MenuDetailIDC) == -1) && eldtl.StatusActC == 'D')) {
              cekdtl.push({
                id: 'dtl' + eldtl.MenuDetailIDC,
                name: eldtl.MenuDetailDescC,
                typemenu: 'dtl',
              });
              if ((lstMenuSelected.indexOf('dtl' + eldtl.MenuDetailIDC) != -1 && lstMenuExisting.indexOf('dtl' + eldtl.MenuDetailIDC) == -1) && eldtl.StatusActC == 'D') {
                lsMenuDetailb.push(eldtl);
              }
              eldtl.StatusActC = 'E';
            } else if ((lstMenuSelected.indexOf('dtl' + eldtl.MenuDetailIDC) != -1 && lstMenuExisting.indexOf('dtl' + eldtl.MenuDetailIDC) == -1) ||
              ((lstMenuSelected.indexOf('dtl' + eldtl.MenuDetailIDC) != -1 && lstMenuExisting.indexOf('dtl' + eldtl.MenuDetailIDC) != -1) && eldtl.StatusActC == 'N')) {
              eldtl.StatusActC = 'N';
              cekdtl.push({
                id: 'dtl' + eldtl.MenuDetailIDC,
                name: eldtl.MenuDetailDescC,
                typemenu: 'dtl',
                badge: [{ type: 'primary', text: 'New' }],
                style: { color: '#3498db' }
              });
              if (typ == 'MOBILE') {
                cnewMobile = cnewMobile++;
                Obj.CountNewMobile = cnewMobile;
              } else if (typ == 'WHM') {
                cnewWHM = cnewWHM++;
                Obj.CountNewWHM = cnewWHM;
              }
              cnewHdr++;
              cnewdtl++;
              lsMenuDetailb.push(eldtl);
            } else if (((lstMenuSelected.indexOf('dtl' + eldtl.MenuDetailIDC) == -1 && lstMenuExisting.indexOf('dtl' + eldtl.MenuDetailIDC) != -1) && eldtl.StatusActC == 'E') ||
              ((lstMenuSelected.indexOf('dtl' + eldtl.MenuDetailIDC) == -1 && lstMenuExisting.indexOf('dtl' + eldtl.MenuDetailIDC) == -1) && eldtl.StatusActC == 'D')) {
              eldtl.StatusActC = 'D';
              cekdtl.push({
                id: 'dtl' + eldtl.MenuDetailIDC,
                name: eldtl.MenuDetailDescC,
                typemenu: 'dtl',
                badge: [{ type: 'danger', text: 'Deleted' }],
                style: { color: '#e74c3c' },
                del: true
              });
              if (typ == 'MOBILE') {
                cdelMobile = cdelMobile++;
                Obj.CountDelMobile = cdelMobile;
              } else if (typ == 'WHM') {
                cdelWHM = cdelWHM++;
                Obj.CountDelWHM = cdelWHM;
              }
              cdelHdr++;
              cdeldtl++;
              lsMenuDetailb.push(eldtl);
            }
            //InsTempC(eldtl);
          });
          if (cnewdtl > 0) {
            bddtl.push({
              type: 'primary',
              text: cnewdtl + ' New'
            });
          }
          if (cdeldtl > 0) {
            bddtl.push({
              type: 'danger',
              text: cdeldtl + ' Deleted'
            });
          }
          cekHdr.push({
            id: 'hdr' + elh.MenuHeaderIDC,
            name: elh.MenuHeaderDescC,
            typemenu: 'hdr',
            children: cekdtl,
            badge: bddtl
          });
        });
        if (cnewHdr > 0) {
          bdHdr.push({
            type: 'primary',
            text: cnewHdr + ' New'
          });
        }
        if (cdelHdr > 0) {
          bdHdr.push({
            type: 'danger',
            text: cdelHdr + ' Deleted'
          });
        }
        lstMenuDetail.push({
          id: 'grp' + elg.GroupIDC,
          name: elg.GroupDescC,
          typemenu: 'grp',
          children: cekHdr,
          badge: bdHdr
        });
      });
      if (typ == 'MOBILE') {
        setlsMenuDetailMF(lstMenuDetail);
      } else if (typ == 'WHM') {
        setlsMenuDetailWF(lstMenuDetail);
      }
    }
  };

  const DataGenerateTab = tab => {
    if (tab == '1') {
      if (act.substring(act.length - 1) == 'N' || act.substring(act.length - 1) == 'E') { //last char
        return (
          <>
            <div className="col-12 mt-1 pb-2 overflow-auto" style={{ height: hcb - 50 }}>
              <IsiTreeview
                data={lsMenuDetailEB}
                selection
                selectedItems={selectedItemsE}
                setSelectedItems={setselectedItemsE}
              />
            </div>
          </>
        );
      } else {
        return (
          <>
            <div className="col-12 mt-1 pb-2 overflow-auto" style={{ height: hcb - 50 }}>
              <IsiTreeview
                data={lsMenuDetailEF}
              />
            </div>
          </>
        );
      }
    } else if (tab == '2') {

      if (act.substring(act.length - 1) == 'N' || act.substring(act.length - 1) == 'E') { //last char
        return (
          <>
            <div className="col-12 mt-1 pb-2 overflow-auto" style={{ height: hcb - 50 }}>
              <IsiTreeview
                data={lsMenuDetailMB}
                selection
                selectedItems={selectedItemsM}
                setSelectedItems={setselectedItemsM}
              />
            </div>
          </>
        );
      } else {
        return (
          <>
            <div className="col-12 mt-1 pb-2 overflow-auto" style={{ height: hcb - 50 }}>
              <IsiTreeview
                data={lsMenuDetailMF}
              />
            </div>
          </>
        );
      }
    } else if (tab == '3') {

      if (act.substring(act.length - 1) == 'N' || act.substring(act.length - 1) == 'E') { //last char
        return (
          <>
            <div className="col-12 mt-1 pb-2 overflow-auto" style={{ height: hcb - 50 }}>
              <IsiTreeview
                data={lsMenuDetailWB}
                selection
                selectedItems={selectedItemsW}
                setSelectedItems={setselectedItemsW}
              />
            </div>
          </>
        );
      } else {
        return (
          <>
            <div className="col-12 mt-1 pb-2 overflow-auto" style={{ height: hcb - 50 }}>
              <IsiTreeview
                data={lsMenuDetailWF}
              />
            </div>
          </>
        );
      }
    } else if (tab == '4') {
      if (act.substring(act.length - 1) == 'N' || act.substring(act.length - 1) == 'E') { //last char
        return (
          <>

            <div className="col-12 mt-1 pb-2 overflow-auto" style={{ height: hcb - 50 }}>
              <IsiTreeview
                data={lsMenuDetailAB}
                selection
                selectedItems={selectedItemsA}
                setSelectedItems={setselectedItemsA}
              />
            </div>
          </>
        );
      } else {
        return (
          <>
            <div className="col-12 mt-1 pb-2 overflow-auto" style={{ height: hcb - 50 }}>
              <IsiTreeview
                data={lsMenuDetailAF}
              />
            </div>
          </>
        );
      }
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
      setfDepLstUsr(lgdata.KdDept);
    } catch (err) {
      ISI.PopAlertFalcon('error', 'error', err.response.data.ExceptionMessage, '');
    }
  };

  const getListMdlUsr = async (dep) => {
    try {
      //let obj = { ...Obj };
      var DTTemp = {};
      DTTemp.TypePermintaan = 'PA';

      let temp = await axios({
        url: `${link}/GetListUser`,
        method: 'POST',
        data: DTTemp,
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
          ISI.PopAlertFalcon('error', 'error', err.response.data.ExceptionMessage, '');
        });
    } catch (error) {
      ISI.PopAlertFalcon('', 'Error', error.message);
    }
  };


  const handleCheckboxChange = (value) => {
    setselectedMNCP((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };
  const ListMenu = [
    {
      Text: 'ERP',
      Value: 'E'
    },
    {
      Text: 'Mobile',
      Value: 'M'
    },
    {
      Text: 'WHM',
      Value: 'W'
    },
    {
      Text: 'APP',
      Value: 'A'
    }
  ];

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
          id: 'btnCU',
          nm: 'Copy User',
          tool: 'Copy User',
          icn: faArrowCircleRight,
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
    let pkdus = '';
    let tycpy = '';
    if (e.currentTarget) {
      pact = e.currentTarget.id;
      pkdus = e.currentTarget.name;
      tycpy = 'CPUS';
    } else {
      let ar = e.split('|');
      pact = ar[0];
      pkdus = ar[1];
      tycpy = ar[2];
    }

    if (selectedMNCP.length == 0) {
      ISI.PopAlertFalcon('Warning', 'Warning', `Silahkan pilih Menu Aplikasi yang ingin di samakan terlebih dahulu ! <br/> `, '');
    } else {
      //selectedMNCP.forEach(i => CopyTempC(pkdus, i));
      let PMNCP = '';
      selectedMNCP.forEach(i => PMNCP += `'` + i + `',`);
      PMNCP = PMNCP.substring(0, PMNCP.length - 1);
      // if (pact == 'btnCU') {
      //   CopyTempC(pkdus, PMNCP, 'CPUS');
      // } else if (pact == 'btnCS') {
      //   CopyTempC(pkdus, PMNCP, tycpy);
      // }
      CopyTempC(pkdus, PMNCP, tycpy);
      setshowlstUserCP(false);
      //GetITOADetail(kdus, act.substring(act.length - 3, act.length - 1));
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
                    {SearchParams.get('dep') != null ? 'Edit' : 'Form'} Daftar Menu
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
                        ConfITOADCancel();
                      }}
                    ></BtnMenu>
                  </Nav>
                </div>
              </div>
            </div>
            <div className="card-body p-1">
              <div className="row g-1">
                <div className={`col-12 col-lg-2 ${(!CheckDev.isMobile) ? 'ps-3' : 'px-x1'}`}>
                  <div className={`row g-1 d-flex ${act == 'VH' ? 'd-none' : ''}`}>
                    <div className="col-12 col-md-12">
                      <IsiTxt
                        label={'Nomor Dokumen'}
                        val={Obj.DocumentNumberB}
                        onchange={txtOnchange}
                        maxLength={300}
                        readonly={true}
                      ></IsiTxt>
                    </div>
                  </div>
                </div>
                <div className={`col-12 col-lg-2 ${(!CheckDev.isMobile) ? '' : 'px-x1'}`}>
                  <div className={`row g-1 d-flex ${act == 'VH' ? 'd-none' : ''}`}>
                    <div className="col-12 col-md-12">
                      <IsiTxt
                        label={'ID User'}
                        val={Obj.UserIDB}
                        onchange={txtOnchange}
                        maxLength={300}
                        readonly={true}
                      ></IsiTxt>
                    </div>
                  </div>
                </div>
                <div className={`col-12 col-lg-3 ${(!CheckDev.isMobile) ? '' : 'px-x1'}`}>
                  <div className={`row g-1 d-flex ${act == 'VH' ? 'd-none' : ''}`}>
                    <div className="col-12 col-md-12">
                      <IsiTxt
                        label={'Nama User'}
                        val={Obj.UserNMB}
                        onchange={txtOnchange}
                        maxLength={300}
                        readonly={true}
                      ></IsiTxt>
                    </div>
                  </div>
                </div>
                <div className={`col-12 col-lg-5 ${(!CheckDev.isMobile) ? 'pe-3' : 'px-x1'}`}>
                  <div className={`row g-1 d-flex ${act == 'VH' ? 'd-none' : ''}`}>
                    <div className="col-12 col-md-12">
                      <IsiTxt
                        label={'Departemen / Seksi / Unit / Golongan'}
                        val={Obj.DepartementDescB + ' / ' + Obj.SectionDescB + ' / ' + Obj.UnitDescB + ' / ' + Obj.GolonganDescB}
                        onchange={txtOnchange}
                        maxLength={300}
                        readonly={true}
                      ></IsiTxt>
                    </div>
                  </div>
                  {/* <div className="row g-1 d-flex">
                    <div className="col-12 col-md-3">
                      <IsiTxt
                        label={'Departemen'}
                        val={Obj.DepartementDescB}
                        onchange={txtOnchange}
                        maxLength={300}
                        readonly={true}
                      ></IsiTxt>
                    </div>
                    <div className="col-12 col-md-3">
                      <IsiTxt
                        label={'Section'}
                        val={Obj.SectionDescB}
                        onchange={txtOnchange}
                        maxLength={300}
                        readonly={true}
                      ></IsiTxt>
                    </div>
                    <div className="col-12 col-md-3">
                      <IsiTxt
                        label={'Unit'}
                        val={Obj.UnitDescB}
                        onchange={txtOnchange}
                        maxLength={300}
                        readonly={true}
                      ></IsiTxt>
                    </div>
                    <div className="col-12 col-md-3">
                      <IsiTxt
                        label={'Golongan'}
                        val={Obj.GolonganDescB}
                        onchange={txtOnchange}
                        maxLength={300}
                        readonly={true}
                      ></IsiTxt>
                    </div>
                  </div> */}
                </div>
                <div className="col-12">
                  {/* <div className="card ms-3 me-3" style={{ height: hcb }}>
                    <div className="card-header border-bottom border-200 ps-1 pe-1 pt-1 pb-1 bg-body-tertiary">
                      <div className="row ">
                        <div className="col pt-1">
                          <h5 className="mb-0 fs--2">List of Access Menu</h5>
                        </div>
                      </div>
                    </div> */}

                  <div className="card-body p-0" style={{ height: hcb }}>
                    <div className="pt-0 px-x1 ask-analytics">
                      {/* <div className="row g-1">
                        <div className="col-lg-12"> */}
                      <IsiTabs
                        listTabs={[
                          { Id: 'Tab1', Text: 'ERP', TabPanel: DataGenerateTab('1'), badge: [(Obj.CountNewERP != 0 || Obj.CountDelERP != 0) ? { type: 'warning', text: Obj.CountNewERP + Obj.CountDelERP } : {}] },
                          { Id: 'Tab2', Text: 'Mobile', TabPanel: DataGenerateTab('2'), badge: [(Obj.CountNewMobile != 0 || Obj.CountDelMobile != 0) ? { type: 'warning', text: Obj.CountNewMobile + Obj.CountDelMobile } : {}] },
                          { Id: 'Tab3', Text: 'WHM', TabPanel: DataGenerateTab('3'), badge: [(Obj.CountNewWHM != 0 || Obj.CountDelWHM != 0) ? { type: 'warning', text: Obj.CountNewWHM + Obj.CountDelWHM } : {}] },
                          { Id: 'Tab4', Text: 'APP', TabPanel: DataGenerateTab('4'), badge: [(Obj.CountNewAPP != 0 || Obj.CountDelAPP != 0) ? { type: 'warning', text: Obj.CountNewAPP + Obj.CountDelAPP } : {}] }
                        ]}
                        idActiveTab={TabActiveScroll}
                        parentFunction={setTabActiveScroll}
                      ></IsiTabs>
                      {/* </div>
                      </div> */}
                    </div>
                  </div>
                  {/* </div> */}

                  {Obj.RemarkReject && Obj.Status != 'U' ? (
                    <Alert key="danger" variant="danger" show={Obj.RemarkReject} className="mt-3 ms-3 me-3">
                      Remark : {Obj.RemarkReject}
                    </Alert>
                  ) : (
                    ''
                  )}
                  {(lsSAMAprv.length != 0 && act != 'A') ? (
                    <div className="mt-3">
                      <IsiTimeline Show={lsSAMAprv.length != 0} Data={lsSAMAprv}></IsiTimeline>
                    </div>
                  ) : (
                    ''
                  )}
                </div>
                <div className="card-footer border-top border-200 ps-3 pe-1 pt-2 pb-1">
                  <Nav className="justify-content">
                    {act.substring(0, 1) != 'E' ? (
                      ''
                    ) : (
                      <>
                        <Button variant="success" size="sm" className="me-2" onClick={SaveSAM}>
                          Save
                        </Button>
                        <Button variant="warning" size="sm" className="me-2" onClick={e => {
                          setselectedMNCP([]);
                          setshowlstUserCP(true);
                        }}
                        >
                          Samakan
                        </Button>
                      </>
                    )}
                    {(act == 'S' && Obj.Status == 'U')
                      ? (
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

                    {(act == 'A' && Obj.Status == 'U')
                      ? (
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
                              ConfSAMApproval('A');
                            }}
                          >
                            Approve
                          </Button>
                        </>
                      ) : (
                        ''
                      )}
                    <Button
                      variant="secondary"
                      size="sm"
                      className="me-2"
                      onClick={e => {
                        //Delete Temp
                        ConfITOADCancel();
                      }}
                    >
                      {(act.substring(act.length - 1) != 'N') ? 'Close' : 'Cancel'}
                    </Button>
                  </Nav>
                </div>
                <Modal
                  show={showlstUserCP}
                  onHide={hidelstUserCP}
                  backdrop="static"
                  keyboard={false}
                  size="xl"
                >
                  <Modal.Header
                    className="p-0 ps-3 pe-3 bg-primary"
                    closeVariant='white' closeButton
                  >
                    <Modal.Title className="text-white">List User</Modal.Title>
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
                      <fieldset className="border p-0 rounded mt-2">
                        <legend className="reset w-auto px-2 fs-9">
                          <Form.Label className=' m-0'>
                            Menu Aplikasi :
                          </Form.Label>
                        </legend>
                        <Row className="g-2">
                          {ListMenu.map((mn) => (
                            <Col key={mn.Value} xs={6} sm={4} md={3} >
                              <IsiCheck
                                txt={mn.Text}
                                id={`cb${mn.Value}`}
                                checked={selectedMNCP.includes(mn.Value)}
                                change={() => handleCheckboxChange(mn.Value)}
                              ></IsiCheck>
                            </Col>
                          ))}
                        </Row>
                      </fieldset>
                      <div className="d-flex">
                        <GridTable
                          datas={lsmdlusr}
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
                            maxHeight: height - 400
                          }}
                        />
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer className={`p-1 ps-3 bg-light`}>
                    <Button variant="warning" size="sm" className="me-2"
                      onClick={() => {
                        handleActionLstUsr('btnCS||CPST');
                      }}
                    >
                      Samakan dengan Standard Menu
                    </Button>
                    <Button variant="secondary" size="sm" onClick={hidelstUserCP}>
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>
                {/* Modal Remark Disapprove */}
                <Modal
                  show={showremarkS}
                  onHide={hideremarkS}
                  backdrop="static"
                  keyboard={false}
                  size="lg"
                >
                  <Modal.Header className="p-0 ps-3 pe-3 bg-primary" closeVariant='white' closeButton>
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
                        if (Obj.RemarkReject == '' || Obj.RemarkReject == null) {
                          Vld = {
                            ...Vld,
                            RemarkRej: [false, 'Remark harus diisi!'],
                            Err: true
                          };
                        }
                        setValid(Vld);
                        if (!Vld.Err) ConfSAMApproval('S');//jika user create = user login maka disapprove
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
                {/* Modal Remark Reject */}
                <Modal
                  show={showremarkJ}
                  onHide={hideremarkJ}
                  backdrop="static"
                  keyboard={false}
                  size="lg"
                >
                  <Modal.Header className="p-0 ps-3 pe-3 bg-primary" closeVariant='white' closeButton>
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
                        if (Obj.RemarkReject == '' || Obj.RemarkReject == null) {
                          Vld = {
                            ...Vld,
                            RemarkRej: [false, 'Remark harus diisi!'],
                            Err: true
                          };
                        }
                        setValid(Vld);
                        if (!Vld.Err) ConfSAMApproval('J');//jika user create = user login maka disapprove
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
export default mst061_formITOAEntryDetail;
