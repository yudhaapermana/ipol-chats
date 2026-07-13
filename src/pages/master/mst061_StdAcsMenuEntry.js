import React, { useState, useEffect, useRef } from 'react';
import { Button, Row, Col, Nav, Alert } from 'react-bootstrap';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import * as ISI from 'script/ISI.js?20241219-02';
import axios from 'axios';
import { Modal } from 'react-bootstrap';
import { faSignOutAlt, faSave, faPrint, faTimes, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BtnMenu from 'components/navbar/headermenu/BtnMenu';
import IsiTxt from 'components/form/IsiTxt';
import IsiTimeline from 'components/form/IsiTimeline';
import useIsMobile from 'hooks/useIsMobile';
import { useBreakpoints } from 'hooks/useBreakpoints';
import IsiTabs from 'components/form/IsiTabs';
import IsiTreeview from 'components/form/IsiTreeview';

const mst061_StdAcsMenuEntry = () => {
  const CheckDev = useIsMobile();
  const navigate = useNavigate();
  const URL = process.env.REACT_APP_URL_API;
  const link = `${URL}api/mst061_StdAcsMenu`;
  const lgdata = JSON.parse(localStorage.getItem('userData'));
  const isrunn = useRef(false);
  const txtKeteranganAsset = useRef(null);
  const [SearchParams, setSearchParams] = useSearchParams();
  const [Obj, setObj] = useState({
    SAMDetailList: [],
    StdAcsMenuDetailListb: []
  });
  const [DepartementDesc, setDepartementDesc] = useState('');
  const [SectionDesc, setSectionDesc] = useState('');
  const [UnitDesc, setUnitDesc] = useState('');
  const [GolonganDesc, setGolonganDesc] = useState('');
  const [MenuListItemAPP, setMenuListItemAPP] = useState('');
  const [TabActiveScroll, setTabActiveScroll] = useState('Tab1');
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
  const [showtreeErp, setshowtreeErp] = useState(false);
  const hideshowtreeErp = () => setshowtreeErp(false);
  const [showtreeMobile, setshowtreeMobile] = useState(false);
  const hideshowtreeMobile = () => setshowtreeMobile(false);
  const [showtreeWhm, setshowtreeWhm] = useState(false);
  const hideshowtreeWhm = () => setshowtreeWhm(false);
  const [showtreeApp, setshowtreeApp] = useState(false);
  const hideshowtreeApp = () => setshowtreeApp(false);

  let { width, height, breakpoints } = useBreakpoints();
  let { key } = useParams();
  let { act } = useParams();
  let htabo = height;
  let hcb = height - 225;
  let PActionB = '';

  let cnewERP = 0;
  let cdelERP = 0;
  let cnewMobile = 0;
  let cdelMobile = 0;
  let cnewWHM = 0;
  let cdelWHM = 0;
  let cnewAPP = 0;
  let cdelAPP = 0;

  if (act.substring(0, 1) == 'A' || (act.substring(0, 1) == 'V' && act.substring(1, 2) == 'A')) {
    PActionB = 'A'
    htabo = htabo - 120;
    hcb = hcb - 120;
  } else if (act.substring(0, 1) == 'S' || (act.substring(0, 1) == 'V' && act.substring(1, 2) == 'S')) {
    PActionB = 'S'
    htabo = htabo - 120;
    hcb = hcb - 120;
  } else if (act == 'VH') {
    PActionB = 'N';
    hcb = hcb + 50;
  } else {
    if (lsSAMAprv.length != 0) {
      if (Obj.Status == 'U') {
        htabo = htabo - 120;
        hcb = hcb - 120;
      } else if (Obj.Status == 'S' || Obj.Status == 'J') {
        htabo = htabo - 100;
        hcb = hcb - 100;
      }
    }
    PActionB = 'N';
  }


  useEffect(() => {
    if (isrunn.current === false) {
      GetSAM(SearchParams.get('dep'), SearchParams.get('sec'), SearchParams.get('unt'), SearchParams.get('gol'));
      GetDdlDepts();
      //GetDdlList('U', '');
      GetDdlList('GE', '');
      GetDdlList('GM', '');
      GetDdlList('GW', '');
      GetDdlList('GA', '');
      let b = { ...Obj };
      if (SearchParams.get('dep')) {
        b['Departement'] = SearchParams.get('dep');
        GetDdlList('S', SearchParams.get('dep'));
      }
      if (SearchParams.get('sec')) {
        b['Section'] = SearchParams.get('sec');
        if (SearchParams.get('dep') != '') {
          GetDdlList('U', SearchParams.get('dep') + '|' + SearchParams.get('sec'));
        }
      }
      if (SearchParams.get('unt')) {
        b['Unit'] = SearchParams.get('unt');
      }
      if (SearchParams.get('gol')) {
        b['Golongan'] = SearchParams.get('gol');
      }
      setObj(b);
      return () => {
        isrunn.current = true;
      };
    }
  }, []);

  const GetDdlList = async (kd, val) => {
    try {
      var kd1 = kd;
      if (kd1.substr(0, 1) != 'G' && kd1 != 'LW') {
        kd1 = kd1.substr(0, 1);
      }
      let temp = await axios({
        url: `${link}/GetDdlList?kd=${kd1}&val=${val}`,
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
      } else if (kd == 'GE') {
        setddlGroupERP(temp.data);
      } else if (kd == 'TE') {
        setddlTitleERP(temp.data);
      } else if (kd == 'LE') {
        setddlMenuListERP(temp.data);
      } else if (kd == 'IE') {
        setddlMenuListItemERP(temp.data);
      } else if (kd == 'GM') {
        setddlGroupMobile(temp.data);
      } else if (kd == 'LM') {
        setddlMenuListMobile(temp.data);
      } else if (kd == 'GW') {
        setddlGroupWHM(temp.data);
      } else if (kd == 'LW') {
        setddlMenuListWHM(temp.data);
      } else if (kd == 'GA') {
        setddlGroupAPP(temp.data);
      } else if (kd == 'TA') {
        setddlTitleAPP(temp.data);
      } else if (kd == 'LA') {
        setddlMenuListAPP(temp.data);
      } else if (kd == 'IA') {
        setddlMenuListItemAPP(temp.data);
      }
    } catch (err) {
      ISI.PopAlertFalcon('error', 'error', err.response.data.ExceptionMessage, '');
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
      ISI.PopAlertFalcon('error', 'error', err.response.data.ExceptionMessage, '');
    }
  };

  const txtOnchange = e => {
    let b = { ...Obj };
    b[e.target.id] = e.target.value;
    setObj(b);
  };
  //End LR Event

  const GetSAM = async (dep, sec, unt, gol) => {
    let PIP = '';
    if (act == 'N' || act == 'EH' || act == 'EN') {
      PIP = lgdata.IP;
    }
    let pact = (act == 'EH' || act == 'EN') ? act.substring(0, 1) : act;

    try {
      var param = '?IP=' + PIP + '&docno=' + key + '&pact=' + pact + '&dep=' + dep + '&sec=' + sec + '&unt=' + unt + '&gol=' + gol;
      let temp = await axios({
        url: `${link}/GetSAMSummary` + param,
        method: 'GET',
        //data: obj,
        contentType: 'application/json; charset=utf-8',
        headers: {
          Keys: lgdata.UserTkn
        }
      })
        .then(response => {
          let newData = [];
          setObj(response.data);
          if (response.data.Departement != '' && response.data.Departement != null) {
            GetDdlList('S', response.data.Departement);
          }
          if ((response.data.Departement != '' && response.data.Section != '') && (response.data.Departement != null && response.data.Section != null)) {
            GetDdlList('U', `${response.data.Departement}|${response.data.Section}`);
          }
          if (dep == null) {
            dep = response.data.Departement;
          }
          if (sec == null) {
            sec = response.data.Section;
          }
          if (unt == null) {
            dep = response.data.Unit;
          }
          if (gol == null) {
            dep = response.data.Golongan;
          }

          if (response.data.AprvList) {
            setlsSAMAprv(response.data.AprvList);
          }
          if (response.data.StdAcsMenuListSummary) {
            setlsMenuDetail(response.data.StdAcsMenuListSummary);
            if ((dep != '' || sec != '' || unt != '' || gol != '')) { //Untuk set tree Front
              //setlsMenuDetailb(response.data.StdAcsMenuListSummary.filter(c => (c.DocumentNumberB != '' || ((act == 'E') ? c.DocumentNumberB == key : ''))));
              //setlsMenuDetailb(response.data.StdAcsMenuListSummary.filter(c => c.DocumentNumberB != '' && (c.Departement == dep || c.Section == sec || c.Unit == unt || c.Golongan == gol)));
              if (key != '' && key != null) {
                setlsMenuDetailb(response.data.StdAcsMenuListSummary.filter(c => c.DocumentNumberB == key && (c.Departement == dep || c.Section == sec || c.Unit == unt || c.Golongan == gol)));
                setlsMenuDetailc(response.data.StdAcsMenuListSummary.filter(c => c.DocumentNumberB != key && (c.Departement == dep || c.Section == sec || c.Unit == unt || c.Golongan == gol)));
              }
              SetTreeFront('ERP', response.data.StdAcsMenuListSummary.filter(c => c.DocumentNumberB != '' && (c.Departement == dep || c.Section == sec || c.Unit == unt || c.Golongan == gol) && c.TypeMenuB == 'ERP' && c.StatusActB != ''));
              SetTreeFront('MOBILE', response.data.StdAcsMenuListSummary.filter(c => c.DocumentNumberB != '' && (c.Departement == dep || c.Section == sec || c.Unit == unt || c.Golongan == gol) && c.TypeMenuB == 'MOBILE' && c.StatusActB != ''));
              SetTreeFront('WHM', response.data.StdAcsMenuListSummary.filter(c => c.DocumentNumberB != '' && (c.Departement == dep || c.Section == sec || c.Unit == unt || c.Golongan == gol) && c.TypeMenuB == 'WHM' && c.StatusActB != ''));
              SetTreeFront('APP', response.data.StdAcsMenuListSummary.filter(c => c.DocumentNumberB != '' && (c.Departement == dep || c.Section == sec || c.Unit == unt || c.Golongan == gol) && c.TypeMenuB == 'APP' && c.StatusActB != ''));
            }



            let lstMenuDetailE = [];
            const lsGrpE = response.data.StdAcsMenuListSummary.sort((a, b) => (a.GroupDescB > b.GroupDescB) ? 1 : ((b.GroupDescB > a.GroupDescB) ? -1 : 0))
              .filter(c => c.TypeMenuB == 'ERP').filter((obj, index, self) =>
                index === self.findIndex((t) => t.GroupIDB === obj.GroupIDB && t.GroupDescB === obj.GroupDescB)
              );
            const lsTtlE = response.data.StdAcsMenuListSummary.sort((a, b) => (a.TitleDescB > b.TitleDescB) ? 1 : ((b.TitleDescB > a.TitleDescB) ? -1 : 0))
              .filter(c => c.TypeMenuB == 'ERP').filter((obj, index, self) =>
                index === self.findIndex((t) => t.TitleIDB === obj.TitleIDB && t.GroupIDB === obj.GroupIDB)
              );
            const lsTabE = response.data.StdAcsMenuListSummary.sort((a, b) => (a.MenuTabDescB > b.MenuTabDescB) ? 1 : ((b.MenuTabDescB > a.MenuTabDescB) ? -1 : 0))
              .filter(c => c.TypeMenuB == 'ERP').filter((obj, index, self) =>
                index === self.findIndex((t) => t.MenuTabIDB === obj.MenuTabIDB && t.TitleIDB === obj.TitleIDB)
              );
            const lsHdrE = response.data.StdAcsMenuListSummary.sort((a, b) => (a.MenuHeaderDescB > b.MenuHeaderDescB) ? 1 : ((b.MenuHeaderDescB > a.MenuHeaderDescB) ? -1 : 0))
              .filter(c => c.TypeMenuB == 'ERP').filter((obj, index, self) =>
                index === self.findIndex((t) => t.MenuHeaderIDB === obj.MenuHeaderIDB && t.MenuTabIDB === obj.MenuTabIDB)
              );
            const lsDtlE = response.data.StdAcsMenuListSummary.sort((a, b) => (a.MenuDetailDescB > b.MenuDetailDescB) ? 1 : ((b.MenuDetailDescB > a.MenuDetailDescB) ? -1 : 0))
              .filter(c => c.TypeMenuB == 'ERP').filter((obj, index, self) =>
                index === self.findIndex((t) => t.MenuDetailIDB === obj.MenuDetailIDB && t.MenuHeaderIDB === obj.MenuHeaderIDB)
              );

            lsGrpE.forEach(elg => {
              let cekTtl = [];
              lsTtlE.filter(x => x.GroupIDB == elg.GroupIDB).forEach(elt => {
                let cekTab = [];
                lsTabE.filter(x => x.TitleIDB == elt.TitleIDB).forEach(elta => {
                  let cekHdr = [];
                  lsHdrE.filter(x => x.MenuTabIDB == elta.MenuTabIDB).forEach(elh => {
                    let cekdtl = [];
                    lsDtlE.filter(x => x.MenuHeaderIDB == elh.MenuHeaderIDB).forEach(eldtl => {
                      cekdtl.push({
                        id: 'dtl' + eldtl.MenuDetailIDB,
                        name: eldtl.MenuDetailDescB,
                        typemenu: 'dtl',
                      });
                    });
                    cekHdr.push({
                      id: 'hdr' + elh.MenuHeaderIDB,
                      name: elh.MenuHeaderDescB,
                      typemenu: 'hdr',
                      children: cekdtl
                    });
                  });
                  cekTab.push({
                    id: 'tab' + elta.MenuTabIDB,
                    name: elta.MenuTabDescB,
                    typemenu: 'tab',
                    children: cekHdr
                  });
                });
                cekTtl.push({
                  id: 'ttl' + elt.TitleIDB,
                  name: elt.TitleDescB,
                  typemenu: 'ttl',
                  children: cekTab
                });
              });
              lstMenuDetailE.push({
                id: 'grp' + elg.GroupIDB,
                name: elg.GroupDescB,
                typemenu: 'grp',
                children: cekTtl
              });
            });
            setlsMenuDetailEB(lstMenuDetailE);

            let lstMenuDetailM = [];
            const lsGrpM = response.data.StdAcsMenuListSummary.sort((a, b) => (a.GroupDescB > b.GroupDescB) ? 1 : ((b.GroupDescB > a.GroupDescB) ? -1 : 0))
              .filter(c => c.TypeMenuB == 'MOBILE').filter((obj, index, self) =>
                index === self.findIndex((t) => t.GroupIDB === obj.GroupIDB && t.GroupDescB === obj.GroupDescB)
              );
            const lsHdrM = response.data.StdAcsMenuListSummary.sort((a, b) => (a.MenuHeaderDescB > b.MenuHeaderDescB) ? 1 : ((b.MenuHeaderDescB > a.MenuHeaderDescB) ? -1 : 0))
              .filter(c => c.TypeMenuB == 'MOBILE').filter((obj, index, self) =>
                index === self.findIndex((t) => t.MenuHeaderIDB === obj.MenuHeaderIDB && t.MenuTabIDB === obj.MenuTabIDB)
              );
            const lsDtlM = response.data.StdAcsMenuListSummary.sort((a, b) => (a.MenuDetailDescB > b.MenuDetailDescB) ? 1 : ((b.MenuDetailDescB > a.MenuDetailDescB) ? -1 : 0))
              .filter(c => c.TypeMenuB == 'MOBILE').filter((obj, index, self) =>
                index === self.findIndex((t) => t.MenuDetailIDB === obj.MenuDetailIDB && t.MenuHeaderIDB === obj.MenuHeaderIDB)
              );

            lsGrpM.forEach(elg => {
              let cekHdr = [];
              lsHdrM.filter(x => x.GroupIDB == elg.GroupIDB).forEach(elh => {
                let cekdtl = [];
                lsDtlM.filter(x => x.MenuHeaderIDB == elh.MenuHeaderIDB).forEach(elttl => {
                  cekdtl.push({
                    id: 'dtl' + elttl.MenuDetailIDB,
                    name: elttl.MenuDetailDescB,
                    typemenu: 'dtl',
                  });
                });
                cekHdr.push({
                  id: 'hdr' + elh.MenuHeaderIDB,
                  name: elh.MenuHeaderDescB,
                  typemenu: 'hdr',
                  children: cekdtl
                });
              });
              lstMenuDetailM.push({
                id: 'grp' + elg.GroupIDB,
                name: elg.GroupDescB,
                typemenu: 'grp',
                children: cekHdr
              });
            });
            setlsMenuDetailMB(lstMenuDetailM);

            let lstMenuDetailW = [];
            const lsGrpW = response.data.StdAcsMenuListSummary.sort((a, b) => (a.GroupDescB > b.GroupDescB) ? 1 : ((b.GroupDescB > a.GroupDescB) ? -1 : 0))
              .filter(c => c.TypeMenuB == 'WHM').filter((obj, index, self) =>
                index === self.findIndex((t) => t.GroupIDB === obj.GroupIDB && t.GroupDescB === obj.GroupDescB)
              );
            const lsHdrW = response.data.StdAcsMenuListSummary.sort((a, b) => (a.MenuHeaderDescB > b.MenuHeaderDescB) ? 1 : ((b.MenuHeaderDescB > a.MenuHeaderDescB) ? -1 : 0))
              .filter(c => c.TypeMenuB == 'WHM').filter((obj, index, self) =>
                index === self.findIndex((t) => t.MenuHeaderIDB === obj.MenuHeaderIDB && t.MenuTabIDB === obj.MenuTabIDB)
              );
            const lsDtlW = response.data.StdAcsMenuListSummary.sort((a, b) => (a.MenuDetailDescB > b.MenuDetailDescB) ? 1 : ((b.MenuDetailDescB > a.MenuDetailDescB) ? -1 : 0))
              .filter(c => c.TypeMenuB == 'WHM').filter((obj, index, self) =>
                index === self.findIndex((t) => t.MenuDetailIDB === obj.MenuDetailIDB && t.MenuHeaderIDB === obj.MenuHeaderIDB)
              );

            lsGrpW.forEach(elg => {
              let cekHdr = [];
              lsHdrW.filter(x => x.GroupIDB == elg.GroupIDB).forEach(elh => {
                let cekdtl = [];
                lsDtlW.filter(x => x.MenuHeaderIDB == elh.MenuHeaderIDB).forEach(elttl => {
                  cekdtl.push({
                    id: 'dtl' + elttl.MenuDetailIDB,
                    name: elttl.MenuDetailDescB,
                    typemenu: 'dtl',
                  });
                });
                cekHdr.push({
                  id: 'hdr' + elh.MenuHeaderIDB,
                  name: elh.MenuHeaderDescB,
                  typemenu: 'hdr',
                  children: cekdtl
                });
              });
              lstMenuDetailW.push({
                id: 'grp' + elg.GroupIDB,
                name: elg.GroupDescB,
                typemenu: 'grp',
                children: cekHdr
              });
            });
            setlsMenuDetailWB(lstMenuDetailW);

            let lstMenuDetailA = [];
            const lsGrpA = response.data.StdAcsMenuListSummary.sort((a, b) => (a.GroupDescB > b.GroupDescB) ? 1 : ((b.GroupDescB > a.GroupDescB) ? -1 : 0))
              .filter(c => c.TypeMenuB == 'APP').filter((obj, index, self) =>
                index === self.findIndex((t) => t.GroupIDB === obj.GroupIDB && t.GroupDescB === obj.GroupDescB)
              );
            const lsTtlA = response.data.StdAcsMenuListSummary.sort((a, b) => (a.TitleDescB > b.TitleDescB) ? 1 : ((b.TitleDescB > a.TitleDescB) ? -1 : 0))
              .filter(c => c.TypeMenuB == 'APP').filter((obj, index, self) =>
                index === self.findIndex((t) => t.TitleIDB === obj.TitleIDB && t.GroupIDB === obj.GroupIDB)
              );
            const lsTabA = response.data.StdAcsMenuListSummary.sort((a, b) => (a.MenuTabDescB > b.MenuTabDescB) ? 1 : ((b.MenuTabDescB > a.MenuTabDescB) ? -1 : 0))
              .filter(c => c.TypeMenuB == 'APP').filter((obj, index, self) =>
                index === self.findIndex((t) => t.MenuTabIDB === obj.MenuTabIDB && t.TitleIDB === obj.TitleIDB)
              );
            const lsHdrA = response.data.StdAcsMenuListSummary.sort((a, b) => (a.MenuHeaderDescB > b.MenuHeaderDescB) ? 1 : ((b.MenuHeaderDescB > a.MenuHeaderDescB) ? -1 : 0))
              .filter(c => c.TypeMenuB == 'APP').filter((obj, index, self) =>
                index === self.findIndex((t) => t.MenuHeaderIDB === obj.MenuHeaderIDB && t.MenuTabIDB === obj.MenuTabIDB)
              );
            const lsDtlA = response.data.StdAcsMenuListSummary.sort((a, b) => (a.MenuDetailDescB > b.MenuDetailDescB) ? 1 : ((b.MenuDetailDescB > a.MenuDetailDescB) ? -1 : 0))
              .filter(c => c.TypeMenuB == 'APP').filter((obj, index, self) =>
                index === self.findIndex((t) => t.MenuDetailIDB === obj.MenuDetailIDB && t.MenuHeaderIDB === obj.MenuHeaderIDB)
              );

            lsGrpA.forEach(elg => {
              let cekTtl = [];
              lsTtlA.filter(x => x.GroupIDB == elg.GroupIDB).forEach(elt => {
                let cekTab = [];
                lsTabA.filter(x => x.TitleIDB == elt.TitleIDB).forEach(elta => {
                  let cekHdr = [];
                  lsHdrA.filter(x => x.MenuTabIDB == elta.MenuTabIDB).forEach(elh => {
                    let cekdtl = [];
                    lsDtlA.filter(x => x.MenuHeaderIDB == elh.MenuHeaderIDB).forEach(eldtl => {
                      cekdtl.push({
                        id: 'dtl' + eldtl.MenuDetailIDB,
                        name: eldtl.MenuDetailDescB,
                        typemenu: 'dtl',
                      });
                    });
                    cekHdr.push({
                      id: 'hdr' + elh.MenuHeaderIDB,
                      name: elh.MenuHeaderDescB,
                      typemenu: 'hdr',
                      children: cekdtl
                    });
                  });
                  cekTab.push({
                    id: 'tab' + elta.MenuTabIDB,
                    name: elta.MenuTabDescB,
                    typemenu: 'tab',
                    children: cekHdr
                  });
                });
                cekTtl.push({
                  id: 'ttl' + elt.TitleIDB,
                  name: elt.TitleDescB,
                  typemenu: 'ttl',
                  children: cekTab
                });
              });
              lstMenuDetailA.push({
                id: 'grp' + elg.GroupIDB,
                name: elg.GroupDescB,
                typemenu: 'grp',
                children: cekTtl
              });
            });
            setlsMenuDetailAB(lstMenuDetailA);
          }
        })
        .catch(err => {
          ISI.PopAlertFalcon('error', 'error', err.response.data.ExceptionMessage, '');
        });
    } catch (err) {
      ISI.PopAlertFalcon('error', 'error', err.response.data.ExceptionMessage, '');
    }
  };


  const SAMCheckWApp = async (dep, sec, unt, gol) => {
    try {
      var obj = {};

      let temp = await axios({
        url: `${link}/cekSAMWApp?dep=${dep}&sec=${sec}&unt=${unt}&gol=${gol}`,
        method: 'GET',
        contentType: 'application/json; charset=utf-8',
        headers: {
          Keys: lgdata.UserTkn
        }
      });
      if (temp.data != '') {
        let ar = temp.data.split('|');
        ISI.PopAlertFalcon('Warning', 'Warning', `Standard Access Menu dengan kombinasi <br/> Departemen : ${ar[1]}<br/> Section : ${ar[2]}<br/> Unit : ${ar[3]}<br/> Golongan : ${ar[4]}<br/><br/> Saat ini sedang waiting approve,<br/> dengan nomor dokumen : ${ar[0]},<br/> mohon menunggu hingga approval selesai, untuk merubah Standard Access Menu yang baru.`, '');
      } else {
        ISI.confirmISI({
          title: 'Konfirmasi',
          msg: `Simpan Form Standard Access Menu ?`,
          yesText: 'Yes',
          yesAction: () => {
            SAMSave();
          },
          noText: 'No',
          noAction: () => { }
        });
      }
    } catch (err) {
      ISI.PopAlertFalcon('error', 'error', err.response.data.ExceptionMessage, '');
    }
  };

  const SAMCancel = async () => {
    try {
      var obj = { ...Obj }
      obj.CreatedBy = lgdata.UserId;
      obj.CreatedIP = lgdata.IP;
      obj.ProsesId = 'CancelSAM';
      obj.DocumentNumber = key;

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
        if (act.substring(act.length - 1) == 'H') {
          navigate(`/master/mst061_StdAcsMenuListHeader/${PActionB}?param=${SearchParams.get('param')}`);
        } else if (act.substring(act.length - 1) == 'N') {
          navigate(`/master/mst061_StdAcsMenuList/${PActionB}?param=${SearchParams.get('param')}`);
        } else {
          navigate(`/master/mst061_StdAcsMenuListHeader/${PActionB}?param=${SearchParams.get('param')}`);
        }
      }
    } catch (error) {
      ISI.PopAlertFalcon('error', 'error', error.response.message, '');
    }
  };

  const SAMSave = async () => {
    try {
      // let mdb = lsMenuDetailb.map(car => car.MenuDetailIDB);
      // lsMenuDetailc.filter(i => !mdb.includes(i.MenuDetailIDB)).forEach(eldtl => {
      //   InsTempB(eldtl);
      // });
      var obj = {};
      obj.Ket1 = '';
      obj.CreatedBy = lgdata.UserId;
      obj.CreatedIP = lgdata.IP;
      obj.DepUserLogin = lgdata.KdDept;
      obj.StdAcsMenuDetailListb = lsMenuDetailb;
      obj.ProsesId = 'SaveSAM';
      obj.DepartementDesc = DepartementDesc;
      obj.SectionDesc = SectionDesc;
      obj.UnitDesc = UnitDesc;
      obj.GolonganDesc = GolonganDesc;
      obj.DocumentNumber = key;

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
        if (act.substring(act.length - 1) == 'H') {
          navigate(`/master/mst061_StdAcsMenuListHeader/${PActionB}?param=${SearchParams.get('param')}`);
        } else if (act.substring(act.length - 1) == 'N') {
          navigate(`/master/mst061_StdAcsMenuList/${PActionB}?param=${SearchParams.get('param')}`);
        } else {
          navigate(`/master/mst061_StdAcsMenuListHeader/${PActionB}?param=${SearchParams.get('param')}`);
        }
      }
    } catch (error) {
      ISI.PopAlertFalcon('error', 'error', error.response.data.ExceptionMessage, '');
    }
  };

  const SAMApproval = async pact => {
    try {
      let obj = { ...Obj };
      obj.UpdatedBy = lgdata.UserId;
      obj.UpdatedIP = lgdata.IP;
      obj.NIKLogin = lgdata.NIK;
      obj.StdAcsMenuDetailListb = lsMenuDetailb;
      obj.ProsesId = pact == 'A' ? 'AppSAM' : pact == 'J' ? 'RejSAM' : 'DisAppSAM';
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
          ISI.PopAlertFalcon('error', 'error', err.response.data.ExceptionMessage, '');
        });
    } catch (err) {
      ISI.PopAlertFalcon('error', 'error', err.response.data.ExceptionMessage, '');
    }
  };

  const SAMUpdTempA = async (Departement, Section, Unit, Golongan) => {
    try {
      var obj = { ...Obj };
      obj.ProsesId = 'UpdTempA';
      obj.UpdatedBy = lgdata.UserId;
      obj.UpdatedIP = lgdata.IP;
      obj.Departement = Departement;
      obj.Section = Section;
      obj.Unit = Unit;
      obj.Golongan = Golongan;
      obj.DocumentNumber = key;

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
      GetSAM(res.Departement, res.Section, res.Unit, res.Golongan);

      if (res.Ket1) {
        ISI.PopAlertFalcon('Warning', 'Warning', res.Ket1);
      }
    } catch (error) {
      ISI.PopAlertFalcon('error', 'error', error.response.data.ExceptionMessage, '');
    }
  };

  const InsTempB = async Obj => {
    try {
      Obj.ProsesId = 'InsTempB';
      Obj.UpdatedByB = lgdata.UserId;
      Obj.UpdatedIPB = lgdata.IP;
      Obj.DocumentNumberB = key;
      let temp = await axios({
        url: `${link}/Post`,
        method: 'POST',
        data: Obj,
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
      ISI.PopAlertFalcon('error', 'error', error.response.data.ExceptionMessage, '');
    }
  };

  const DelTempB = async (typ, arrc) => {
    try {
      Obj.ProsesId = 'DelTempB';
      Obj.UpdatedByB = lgdata.UserId;
      Obj.UpdatedIPB = lgdata.IP;
      Obj.TypeMenuB = typ;
      Obj.DocumentNumberB = key;
      let temp = await axios({
        url: `${link}/Post`,
        method: 'POST',
        data: Obj,
        contentType: 'application/json; charset=utf-8',
        headers: {
          Keys: lgdata.UserTkn
        }
      });

      var res = (await temp).data;
      SaveTreeFront(typ, arrc);

      if (res.Ket1) {
        ISI.PopAlertFalcon('Warning', 'Warning', res.Ket1);
      }
    } catch (error) {
      ISI.PopAlertFalcon('error', 'error', error.response.data.ExceptionMessage, '');
    }
  };

  const ConfSAMCancel = async () => {
    if (act.substring(0, 1) != 'E') {
      if (act.substring(act.length - 1) == 'H') {
        navigate(`/master/mst061_StdAcsMenuListHeader/${PActionB}?param=${SearchParams.get('param')}`);
      } else if (act.substring(act.length - 1) == 'N') {
        navigate(`/master/mst061_StdAcsMenuList/${PActionB}?param=${SearchParams.get('param')}`);
      } else {
        navigate(`/master/mst061_StdAcsMenuListHeader/${PActionB}?param=${SearchParams.get('param')}`);
      }
    } else {
      ISI.confirmISI({
        title: 'Konfirmasi',
        msg: 'Cancel Input Standard Access Menu ?',
        yesText: 'Yes',
        yesAction: () => {
          SAMCancel();
        },
        noText: 'No',
        noAction: () => { }
      });
    }
  };

  const ConfSAMApproval = async pact => {
    ISI.confirmISI({
      title: 'Konfirmasi',
      msg: `Are you sure want to ${pact == 'A' ? 'Approve' : pact == 'J' ? 'Reject' : 'Disapprove'} this data?`,
      yesText: 'Yes',
      yesAction: () => {
        SAMApproval(pact);
      },
      noText: 'No',
      noAction: () => { }
    });
  };

  const SaveSAM = async () => {
    try {
      setValid(defaultValidation);
      let Vld = { ...defaultValidation };
      if (Obj.Departement == '') {
        Vld = {
          ...Vld,
          DepartementA: [false, 'Departement harus dipilih'],
          error: true
        };
      }
      // if (Obj.Section == '') {
      //   Vld = {
      //     ...Vld,
      //     SectionA: [false, 'Section harus dipilih'],
      //     error: true
      //   };
      // }
      // if (Obj.Unit == '') {
      //   Vld = {
      //     ...Vld,
      //     UnitA: [false, 'Unit harus dipilih'],
      //     error: true
      //   };
      // }
      if (Obj.Golongan == '') {
        Vld = {
          ...Vld,
          GolonganA: [false, 'Golongan harus dipilih'],
          error: true
        };
      }
      setValid(Vld);
      if (lsMenuDetailb.length == 0) {
        ISI.PopAlertFalcon('Warning', 'Warning', 'Mohon Pilih setidaknya satu Menu', '');
      } else {
        if (!Vld.error) {
          SAMCheckWApp(Obj.Departement, Obj.Section, Obj.Unit, Obj.Golongan);
        }
      }
    } catch (err) {
      ISI.PopAlertFalcon('error', 'error', err.response.data.ExceptionMessage, '');
    }
  };

  const SetTreeFront = async (type, list) => {
    let arrTreedetail = [];
    let lstTreeFront = [];
    if (type == 'ERP' || type == 'APP') {
      const lsGrpA = list.sort((a, b) => (a.GroupDescB > b.GroupDescB) ? 1 : ((b.GroupDescB > a.GroupDescB) ? -1 : 0)).filter((obj, index, self) =>
        index === self.findIndex((t) => t.GroupIDB === obj.GroupIDB && t.GroupDescB === obj.GroupDescB)
      );
      const lsTtlA = list.sort((a, b) => (a.TitleDescB > b.TitleDescB) ? 1 : ((b.TitleDescB > a.TitleDescB) ? -1 : 0)).filter((obj, index, self) =>
        index === self.findIndex((t) => t.TitleIDB === obj.TitleIDB && t.GroupIDB === obj.GroupIDB)
      );
      const lsTabA = list.sort((a, b) => (a.MenuTabDescB > b.MenuTabDescB) ? 1 : ((b.MenuTabDescB > a.MenuTabDescB) ? -1 : 0)).filter((obj, index, self) =>
        index === self.findIndex((t) => t.MenuTabIDB === obj.MenuTabIDB && t.TitleIDB === obj.TitleIDB)
      );
      const lsHdrA = list.sort((a, b) => (a.MenuHeaderDescB > b.MenuHeaderDescB) ? 1 : ((b.MenuHeaderDescB > a.MenuHeaderDescB) ? -1 : 0)).filter((obj, index, self) =>
        index === self.findIndex((t) => t.MenuHeaderIDB === obj.MenuHeaderIDB && t.MenuTabIDB === obj.MenuTabIDB)
      );
      const lsDtlA = list.sort((a, b) => (a.DocumentNumberB < b.DocumentNumberB) ? 1 : ((b.DocumentNumberB < a.DocumentNumberB) ? -1 : 0))
        .sort((a, b) => (a.MenuDetailDescB > b.MenuDetailDescB) ? 1 : ((b.MenuDetailDescB > a.MenuDetailDescB) ? -1 : 0)).filter((obj, index, self) =>
          index === self.findIndex((t) => t.MenuDetailIDB === obj.MenuDetailIDB && t.MenuHeaderIDB === obj.MenuHeaderIDB)
        );
      var medel = lsDtlA.filter(c => c.StatusActB == 'D').map(car => 'dtl' + car.MenuDetailIDB);

      lsGrpA.forEach(elg => {
        let cekTtlAS = [];
        let bdTtlAS = [];
        let cnewTtlAS = 0;
        let cdelTtlAS = 0;
        lsTtlA.filter(x => x.GroupIDB == elg.GroupIDB).forEach(elt => {
          let cekTabAS = [];
          let bdTabAS = [];
          let cnewTabAS = 0;
          let cdelTabAS = 0;
          lsTabA.filter(x => x.TitleIDB == elt.TitleIDB).forEach(elta => {
            let cekHdrAS = [];
            let bdHdrAS = [];
            let cnewHdrAS = 0;
            let cdelHdrAS = 0;
            lsHdrA.filter(x => x.MenuTabIDB == elta.MenuTabIDB).forEach(elh => {
              let cekdtlAS = [];
              let bddtlAS = [];
              let cnewdtlAS = 0;
              let cdeldtlAS = 0;
              lsDtlA.filter(x => x.MenuHeaderIDB == elh.MenuHeaderIDB).forEach(eldtl => {
                // if (act != 'VH') {
                cekdtlAS.push({
                  id: 'dtl' + eldtl.MenuDetailIDB,
                  name: eldtl.MenuDetailDescB + ((eldtl.StatusActB == 'E') ? ` (${eldtl.DocumentNumberB})` : ''),
                  typemenu: 'dtl',
                  badge: [((eldtl.StatusActB == 'N') ? { type: 'primary', text: 'New' } : (eldtl.StatusActB == 'D') ? { type: 'danger', text: 'Deleted' } : {})],
                  style: { color: ((eldtl.StatusActB == 'N') ? '#3498db' : (eldtl.StatusActB == 'D') ? '#e74c3c' : '') },
                  del: ((eldtl.StatusActB == 'D') ? true : false)
                });
                if (eldtl.StatusActB == 'N') {
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
                } else if (eldtl.StatusActB == 'D') {
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
                //     id: 'dtl' + eldtl.MenuDetailIDB,
                //     name: eldtl.MenuDetailDescB + ` (${eldtl.DocumentNumberB})`,
                //     typemenu: 'dtl',
                //   });
                // }
                arrTreedetail.push('dtl' + eldtl.MenuDetailIDB);
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
                id: 'hdr' + elh.MenuHeaderIDB,
                name: elh.MenuHeaderDescB,
                typemenu: 'hdr',
                children: cekdtlAS,
                badge: bddtlAS
              });
              arrTreedetail.push('hdr' + elh.MenuHeaderIDB);
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
              id: 'tab' + elta.MenuTabIDB,
              name: elta.MenuTabDescB,
              typemenu: 'tab',
              children: cekHdrAS,
              badge: bdHdrAS
            });
            arrTreedetail.push('tab' + elta.MenuTabIDB);
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
            id: 'ttl' + elt.TitleIDB,
            name: elt.TitleDescB,
            typemenu: 'ttl',
            children: cekTabAS,
            badge: bdTabAS
          });
          arrTreedetail.push('ttl' + elt.TitleIDB);
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
          id: 'grp' + elg.GroupIDB,
          name: elg.GroupDescB,
          typemenu: 'grp',
          children: cekTtlAS,
          badge: bdTtlAS
        });
        arrTreedetail.push('grp' + elg.GroupIDB);
      });
      if (type == 'APP') {
        setlsMenuDetailAF(lstTreeFront);
        setselectedItemsA(arrTreedetail.filter(name => !medel.includes(name)));
        setselectedItemsAE(arrTreedetail);
      } else if (type == 'ERP') {
        setlsMenuDetailEF(lstTreeFront);
        setselectedItemsE(arrTreedetail.filter(name => !medel.includes(name)));
        setselectedItemsEE(arrTreedetail);
      }

    }
    if (type == 'MOBILE' || type == 'WHM') {
      const lsGrp = list.sort((a, b) => (a.GroupDescB > b.GroupDescB) ? 1 : ((b.GroupDescB > a.GroupDescB) ? -1 : 0)).filter((obj, index, self) =>
        index === self.findIndex((t) => t.GroupIDB === obj.GroupIDB && t.GroupDescB === obj.GroupDescB)
      );
      const lsHdr = list.sort((a, b) => (a.MenuHeaderDescB > b.MenuHeaderDescB) ? 1 : ((b.MenuHeaderDescB > a.MenuHeaderDescB) ? -1 : 0)).filter((obj, index, self) =>
        index === self.findIndex((t) => t.MenuHeaderIDB === obj.MenuHeaderIDB && t.MenuTabIDB === obj.MenuTabIDB)
      );
      const lsDtl = list.sort((a, b) => (a.DocumentNumberB < b.DocumentNumberB) ? 1 : ((b.DocumentNumberB < a.DocumentNumberB) ? -1 : 0))
        .sort((a, b) => (a.MenuDetailDescB > b.MenuDetailDescB) ? 1 : ((b.MenuDetailDescB > a.MenuDetailDescB) ? -1 : 0)).filter((obj, index, self) =>
          index === self.findIndex((t) => t.MenuDetailIDB === obj.MenuDetailIDB && t.MenuHeaderIDB === obj.MenuHeaderIDB)
        );

      var medel = lsDtl.filter(c => c.StatusActB == 'D').map(car => 'dtl' + car.MenuDetailIDB);

      lsGrp.forEach(elg => {
        let cekHdr = [];
        let bdHdr = [];
        let cnewHdr = 0;
        let cdelHdr = 0;
        lsHdr.filter(x => x.GroupIDB == elg.GroupIDB).forEach(elh => {
          let cekdtl = [];
          let bddtl = [];
          let cnewdtl = 0;
          let cdeldtl = 0;
          lsDtl.filter(x => x.MenuHeaderIDB == elh.MenuHeaderIDB).forEach(eldtl => {
            // if (act != 'VH') {
            cekdtl.push({
              id: 'dtl' + eldtl.MenuDetailIDB,
              name: eldtl.MenuDetailDescB + ((eldtl.StatusActB == 'E') ? ` (${eldtl.DocumentNumberB})` : ''),
              typemenu: 'dtl',
              badge: [((eldtl.StatusActB == 'N') ? { type: 'primary', text: 'New' } : (eldtl.StatusActB == 'D') ? { type: 'danger', text: 'Deleted' } : {})],
              style: { color: ((eldtl.StatusActB == 'N') ? '#3498db' : (eldtl.StatusActB == 'D') ? '#e74c3c' : '') },
              del: ((eldtl.StatusActB == 'D') ? true : false)
            });
            if (eldtl.StatusActB == 'N') {
              if (type == 'MOBILE') {
                cnewMobile = cnewMobile++;
                Obj.CountNewMobile = cnewMobile;
              } else if (type == 'WHM') {
                cnewWHM = cnewWHM++;
                Obj.CountNewWHM = cnewWHM;
              }
              cnewHdr++;
              cnewdtl++;
            } else if (eldtl.StatusActB == 'D') {
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
            //   //     id: 'dtl' + eldtl.MenuDetailIDB,
            //   //     name: eldtl.MenuDetailDescB + ` (${eldtl.DocumentNumberB})`,
            //   //     typemenu: 'dtl',
            //   //   });
            // }
            arrTreedetail.push('dtl' + eldtl.MenuDetailIDB);
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
            id: 'hdr' + elh.MenuHeaderIDB,
            name: elh.MenuHeaderDescB,
            typemenu: 'hdr',
            children: cekdtl,
            badge: bddtl
          });
          arrTreedetail.push('hdr' + elh.MenuHeaderIDB);
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
          id: 'grp' + elg.GroupIDB,
          name: elg.GroupDescB,
          typemenu: 'grp',
          children: cekHdr,
          badge: bdHdr
        });
        arrTreedetail.push('grp' + elg.GroupIDB);
      });
      if (type == 'MOBILE') {
        setlsMenuDetailMF(lstTreeFront);
        setselectedItemsM(arrTreedetail.filter(name => !medel.includes(name)));
        setselectedItemsME(arrTreedetail);
      } else if (type == 'WHM') {
        setlsMenuDetailWF(lstTreeFront);
        setselectedItemsW(arrTreedetail.filter(name => !medel.includes(name)));
        setselectedItemsWE(arrTreedetail);
      }
    }

  };

  const SaveTreeFront = async (typ, arrc) => { //Sebelum melakukan Save, Delete temporary terlebih dahulu
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

    // let mdb = lsMenuDetailb.map(car => car.MenuDetailIDB);
    // lsMenuDetailc.filter(i => !mdb.includes(i.MenuDetailIDB)).forEach(eldtl => {
    //   InsTempB(eldtl);
    // });var 
    var lsdtltrs = lstMenuSelected.filter(name => name.includes('dtl')); // List di selected oleh user
    for (var i = 0; i < lsdtltrs.length; i++) {
      lsdtltrs[i] = lsdtltrs[i].replace('dtl', '');
    }
    var lsdtltre = lstMenuExisting.filter(name => name.includes('dtl')); // List yang terselect sebelumnnya
    for (var i = 0; i < lsdtltre.length; i++) {
      lsdtltre[i] = lsdtltre[i].replace('dtl', '');
    }
    var delexn = lsMenuDetail.filter(c => c.StatusActB == 'N' && lsdtltre.includes(c.MenuDetailIDB) && !lsdtltrs.includes(c.MenuDetailIDB)).map(car => 'dtl' + car.MenuDetailIDB); // untuk membatasi existing yang new kemudian delete

    var lsdtltr = arrc.filter(name => name.includes('dtl') && !delexn.includes(name));
    for (var i = 0; i < lsdtltr.length; i++) {
      lsdtltr[i] = lsdtltr[i].replace('dtl', '');
    }


    if (typ == 'ERP' || typ == 'APP') {
      let lstMenuDetail = [];
      const lsGrp = lsMenuDetail.sort((a, b) => (a.GroupDescB > b.GroupDescB) ? 1 : ((b.GroupDescB > a.GroupDescB) ? -1 : 0))
        .filter(c => c.TypeMenuB == typ && lsdtltr.includes(c.MenuDetailIDB)).filter((obj, index, self) =>
          index === self.findIndex((t) => t.GroupIDB === obj.GroupIDB && t.GroupDescB === obj.GroupDescB)
        );
      const lsTtl = lsMenuDetail.sort((a, b) => (a.TitleDescB > b.TitleDescB) ? 1 : ((b.TitleDescB > a.TitleDescB) ? -1 : 0))
        .filter(c => c.TypeMenuB == typ && lsdtltr.includes(c.MenuDetailIDB)).filter((obj, index, self) =>
          index === self.findIndex((t) => t.TitleIDB === obj.TitleIDB && t.GroupIDB === obj.GroupIDB)
        );
      const lsTab = lsMenuDetail.sort((a, b) => (a.MenuTabDescB > b.MenuTabDescB) ? 1 : ((b.MenuTabDescB > a.MenuTabDescB) ? -1 : 0))
        .filter(c => c.TypeMenuB == typ && lsdtltr.includes(c.MenuDetailIDB)).filter((obj, index, self) =>
          index === self.findIndex((t) => t.MenuTabIDB === obj.MenuTabIDB && t.TitleIDB === obj.TitleIDB)
        );
      const lsHdr = lsMenuDetail.sort((a, b) => (a.MenuHeaderDescB > b.MenuHeaderDescB) ? 1 : ((b.MenuHeaderDescB > a.MenuHeaderDescB) ? -1 : 0))
        .filter(c => c.TypeMenuB == typ && lsdtltr.includes(c.MenuDetailIDB)).filter((obj, index, self) =>
          index === self.findIndex((t) => t.MenuHeaderIDB === obj.MenuHeaderIDB && t.MenuTabIDB === obj.MenuTabIDB)
        );
      // const lsDtl = lsMenuDetail.filter(c => c.TypeMenuB == typ && lsdtltr.includes(c.MenuDetailIDB)).filter((obj, index, self) =>
      //   index === self.findIndex((t) => t.MenuDetailIDB === obj.MenuDetailIDB && t.MenuHeaderIDB === obj.MenuHeaderIDB)
      // );
      const lsDtl = lsMenuDetail.sort((a, b) => (a.DocumentNumberB < b.DocumentNumberB) ? 1 : ((b.DocumentNumberB < a.DocumentNumberB) ? -1 : 0))
        .sort((a, b) => (a.MenuDetailDescB > b.MenuDetailDescB) ? 1 : ((b.MenuDetailDescB > a.MenuDetailDescB) ? -1 : 0))
        .filter(c => c.TypeMenuB == typ && (lsdtltr.includes(c.MenuDetailIDB) || c.StatusActB == 'D'))
        .filter((obj, index, self) => index === self.findIndex((t) => t.MenuDetailIDB === obj.MenuDetailIDB && t.MenuHeaderIDB === obj.MenuHeaderIDB));

      console.log(lsMenuDetail.filter(c => c.MenuDetailIDB == 782));

      lsGrp.forEach(elg => {
        let cekTtl = [];
        let bdTtl = [];
        let cnewTtl = 0;
        let cdelTtl = 0;
        lsTtl.filter(x => x.GroupIDB == elg.GroupIDB).forEach(elt => {
          let cekTab = [];
          let bdTab = [];
          let cnewTab = 0;
          let cdelTab = 0;
          lsTab.filter(x => x.TitleIDB == elt.TitleIDB).forEach(elta => {
            let cekHdr = [];
            let bdHdr = [];
            let cnewHdr = 0;
            let cdelHdr = 0;
            lsHdr.filter(x => x.MenuTabIDB == elta.MenuTabIDB).forEach(elh => {
              let cekdtl = [];
              let bddtl = [];
              let cnewdtl = 0;
              let cdeldtl = 0;
              // == -1 (Tidak ada) != -1 (ada)
              lsDtl.filter(x => x.MenuHeaderIDB == elh.MenuHeaderIDB && x.MenuHeaderDescB == elh.MenuHeaderDescB).forEach(eldtl => {
                if ((lstMenuSelected.indexOf('dtl' + eldtl.MenuDetailIDB) != -1 && lstMenuExisting.indexOf('dtl' + eldtl.MenuDetailIDB) != -1) && (eldtl.StatusActB == 'E' || eldtl.StatusActB == 'D')) {
                  eldtl.StatusActB = 'E';
                  cekdtl.push({
                    id: 'dtl' + eldtl.MenuDetailIDB,
                    name: eldtl.MenuDetailDescB + ` (${eldtl.DocumentNumberEB})`,
                    typemenu: 'dtl',
                  });
                } else if ((lstMenuSelected.indexOf('dtl' + eldtl.MenuDetailIDB) != -1 && lstMenuExisting.indexOf('dtl' + eldtl.MenuDetailIDB) == -1) || eldtl.StatusActB == 'N') {
                  eldtl.StatusActB = 'N';
                  cekdtl.push({
                    id: 'dtl' + eldtl.MenuDetailIDB,
                    name: eldtl.MenuDetailDescB,
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
                } else if ((lstMenuSelected.indexOf('dtl' + eldtl.MenuDetailIDB) == -1 && lstMenuExisting.indexOf('dtl' + eldtl.MenuDetailIDB) != -1) || eldtl.StatusActB == 'D') {
                  eldtl.StatusActB = 'D';
                  cekdtl.push({
                    id: 'dtl' + eldtl.MenuDetailIDB,
                    name: eldtl.MenuDetailDescB,
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
                }
                InsTempB(eldtl);
                lsMenuDetailb.push(eldtl);
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
                id: 'hdr' + elh.MenuHeaderIDB,
                name: elh.MenuHeaderDescB,
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
              id: 'tab' + elta.MenuTabIDB,
              name: elta.MenuTabDescB,
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
            id: 'ttl' + elt.TitleIDB,
            name: elt.TitleDescB,
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
          id: 'grp' + elg.GroupIDB,
          name: elg.GroupDescB,
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
      const lsGrp = lsMenuDetail.sort((a, b) => (a.GroupDescB > b.GroupDescB) ? 1 : ((b.GroupDescB > a.GroupDescB) ? -1 : 0))
        .filter(c => c.TypeMenuB == typ && lsdtltr.includes(c.MenuDetailIDB)).filter((obj, index, self) =>
          index === self.findIndex((t) => t.GroupIDB === obj.GroupIDB && t.GroupDescB === obj.GroupDescB)
        );
      const lsHdr = lsMenuDetail.sort((a, b) => (a.MenuHeaderDescB > b.MenuHeaderDescB) ? 1 : ((b.MenuHeaderDescB > a.MenuHeaderDescB) ? -1 : 0))
        .filter(c => c.TypeMenuB == typ && lsdtltr.includes(c.MenuDetailIDB)).filter((obj, index, self) =>
          index === self.findIndex((t) => t.MenuHeaderIDB === obj.MenuHeaderIDB && t.MenuTabIDB === obj.MenuTabIDB)
        );
      // const lsDtl = lsMenuDetail.sort((a, b) => (a.MenuDetailDescB > b.MenuDetailDescB) ? 1 : ((b.MenuDetailDescB > a.MenuDetailDescB) ? -1 : 0))
      //   .filter(c => c.TypeMenuB == typ && lsdtltr.includes(c.MenuDetailIDB)).filter((obj, index, self) =>
      //     index === self.findIndex((t) => t.MenuDetailIDB === obj.MenuDetailIDB && t.MenuHeaderIDB === obj.MenuHeaderIDB)
      //   );
      const lsDtl = lsMenuDetail.sort((a, b) => (a.DocumentNumberB < b.DocumentNumberB) ? 1 : ((b.DocumentNumberB < a.DocumentNumberB) ? -1 : 0))
        .sort((a, b) => (a.MenuDetailDescB > b.MenuDetailDescB) ? 1 : ((b.MenuDetailDescB > a.MenuDetailDescB) ? -1 : 0))
        .filter(c => c.TypeMenuB == typ && (lsdtltr.includes(c.MenuDetailIDB) || c.StatusActB == 'D'))
        .filter((obj, index, self) => index === self.findIndex((t) => t.MenuDetailIDB === obj.MenuDetailIDB && t.MenuHeaderIDB === obj.MenuHeaderIDB));

      lsGrp.forEach(elg => {
        let cekHdr = [];
        let bdHdr = [];
        let cnewHdr = 0;
        let cdelHdr = 0;
        lsHdr.filter(x => x.GroupIDB == elg.GroupIDB).forEach(elh => {
          let cekdtl = [];
          let bddtl = [];
          let cnewdtl = 0;
          let cdeldtl = 0;
          // == -1 (Tidak ada) != -1 (ada)
          lsDtl.filter(x => x.MenuHeaderIDB == elh.MenuHeaderIDB && x.MenuHeaderDescB == elh.MenuHeaderDescB).forEach(eldtl => {
            if ((lstMenuSelected.indexOf('dtl' + eldtl.MenuDetailIDB) != -1 && lstMenuExisting.indexOf('dtl' + eldtl.MenuDetailIDB) != -1) && (eldtl.StatusActB == 'E' || eldtl.StatusActB == 'D')) {
              eldtl.StatusActB = 'E';
              cekdtl.push({
                id: 'dtl' + eldtl.MenuDetailIDB,
                name: eldtl.MenuDetailDescB + ` (${eldtl.DocumentNumberEB})`,
                typemenu: 'dtl',
              });
            } else if ((lstMenuSelected.indexOf('dtl' + eldtl.MenuDetailIDB) != -1 && lstMenuExisting.indexOf('dtl' + eldtl.MenuDetailIDB) == -1) || eldtl.StatusActB == 'N') {
              eldtl.StatusActB = 'N';
              cekdtl.push({
                id: 'dtl' + eldtl.MenuDetailIDB,
                name: eldtl.MenuDetailDescB,
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
            } else if ((lstMenuSelected.indexOf('dtl' + eldtl.MenuDetailIDB) == -1 && lstMenuExisting.indexOf('dtl' + eldtl.MenuDetailIDB) != -1) || eldtl.StatusActB == 'D') {
              eldtl.StatusActB = 'D';
              cekdtl.push({
                id: 'dtl' + eldtl.MenuDetailIDB,
                name: eldtl.MenuDetailDescB,
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
            }
            InsTempB(eldtl);
            lsMenuDetailb.push(eldtl);
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
            id: 'hdr' + elh.MenuHeaderIDB,
            name: elh.MenuHeaderDescB,
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
          id: 'grp' + elg.GroupIDB,
          name: elg.GroupDescB,
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
      return (
        <>
          <div className="col-lg-12">
            <div className="row">
              <div className="col-12">
                <Nav className="justify-content-end">
                  {act.substring(0, 1) != 'E' ? (
                    ''
                  ) : (
                    <button
                      className="btn btn-link pt-1 pb-0 ps-2 pe-1 "
                      type="button"
                      style={{
                        position: 'fixed',
                        bottom: `${height - (!CheckDev.isMobile ? 210 : 600)}px`,
                        left: `${width - 100}px`
                      }}
                      onClick={e => setshowtreeErp(true)}
                    >
                      <div className="border border-primary border-2 rounded-circle p-2 d-flex align-items-center justify-content-center">
                        <FontAwesomeIcon
                          icon={faPlus}
                          className={`text-primary fs-${breakpoints.up('md') ? 9 : 11}`}
                        />
                      </div>
                    </button>
                  )}
                </Nav>
              </div>
            </div>
          </div>
          <div className="col-11 mt-1 pb-2 overflow-auto" style={{ height: hcb - 50 }}>
            <IsiTreeview
              data={lsMenuDetailEF}
            />
          </div>
        </>
      );
    } else if (tab == '2') {
      return (
        <>
          <div className="col-lg-12">
            <div className="row">
              <div className="col-12">
                <Nav className="justify-content-end">
                  {act.substring(0, 1) != 'E' ? (
                    ''
                  ) : (
                    <button
                      className="btn btn-link pt-1 pb-0 ps-2 pe-1 "
                      type="button"
                      style={{
                        position: 'fixed',
                        bottom: `${height - (!CheckDev.isMobile ? 210 : 600)}px`,
                        left: `${width - 100}px`
                      }}
                      onClick={e => setshowtreeMobile(true)}
                    >
                      <div className="border border-primary border-2 rounded-circle p-2 d-flex align-items-center justify-content-center">
                        <FontAwesomeIcon
                          icon={faPlus}
                          className={`text-primary fs-${breakpoints.up('md') ? 9 : 11}`}
                        />
                      </div>
                    </button>
                  )}
                </Nav>
              </div>
            </div>
          </div>
          <div className="col-11 mt-1 pb-2 overflow-auto" style={{ height: hcb - 50 }}>
            <IsiTreeview
              data={lsMenuDetailMF}
            />
          </div>
        </>
      );
    } else if (tab == '3') {
      return (
        <>
          <div className="col-lg-12">
            <div className="row">
              <div className="col-12">
                <Nav className="justify-content-end">
                  {act.substring(0, 1) != 'E' ? (
                    ''
                  ) : (
                    <button
                      className="btn btn-link pt-1 pb-0 ps-2 pe-1 "
                      type="button"
                      style={{
                        position: 'fixed',
                        bottom: `${height - (!CheckDev.isMobile ? 210 : 600)}px`,
                        left: `${width - 100}px`
                      }}
                      onClick={e => setshowtreeWhm(true)}
                    >
                      <div className="border border-primary border-2 rounded-circle p-2 d-flex align-items-center justify-content-center">
                        <FontAwesomeIcon
                          icon={faPlus}
                          className={`text-primary fs-${breakpoints.up('md') ? 9 : 11}`}
                        />
                      </div>
                    </button>
                  )}
                </Nav>
              </div>
            </div>
          </div>
          <div className="col-11 mt-1 pb-2 overflow-auto" style={{ height: hcb - 50 }}>
            <IsiTreeview
              data={lsMenuDetailWF}
            />
          </div>
        </>
      );
    } else if (tab == '4') {
      return (
        <>
          <div className="col-lg-12">
            <div className="row">
              <div className="col-12">
                <Nav className="justify-content-end">
                  {act.substring(0, 1) != 'E' ? (
                    ''
                  ) : (
                    <button
                      className="btn btn-link pt-1 pb-0 ps-2 pe-1 "
                      type="button"
                      style={{
                        position: 'fixed',
                        bottom: `${height - (!CheckDev.isMobile ? 210 : 600)}px`,
                        left: `${width - 100}px`
                      }}
                      onClick={e => setshowtreeApp(true)}
                    >
                      <div className="border border-primary border-2 rounded-circle p-2 d-flex align-items-center justify-content-center">
                        <FontAwesomeIcon
                          icon={faPlus}
                          className={`text-primary fs-${breakpoints.up('md') ? 9 : 11}`}
                        />
                      </div>
                    </button>
                  )}
                </Nav>
              </div>
            </div>
          </div>

          <div className="col-11 mt-1 pb-2 overflow-auto" style={{ height: hcb - 50 }}>
            <IsiTreeview
              data={lsMenuDetailAF}
            />
          </div>
        </>
      );
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
                    {SearchParams.get('dep') != null ? 'Edit' : 'Form'} Standard Access Menu
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
                        ConfSAMCancel();
                      }}
                    ></BtnMenu>
                  </Nav>
                </div>
              </div>
            </div>
            <div className="card-body p-1">
              <div className="row g-1">
                <div className="col-12 col-lg-12 px-x1">
                  <div className={`row g-1 d-flex ${act == 'VH' ? 'd-none' : ''}`}>
                    <div className="col-12 col-md-3">
                      <IsiTxt
                        label={'Nomor Document'}
                        val={Obj.DocumentNumber}
                        onchange={txtOnchange}
                        maxLength={300}
                        readonly={true}
                      ></IsiTxt>
                    </div>
                    <div className="col-12 col-md-3">
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
                    <div className="col-12 col-md-3">
                      <IsiTxt
                        id="Departement"
                        label="Departemen"
                        typ="select"
                        obj={lsdepartement}
                        val={Obj.Departement}
                        onchange={e => {
                          txtOnchange(e);
                          setlssection([]);
                          setlsunit([]);
                          Obj.Section = '';
                          Obj.Unit = '';
                          SAMUpdTempA(e.target.value, '', Obj.Unit, Obj.Golongan);
                          setDepartementDesc(e.target[e.target.selectedIndex].text);
                          if (e.target.value != '') {
                            GetDdlList('S', e.target.value);
                          }
                        }}
                        name={'Departement'}
                        disabled={act.substring(0, 1) != 'E' || SearchParams.get('dep') != null}
                        isinvalid={Valid.DepartementA}
                      ></IsiTxt>
                    </div>
                    <div className="col-12 col-md-3">
                      <IsiTxt
                        id="Section"
                        label="Seksi"
                        typ="select"
                        obj={lssection}
                        val={Obj.Section}
                        onchange={e => {
                          txtOnchange(e);
                          setlsunit([]);
                          Obj.Unit = '';
                          SAMUpdTempA(Obj.Departement, e.target.value, Obj.Unit, Obj.Golongan);
                          setSectionDesc(e.target[e.target.selectedIndex].text);
                          if (e.target.value != '') {
                            GetDdlList('U', `${Obj.Departement}|${e.target.value}`);
                          }
                        }}
                        name={'Section'}
                        disabled={act.substring(0, 1) != 'E' || SearchParams.get('dep') != null}
                        isinvalid={Valid.SectionA}
                      ></IsiTxt>
                    </div>
                    <div className="col-12 col-md-3">
                      <IsiTxt
                        id="Unit"
                        label="Unit"
                        typ="select"
                        obj={lsunit}
                        val={Obj.Unit}
                        onchange={e => {
                          txtOnchange(e);
                          SAMUpdTempA(Obj.Departement, Obj.Section, e.target.value, Obj.Golongan);
                          setUnitDesc(e.target[e.target.selectedIndex].text);
                        }}
                        name={'Unit'}
                        disabled={act.substring(0, 1) != 'E' || SearchParams.get('dep') != null}
                        isinvalid={Valid.UnitA}
                      ></IsiTxt>
                    </div>
                    <div className="col-12 col-md-3">
                      <IsiTxt
                        id="Golongan"
                        label="Golongan"
                        typ="select"
                        obj={lsgolongan}
                        val={Obj.Golongan}
                        onchange={e => {
                          txtOnchange(e);
                          SAMUpdTempA(Obj.Departement, Obj.Section, Obj.Unit, e.target.value);
                          setGolonganDesc(e.target[e.target.selectedIndex].text);
                        }}
                        name={'Golongan'}
                        disabled={act.substring(0, 1) != 'E' || SearchParams.get('dep') != null}
                        isinvalid={Valid.GolonganA}
                      ></IsiTxt>
                    </div>
                  </div>
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
                  {(lsSAMAprv.length != 0) ? (
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
                      <Button variant="success" size="sm" className="me-2" onClick={SaveSAM}>
                        Save
                      </Button>
                    )}
                    {(act.substring(0, 1) == 'S' && Obj.Status == 'U')
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

                    {(act.substring(0, 1) == 'A' && Obj.Status == 'U')
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
                        ConfSAMCancel();
                      }}
                    >
                      {act.substring(0, 1) != 'E' ? 'Close' : 'Cancel'}
                    </Button>
                  </Nav>
                </div>
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
                {/* Modal Tree ERP */}
                <Modal
                  show={showtreeErp}
                  onHide={hideshowtreeErp}
                  backdrop="static"
                  keyboard={false}
                  size="lg"
                >
                  <Modal.Header className="p-0 ps-3 pe-3 bg-primary" closeVariant='white' closeButton>
                    <Modal.Title className="text-white">Menu ERP</Modal.Title>
                  </Modal.Header >
                  <Modal.Body className="ps-3 pt-0 rounded-bottom">
                    <div className="pt-2">
                      <div className="row g-1">
                        <div className="col-12 overflow-auto" style={{ height: hcb }}>
                          <IsiTreeview
                            data={lsMenuDetailEB}
                            selection
                            selectedItems={selectedItemsE}
                            setSelectedItems={setselectedItemsE}
                          />
                        </div>
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer className={`p-1 ps-3 bg-light`}>
                    <Button variant="primary" size="sm" onClick={e => {
                      DelTempB('ERP', selectedItemsE);
                      hideshowtreeErp();
                    }}>
                      Save
                    </Button>
                    <Button variant="secondary" size="sm" onClick={e => {
                      hideshowtreeErp();
                    }}>
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>
                <Modal
                  show={showtreeMobile}
                  onHide={hideshowtreeMobile}
                  backdrop="static"
                  keyboard={false}
                  size="lg"
                >
                  <Modal.Header className="p-0 ps-3 pe-3 bg-primary" closeVariant='white' closeButton>
                    <Modal.Title className="text-white">Menu Mobile</Modal.Title>
                  </Modal.Header>
                  <Modal.Body className="ps-3 pt-0 rounded-bottom">
                    <div className="pt-2">
                      <div className="row g-1">
                        <div className="col-12 overflow-auto" style={{ height: hcb }}>
                          <IsiTreeview
                            data={lsMenuDetailMB}
                            selection
                            selectedItems={selectedItemsM}
                            setSelectedItems={setselectedItemsM}
                          />
                        </div>
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer className={`p-1 ps-3 bg-light`}>
                    <Button variant="primary" size="sm" onClick={e => {
                      DelTempB('MOBILE', selectedItemsM);
                      hideshowtreeMobile();
                    }}>
                      Save
                    </Button>
                    <Button variant="secondary" size="sm" onClick={e => {
                      hideshowtreeMobile();
                    }}>
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>
                <Modal
                  show={showtreeWhm}
                  onHide={hideshowtreeWhm}
                  backdrop="static"
                  keyboard={false}
                  size="lg"
                >
                  <Modal.Header className="p-0 ps-3 pe-3 bg-primary" closeVariant='white' closeButton>
                    <Modal.Title className="text-white">Menu WHM</Modal.Title>
                  </Modal.Header>
                  <Modal.Body className="ps-3 pt-0 rounded-bottom">
                    <div className="pt-2">
                      <div className="row g-1">
                        <div className="col-12 overflow-auto" style={{ height: hcb }}>
                          <IsiTreeview
                            data={lsMenuDetailWB}
                            selection
                            selectedItems={selectedItemsW}
                            setSelectedItems={setselectedItemsW}
                          />
                        </div>
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer className={`p-1 ps-3 bg-light`}>
                    <Button variant="primary" size="sm" onClick={e => {
                      DelTempB('WHM', selectedItemsW);
                      hideshowtreeWhm();
                    }}>
                      Save
                    </Button>
                    <Button variant="secondary" size="sm" onClick={e => {
                      hideshowtreeWhm();
                    }}>
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>
                <Modal
                  show={showtreeApp}
                  onHide={hideshowtreeApp}
                  backdrop="static"
                  keyboard={false}
                  size="lg"
                >
                  <Modal.Header className="p-0 ps-3 pe-3 bg-primary" closeVariant='white' closeButton>
                    <Modal.Title className="text-white">Menu APP</Modal.Title>
                  </Modal.Header>
                  <Modal.Body className="ps-3 pt-0 rounded-bottom">
                    <div className="pt-2">
                      <div className="row g-1">
                        <div className="col-12 overflow-auto" style={{ height: hcb }}>
                          <IsiTreeview
                            data={lsMenuDetailAB}
                            selection
                            selectedItems={selectedItemsA}
                            setSelectedItems={setselectedItemsA}
                          />
                        </div>
                      </div>
                    </div>
                  </Modal.Body>
                  <Modal.Footer className={`p-1 ps-3 bg-light`}>
                    <Button variant="primary" size="sm" onClick={e => {
                      DelTempB('APP', selectedItemsA);
                      hideshowtreeApp();
                    }}>
                      Save
                    </Button>
                    <Button variant="secondary" size="sm" onClick={e => {
                      hideshowtreeApp();
                    }}>
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
export default mst061_StdAcsMenuEntry;
