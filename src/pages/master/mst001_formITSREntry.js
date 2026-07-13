import {
  faPlus,
  faSave,
  faSearch,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import Flex from 'components/common/Flex';
import GridTable from 'components/form/GridTable';
import IsiTxt from 'components/form/IsiTxt';
import BtnMenu from 'components/navbar/headermenu/BtnMenu';
import { useBreakpoints } from 'hooks/useBreakpoints';
import {
  Alert,
  Button,
  Card,
  Col,
  ListGroup,
  Modal,
  Nav,
  Row,
  Tab,
  Tabs
} from 'react-bootstrap';
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams
} from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import IsiDateTime from 'components/form/IsiDateTime';
import GridCard from 'components/form/GridCard';
import React, { useEffect, useState } from 'react';
import {
  AlertException,
  confirmISI,
  ConvertbyteTopdf,
  PopAlertFalcon,
  showReports
} from 'script/ISI';
import axios from 'axios';
import IsiTimeline from 'components/form/IsiTimeline';
import IsiCheck from 'components/form/IsiCheck';
import IsiRadio from 'components/form/IsiRadio';

const Mst001_FormITSREntry = () => {
  const URL = process.env.REACT_APP_URL_API;
  const path = `${URL}api/mst001_FormITSR`;
  const { height, breakpoints, width } = useBreakpoints();
  const isFrame = self != top;
  const hlheight = height - (isFrame ? 0 : 64);
  const isMobile = breakpoints.down('md');
  const userData = JSON.parse(localStorage.getItem('userData'));

  const mappingTable = [
    {
      title: '',
      propName: 'Action',
      isNumber: false,
      isAction: true,
      actcode: 'D',
      actcond: [{ btncd: 'D', propNm: 'Mode', validprop: 'E' }],
      //   addbtn
      idEdit: 'Seq',
      class: 'text-center',
      col: '12'
    },
    /* {
      title: 'Date',
      propName: 'Tag',
      isNumber: false,
      isAction: false,
      col: '6'
    }, */
    {
      title: '',
      propName: 'Desc',
      isNumber: false,
      isAction: false,
      col: '8'
    }
    /* {
      title: 'Date',
      propName: 'Qty',
      isNumber: false,
      isAction: false,
      col: '6'
    } */
  ];

  const mappingHeader = [
    [
      { text: 'Action', width: '15%' },
      // { text: 'Service Tag', width: '25%' },
      { text: 'Description', width: '50%' }
      // { text: 'Qty', width: '10%' }
    ]
  ];

  const defaultVld = {
    doc: [true, ''],
    date: [true, ''],
    user: [true, ''],
    desc: [true, ''],
    type: [true, ''],
    asset: [true, ''],
    rmk: [true, ''],
    rmkRj: [true, ''],
    tag: [true, ''],
    cls: [true, ''],
    error: false
  };

  const asstVld = {
    desc: [true, ''],
    // tag: [true, ''],
    typ: '',
    error: false
  };

  const [astDl, setAstDl] = useState(1);
  const [astVld, setAstVld] = useState(asstVld);

  const navigate = useNavigate();

  const [data, setData] = useState(undefined);
  const [pref, setPref] = useState('Form');
  const [vld, setVld] = useState(defaultVld);
  const { state: params } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { key, act } = useParams();

  const [emp, setEmp] = useState(undefined);
  const [employee, setEmployee] = useState([]);
  const [assets, setAssets] = useState([]);
  const [sft, setSft] = useState({ Tag: null, Desc: null });
  const [hrd, setHrd] = useState({ Tag: null, Desc: null });
  const [editable, setEditable] = useState(false);
  const [astDdl, setAstDdl] = useState([]);

  const [lsBarang, setLsBarang] = useState([]);

  const [showRemark, setShowRemark] = useState(false);
  const [currTab, setCurrTab] = useState('form');
  const [LsDept, setLsDept] = useState([]);

  const getData = async () => {
    var sprm = { docNo: key, mode: act };

    if (searchParams.has('docno')) {
      sprm.docNo = searchParams.get('docno');
    }

    if (searchParams.has('asset')) {
      sprm.asset = searchParams.get('asset');
    }

    if (act == 'C') sprm.docNo = '';

    var prm = `?docNo=${sprm?.docNo ?? ''}&ip=${userData?.IP}&usid=${
      userData?.UserId
    }&asset=${sprm?.asset}&mode=${sprm?.mode}`;
    try {
      var res = await axios.get(path + prm, {
        headers: {
          Keys: userData?.UserTkn
        }
      });

      var dt = await res.data;

      if (dt.ErrMsg) {
        PopAlertFalcon('Error', 'Error', dt.ErrMsg);
      } else {
        freshData(dt);
      }
    } catch (error) {
      AlertException(error);
    }
  };

  const getDept = async () => {
    try {
      var res = await axios.get(`${URL}api/Utility/GetDepts`, {
        headers: {
          Keys: userData.UserTkn
        }
      });

      var dt = await res?.data;

      if (userData.KdDept !== 'IT') {
        var ls = dt.filter(c => c.Value == userData.KdDept);
        setLsDept([...ls]);
      } else {
        setLsDept(dt);
      }
    } catch (error) {
      AlertException(error);
    }
  };

  const prosesPost = async d => {
    try {
      var res = await axios.post(
        path,
        {
          ...d,
          Ip: userData.IP,
          UserC: userData.UserId,
          Dept: userData.KdDept,
          Sect: userData.Sectn
        },
        {
          headers: {
            Keys: userData.UserTkn
          }
        }
      );

      var dt = await res.data;

      if (dt.ErrMsg) {
        PopAlertFalcon('Error', 'Error', dt.ErrMsg);
        return;
      }

      // handle prosesId
      if (dt.ProsesId == 'Save' || dt.ProsesId == 'SaveDk') PrintPdf(dt);
      if (
        dt.ProsesId == 'Cancel' ||
        dt.ProsesId == 'Save' ||
        dt.ProsesId == 'SaveDk' ||
        dt.ProsesId == 'App'
      ) {
        navigate(`/master/mst001_formitsrlist?kd=${dt.Mode}`, {
          state: {
            mode: act,
            filter: params?.filter
          }
        });
      }

      freshData(dt);
    } catch (error) {
      AlertException(error);
    }
  };

  const PrintPdf = async d => {
    try {
      var res = await axios.post(`${path}/pdf`, d, {
        headers: {
          Keys: userData.UserTkn
        }
      });

      var dt = await res.data;
      var pdf = ConvertbyteTopdf(dt);
      showReports(`${pdf}`, 'ps', '1');
    } catch (error) {
      AlertException(error);
    }
  };

  const freshData = d => {
    if (!d.ProsesId) {
      d.Date = new Date(d.Date + 'Z');
    }

    const stat = ['V', 'A', 'S', 'D'];

    if (stat.includes(act)) {
      d.Mode = act;
    }

    if (d.Mode == 'S') setPref('Disapprove');
    if (d.Mode == 'A') setPref('Approve');

    setEditable(d.Mode == 'C' || d.Mode == 'E');
    if (d.User) {
      setEmp({ Text: d.UserText, Key: d.UserDept, Value: d.User });
    }
    setAstDdl(d.LsAsset);
    setData(d);
  };

  const handleSubmit = () => {
    if (checkValidation()) {
      return;
    }

    confirmISI({
      title: 'Konfirmasi',
      msg: 'Simpan data ?',
      yesText: 'Yes',
      noText: 'No',
      yesAction: () => {
        var obj = { ...data };
        obj.ProsesId = obj.Mode == 'D' ? 'SaveDk' : 'Save';
        obj.Stat = 'U';

        prosesPost(obj);
      },
      noAction: () => {}
    });
  };

  const checkValidation = () => {
    const valid = { ...defaultVld };
    valid.error = false;

    if (!data?.DocNo) {
      valid.doc = [false, 'Document No tidak valid'];
      valid.error = true;
    } else {
      valid.doc = [true, ''];
    }

    if (!data?.Date) {
      valid.date = [false, 'Date tidak valid'];
      valid.error = true;
    } else {
      valid.date = [true, ''];
    }

    if (!emp || !data?.User) {
      valid.user = [false, 'Harap pilih user'];
      valid.error = true;
    } else {
      valid.user = [true, ''];
    }

    if (!data?.Desc) {
      valid.desc = [false, 'Harap isi nama barang'];
      valid.error = true;
    } else {
      valid.desc = [true, ''];
    }

    if (!data?.Type || !data.Type[0] || !data.Type[1]) {
      valid.type = [false, 'Harap pilih opsi'];
      valid.error = true;
    } else {
      valid.type = [true, ''];
    }

    if (data?.Mode == 'D' && !data?.Remark) {
      valid.rmk = [false, 'Harap diisi'];
      valid.error = true;
    } else {
      valid.rmk = [true, ''];
    }

    if (typCheck('PC') && !data?.Tag) {
      valid.tag = [false, 'Harap diisi'];
      valid.error = true;
    } else {
      valid.tag = [true, ''];
    }

    if (data?.Hardware?.length == 0 && typCheck('PC')) {
      valid.asset = [false, 'Harap isi minimal 1 perangkat'];
      valid.error = true;
      setCurrTab('form');
    } else {
      valid.asset = [true, ''];
    }

    if (
      !data?.LsCheck?.find(c => c.Ceklis == 'Y' && c.TypeS == 'SS') &&
      typCheck('PC')
    ) {
      valid.cls = [false, 'Harap ceklis minimal 1'];
      valid.error = true;
      setCurrTab('cl');
    } else {
      valid.cls = [true, ''];
    }

    setVld({ ...valid });

    return valid.error;
  };

  const handleAction = (e, typ) => {
    var act = e.currentTarget.id;
    var key = e.currentTarget.name;
    var ls = typ == 'H' ? data.Hardware : data.Software;
    var dt = ls.find(c => c.Seq == key);

    if (act == 'BtnDelG') {
      confirmISI({
        title: 'Konfirmasi',
        msg: `Hapus perangkat (${dt.Desc}) ?`,
        yesText: 'Yes',
        noText: 'No',
        yesAction: () => {
          var obj = { ...data };
          obj.ProsesId = 'DeleteD';
          dt.Stat = 'D';
          dt.Ip = userData.IP;
          dt.UserC = userData.UserId;
          dt.Dept = userData.KdDept;
          dt.Sect = userData.Sectn;
          obj.Data = dt;
          prosesPost(obj);
        },
        noAction: () => {}
      });
    }
  };

  const handleCancel = () => {
    // check Doc No Empty -> navigate directly
    if (!editable) {
      var _act = params?.act ?? params?.mode ?? act;
      if (_act == 'V') {
        _act = '';
      }
      navigate(`/master/mst001_formitsrlist?kd=${_act}`, {
        state: {
          mode: act,
          filter: params?.filter
        }
      });
      return;
    }
    // confirm dialog
    confirmISI({
      title: 'Konfirmasi',
      msg: 'Cancel Form Serah Terima Asset IT ?',
      yesText: 'Yes',
      noText: 'No',
      yesAction: () => {
        data.ProsesId = 'Cancel';
        prosesPost(data);
      },
      noAction: () => {}
    });
  };

  const handleApp = stat => {
    if (stat == 'A') {
      confirmISI({
        title: 'Konfirmasi',
        msg: `Anda yakin ingin Approve dokumen ini ?`,
        yesText: 'Yes',
        noText: 'No',
        yesAction: () => {
          var obj = { ...data };
          obj.ProsesId = 'App';
          obj.Stat = stat;
          prosesPost(obj);
        },
        noAction: () => {}
      });
    } else {
      setData({ ...data, pnmode: stat });
      setShowRemark(true);
    }
  };

  const handleEmp = async e => {
    var val = e.target.value;
    setData({ ...data, UserText: val });

    if (!val) {
      setEmp(undefined);
      setData({ ...data, UserText: '', UserDept: '', User: '' });
      return;
    }

    try {
      var res = await axios.get(`${path}?filter=${val}`, {
        headers: {
          Keys: userData.UserTkn
        }
      });

      var dt = await res.data;
      setEmployee(dt);
    } catch (error) {
      AlertException(error);
    }
  };

  const empSlctd = d => {
    setEmp(d);
    setData({ ...data, UserText: d.Text, UserDept: d.Key, User: d.Value });
  };

  const handleRad = (c, t) => {
    var val = c.target.value;

    var ls = [...data.Type];
    ls[t ? 1 : 0] = val;

    setData({ ...data, Type: ls });
  };

  const handleCls = (e, d) => {
    var chk = e.target.checked;

    if (chk && !d.Default && d.InputType == 'SL') {
      // software standard yang diceklis tidak boleh kosong
      return;
    }

    var obj = { ...data };
    obj.ProsesId = chk ? 'CreateD' : 'DeleteD';
    obj.Data = {
      DocNo: data.DocNo,
      Tag: d.Id,
      Seq: '',
      Desc: d.Default,
      TypeD: '',
      TypeS: d.Type,
      Ceklis: chk ? 'Y' : '',
      Mode: 'E',
      Ip: userData.IP,
      UserC: userData.UserId,
      Dept: userData.KdDept,
      Sect: userData.Sectn
    };
    prosesPost(obj);
  };

  const handleClSlct = (e, y) => {
    var val = e.target.value; //selected value
    var cl = ceklistVal(y); //LsCheck
    if (cl) cl.Desc = val;

    e.target.checked = val ? true : false;
    handleCls(e, y);
  };

  const typCheck = typ => {
    if (!data) {
      return false;
    }

    return data.Type.findIndex(c => c == typ) >= 0;
    /* var ls = [...data.Type];
    return ls.some(c => c == typ); */
  };

  const ceklistCheck = cl => {
    var obj = data.LsCheck?.find(c => c.Tag === cl.Id);
    return obj?.Ceklis === 'Y';
  };

  const ceklistVal = cl => {
    // tag = Header (eg. Operating System)
    // desc = Detail Value

    return data?.LsCheck?.find(c => c.Tag === cl.Id && c.Ceklis == 'Y');
  };

  const handleAsset = async (e, typ) => {
    var nm = e.target.id;
    var val = e.target.value;
    setAssets([]);
    // var ast = [];
    if (typ == 'H') {
      setSft({ Tag: '', Desc: '' });
      // ast.push(...(data?.Hardware ?? []));
      setHrd({ ...hrd, [nm]: val });
    } else {
      setHrd({ Tag: '', Desc: '' });
      // ast.push(...(data?.Software ?? []));
      setSft({ ...sft, [nm]: val });
    }

    if (typCheck('PC')) {
      try {
        var res = await axios.get(
          `${path}/asset?filter=${val}&type=${typ}&aset=${astDl}`,
          {
            headers: {
              Keys: userData.UserTkn
            }
          }
        );

        var dt = await res.data;

        var ls = dt?.map((c, i) => ({
          DocNo: data.DocNo,
          Tag: c.Value,
          Seq: i + 1,
          Desc: c.Text,
          TypeD: typ,
          Qty: 1,
          Mode: 'E'
        }));

        setAssets(ls);
      } catch (error) {
        AlertException(error);
      }
    }
  };

  const handleTxtChange = async e => {
    var id = e.target.id;
    var val = e.target.value;

    setData({ ...data, [id]: val });

    if (id == 'Desc' && typCheck('PC')) {
      setLsBarang([]);

      try {
        var res = await axios.get(`${path}/asset?filter=${val}&type=H&aset=`, {
          headers: {
            Keys: userData.UserTkn
          }
        });

        var dt = await res.data;

        var ls = dt?.map((c, i) => ({
          DocNo: data.DocNo,
          Tag: c.Value,
          Seq: i + 1,
          Desc: c.Text,
          TypeD: '',
          Qty: 1,
          Mode: 'E'
        }));

        setLsBarang(ls);
      } catch (error) {
        AlertException(error);
      }
    }
  };

  const assetSlctd = async d => {
    setSft({ Tag: '', Desc: '' });
    setHrd({ Tag: '', Desc: '' });
    setAssets([]);

    var obj = { ...data };
    obj.ProsesId = 'CreateD';
    d.UserC = userData.UserId;
    d.Ip = userData.IP;
    d.Dept = userData.KdDept;
    d.Sect = userData.Sectn;
    obj.Data = d;

    prosesPost(obj);
  };

  const manualAsset = typ => {
    var tag = typ == 'H' ? hrd.Tag : sft.Tag;
    var desc = typ == 'H' ? hrd.Desc : sft.Desc;

    const vld = { ...astVld };
    vld.typ = typ;
    vld.error = false;

    /* if (!tag) {
      vld.tag = [false, 'Harap diisi'];
      vld.error = true;
    } else {
      vld.tag = [true, ''];
    } */

    if (!desc) {
      vld.desc = [false, 'Harap diisi'];
      vld.error = true;
    } else {
      vld.desc = [true, ''];
    }

    setAstVld(vld);
    if (vld.error) {
      return;
    }

    assetSlctd({
      DocNo: data.DocNo,
      Tag: tag,
      Seq: data?.Hardware?.length + 1,
      Desc: desc,
      TypeD: typ,
      Qty: 1,
      Mode: 'E'
    });
  };

  useEffect(() => {
    getData();
    getDept();
  }, []);

  const renderForm = () => {
    return (
      <>
        <div className="row g-1 my-2">
          <div className="col-12 col-md-6">
            <Card className="h-100">
              <Card.Header className="bg-light px-1 py-2">
                <h6 id="LblHdr" className="mb-0 ms-1">
                  I. Perangkat Keras
                </h6>
              </Card.Header>
              <Card.Body className="p-2 pt-0">
                <Flex direction="column">
                  {!isMobile ? (
                    <GridTable
                      datas={data?.Hardware ?? []}
                      clsname="dvListDtl"
                      maping={mappingTable}
                      headers={mappingHeader}
                      parentFunction={e => handleAction(e, 'H')}
                      tbstyle={{
                        width: '100%',
                        maxHeight: `280px`
                      }}
                      dvstyle={{
                        width: `100%`,
                        maxHeight: `280px`
                      }}
                    />
                  ) : (
                    <GridCard
                      datas={data?.Hardware ?? []}
                      clsname="dvListDtl"
                      maping={mappingTable}
                      headers={mappingHeader}
                      parentFunction={e => handleAction(e, 'H')}
                      tbstyle={{
                        width: '100%'
                      }}
                      dvstyle={{
                        width: '100%',
                        // minHeight: '90vh',
                        maxHeight: `${hlheight}px`
                      }}
                    />
                  )}
                  {editable && (
                    <table
                      className="p-0"
                      cellPadding={0}
                      cellSpacing={0}
                      style={{
                        border:
                          'solid 1.5px color-mix(in srgb, var(--falcon-input-focus-border-color), transparent 50%)',
                        borderTop: '0'
                      }}
                    >
                      <tr className="p-0">
                        <td className="p-0" style={{ width: '15%' }}>
                          <BtnMenu
                            evclick={e => manualAsset('H')}
                            icon={faSave}
                            color={'text-success'}
                          />
                        </td>
                        <td className="p-0" style={{ width: '50%' }}>
                          <div className="typeahead-form-group w-100">
                            <IsiTxt
                              val={hrd.Desc}
                              id={'Desc'}
                              group="mb-0"
                              row={3}
                              onchange={e => handleAsset(e, 'H')}
                              css={{
                                marginBottom: 0
                              }}
                              isinvalid={astVld.typ == 'H' ? astVld.desc : null}
                            />
                            <ListGroup className="typeahead-list-group">
                              {assets &&
                                hrd.Desc &&
                                assets?.map(r => (
                                  <ListGroup.Item
                                    key={r.Desc}
                                    className="typeahead-list-group-item my-0"
                                    onClick={() => assetSlctd(r)}
                                  >
                                    ({r.Tag}) - {r.Desc}
                                  </ListGroup.Item>
                                ))}
                            </ListGroup>
                          </div>
                        </td>
                      </tr>
                    </table>
                  )}
                  {vld.asset.length > 0 && !vld.asset[0] && (
                    <span className="invalid-feedback d-block">
                      {vld.asset[1]}
                    </span>
                  )}
                </Flex>
              </Card.Body>
            </Card>
          </div>
          <div className="col-12 col-md-6">
            <Card className="h-100">
              <Card.Header className="bg-light px-1 py-2">
                <h6 id="LblHdr" className="mb-0 ms-1">
                  II. Perangkat Lunak
                </h6>
              </Card.Header>
              <Card.Body className="p-2 pt-0">
                <Flex direction="column">
                  {!isMobile ? (
                    <GridTable
                      datas={data?.Software ?? []}
                      clsname="dvListDtl"
                      maping={mappingTable}
                      headers={mappingHeader}
                      parentFunction={handleAction}
                      tbstyle={{
                        width: '100%',
                        maxHeight: `280px`
                      }}
                      dvstyle={{
                        width: `100%`,
                        maxHeight: `280px`
                      }}
                    />
                  ) : (
                    <GridCard
                      datas={data?.Software ?? []}
                      clsname="dvListDtl"
                      maping={mappingTable}
                      headers={mappingHeader}
                      parentFunction={handleAction}
                      tbstyle={{
                        width: '100%'
                      }}
                      dvstyle={{
                        width: '100%',
                        // minHeight: '90vh',
                        maxHeight: `${hlheight}px`
                      }}
                    />
                  )}
                  {editable && (
                    <table
                      className="p-0"
                      cellPadding={0}
                      cellSpacing={0}
                      style={{
                        border:
                          'solid 1.5px color-mix(in srgb, var(--falcon-input-focus-border-color), transparent 50%)',
                        borderTop: '0'
                      }}
                    >
                      <tr className="p-0">
                        <td className="p-0" style={{ width: '15%' }}>
                          <BtnMenu
                            evclick={e => manualAsset('S')}
                            icon={faSave}
                            color={'text-success'}
                          />
                        </td>
                        <td className="p-0" style={{ width: '50%' }}>
                          <div className="typeahead-form-group w-100">
                            <IsiTxt
                              val={sft.Desc}
                              id="Desc"
                              group="mb-0"
                              row={3}
                              onchange={e => handleAsset(e, 'S')}
                              isinvalid={astVld.typ == 'S' ? astVld.desc : null}
                            />
                            <ListGroup className="typeahead-list-group">
                              {assets &&
                                sft.Desc &&
                                assets?.map(r => (
                                  <ListGroup.Item
                                    key={r.Desc}
                                    className="typeahead-list-group-item my-0"
                                    onClick={() => assetSlctd(r)}
                                  >
                                    ({r.Tag}) - {r.Desc}
                                  </ListGroup.Item>
                                ))}
                            </ListGroup>
                          </div>
                        </td>
                      </tr>
                    </table>
                  )}
                </Flex>
              </Card.Body>
            </Card>
          </div>
        </div>
      </>
    );
  };

  const renderCl = () => {
    return (
      <>
        <div className="row mt-1 mb-2 g-2 row-cols-1 row-cols-xl-2">
          {data?.Checklist?.map((x, i) => (
            <div className="col">
              <Card className="h-100">
                <Card.Header className="bg-light px-1 py-2">
                  <h6 id="LblHdr" className="mb-0 ms-1">
                    {x.Desc}
                  </h6>
                </Card.Header>
                <Card.Body className="p-2 pt-0">
                  <div className="list-group list-group-flush px-0">
                    {x?.LsData?.map((y, j) => (
                      <div className="list-group-item p-1 px-0">
                        <div className="row g-0">
                          <div
                            className={`col-${
                              y.InputType != '' ? '7' : 'auto'
                            }`}
                          >
                            <IsiCheck
                              cls={'customcheck-sm'}
                              disabled={!editable}
                              change={e => {
                                var ls = [...data.Checklist]; //checklist ddl
                                var obj = ls[i].LsData[j]; //checklist detail value
                                if (!e.target.checked) obj.Default = ''; //update selected value
                                handleCls(e, y);
                              }}
                              txt={y.Desc}
                              ischeck={ceklistCheck(y)}
                            />
                          </div>
                          {y.InputType == 'SL' && (
                            <div className="col-5">
                              <IsiTxt
                                typ="select"
                                obj={y.LsDetails}
                                disabled={!editable}
                                val={ceklistVal(y)?.Desc ?? y.Default}
                                onchange={e => {
                                  var ls = [...data.Checklist]; //checklist ddl
                                  var obj = ls[i].LsData[j]; //checklist detail value
                                  obj.Default = e.target.value; //update selected value
                                  setData({ ...data, Checklist: ls });
                                  handleClSlct(e, y);
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {vld.cls.length > 0 && !vld.cls[0] && i == 0 && (
                    <span className="invalid-feedback d-block">
                      {vld.cls[1]}
                    </span>
                  )}
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <>
      <Row className="g-0">
        <Col sm={12}>
          <Card style={{ minHeight: `${hlheight}px` }}>
            <Card.Header className="bg-light px-1 py-2">
              <Row className="g-0">
                <Col lg="8" className="d-flex align-items-center">
                  {/* <div className="icon-item icon-item-sm bg-soft-primary rounded-3 shadow-none me-1 bg-soft-success">
                  <span className="fas fa-table text-success"></span>
                </div> */}
                  <h5 id="LblHdr" className="mb-0 ms-1">
                    {pref} {data?.Mode == 'D' ? 'Pengembalian' : 'Serah Terima'}{' '}
                    Asset IT
                  </h5>
                </Col>
                <Col>
                  <Nav className="justify-content-end">
                    <BtnMenu
                      id="BtnBack"
                      title="Back"
                      icon={faSignOutAlt}
                      color="text-info"
                      evclick={e => {
                        handleCancel();
                      }}
                    ></BtnMenu>
                  </Nav>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body className="p-2 pt-0 h-100">
              <div className="d-flex flex-column align-items-stretch">
                <div className="row g-2 mb-3">
                  <div className="col-12 col-lg-6 h-100">
                    <div className="row g-1">
                      <div className="col-12 col-md-6">
                        <IsiTxt
                          label="Document Number"
                          val={data?.DocNo}
                          disabled={true}
                          isinvalid={vld.doc}
                        />
                      </div>
                      <div className="col-12 col-md-6">
                        <IsiDateTime
                          label="Date"
                          val={data?.Date}
                          disabled={true}
                          isinvalid={vld.date}
                        />
                      </div>
                    </div>
                    <div className="row g-1">
                      <div className="col-12 col-md-6">
                        <div className="typeahead-form-group w-100">
                          <IsiTxt
                            label="User"
                            disabled={!editable}
                            val={data?.UserText}
                            onchange={handleEmp}
                            isinvalid={vld.user}
                          />
                          <ListGroup className="typeahead-list-group">
                            {!emp &&
                              employee?.map(r => (
                                <ListGroup.Item
                                  key={r.Value}
                                  className="typeahead-list-group-item"
                                  onClick={() => empSlctd(r)}
                                >
                                  {r.Text}
                                </ListGroup.Item>
                              ))}
                          </ListGroup>
                        </div>
                      </div>
                      <div className="col-12 col-md-6">
                        <IsiTxt
                          label="Department"
                          typ="select"
                          disabled={true}
                          obj={LsDept}
                          val={data?.UserDept}
                        />
                      </div>
                    </div>
                    <div className="row g-1">
                      <div className="col-12 col-md-6">
                        <IsiTxt
                          id="RefNo"
                          label="No Ref"
                          disabled={!editable}
                          val={data?.RefNo}
                          maxlength={30}
                          onchange={handleTxtChange}
                        />
                      </div>
                      <div className="col-12 col-md-6">
                        <IsiTxt
                          id="AssetNo"
                          label="Asset No"
                          disabled={true}
                          maxlength={12}
                          val={data?.AssetNo}
                          onchange={handleTxtChange}
                        />
                      </div>
                    </div>
                    <div className="row g-1">
                      <div className="col-12">
                        <IsiRadio
                          label="Jenis Serah Terima"
                          data={[
                            {
                              id: 'rpc',
                              label: 'PC Desktop / Notebook',
                              disabled: !editable,
                              onChange: e => handleRad(e),
                              defaultChecked: typCheck('PC'),
                              checked: typCheck('PC'),
                              value: 'PC'
                            },
                            {
                              id: 'rpt',
                              label: 'Printer',
                              disabled: !editable,
                              onChange: e => handleRad(e),
                              defaultChecked: typCheck('PT'),
                              checked: typCheck('PT'),
                              value: 'PT'
                            },
                            {
                              id: 'rot',
                              label: 'Other',
                              disabled: !editable,
                              onChange: e => handleRad(e),
                              defaultChecked: typCheck('OT'),
                              checked: typCheck('OT'),
                              value: 'OT'
                            }
                          ]}
                          inlen={true}
                          name="type"
                        ></IsiRadio>
                        <IsiRadio
                          label="Kondisi Perangkat"
                          data={[
                            {
                              id: 'rnw',
                              label: 'Baru',
                              disabled: !editable,
                              onChange: e => handleRad(e, 'u'),
                              defaultChecked: typCheck('NW'),
                              checked: typCheck('NW'),
                              value: 'NW'
                            },
                            {
                              id: 'rit',
                              label: 'IT Stock',
                              disabled: !editable,
                              onChange: e => handleRad(e, 'u'),
                              defaultChecked: typCheck('IT'),
                              checked: typCheck('IT'),
                              value: 'IT'
                            },
                            {
                              id: 'rpj',
                              label: 'Pinjaman',
                              disabled: !editable,
                              onChange: e => handleRad(e, 'u'),
                              defaultChecked: typCheck('PJ'),
                              checked: typCheck('PJ'),
                              value: 'PJ'
                            }
                          ]}
                          inlen={true}
                          name="typeu"
                        ></IsiRadio>
                        {vld.type.length > 0 && !vld.type[0] && (
                          <span className="invalid-feedback d-block">
                            {vld.type[1]}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="row g-1 mb-2">
                      <div className="col-12 col-md-6">
                        <div className="typeahead-form-group w-100">
                          <IsiTxt
                            id="Desc"
                            label="Barang"
                            disabled={!editable}
                            val={data?.Desc}
                            isinvalid={vld.desc}
                            maxlength={200}
                            onchange={handleTxtChange}
                          />
                          <ListGroup className="typeahead-list-group">
                            {lsBarang &&
                              data?.Desc &&
                              lsBarang?.map(r => (
                                <ListGroup.Item
                                  key={r.Desc}
                                  className="typeahead-list-group-item my-0"
                                  onClick={() => {
                                    setLsBarang([]);
                                    setData({
                                      ...data,
                                      Desc: r.Desc,
                                      Tag: r.Tag
                                    });
                                  }}
                                >
                                  ({r.Tag}) - {r.Desc}
                                </ListGroup.Item>
                              ))}
                          </ListGroup>
                        </div>
                      </div>
                      <div className="col-12 col-md-6">
                        <IsiTxt
                          id="Tag"
                          label="Service Tag / Serial Number"
                          disabled={!editable}
                          val={data?.Tag}
                          isinvalid={vld.tag}
                          onchange={handleTxtChange}
                        />
                      </div>
                    </div>
                    {(data?.Mode == 'D' || data?.Dikem) &&
                      !['C', 'E'].includes(data?.Mode) && (
                        <div className="row g-1">
                          <div className="col-12">
                            <IsiCheck
                              cls={'customcheck-sm'}
                              disabled={true}
                              txt={`Dikembalikan, alasan:`}
                              ischeck={true}
                            />
                            <IsiTxt
                              id="Remark"
                              row={6}
                              val={data?.Remark}
                              isinvalid={vld.rmk}
                              disabled={data?.Mode !== 'D'}
                              onchange={handleTxtChange}
                            />
                          </div>
                        </div>
                      )}
                  </div>
                  <div className="col-12 col-lg-6 h-100">
                    <Tabs activeKey={currTab} onSelect={e => setCurrTab(e)}>
                      <Tab eventKey="form" title="Spesifikasi">
                        {renderForm()}
                      </Tab>
                      <Tab eventKey="cl" title="Checklist">
                        {renderCl()}
                      </Tab>
                    </Tabs>
                  </div>
                </div>
              </div>
              {data?.Mode == 'V' && (
                <div className="mt-auto d-flex flex-column gap-2">
                  {data?.RemarkRj && ['S', 'J'].includes(data?.Stat) && (
                    <Alert
                      key="danger"
                      variant="danger"
                      show={data.RemarkRj}
                      className="mt-3 ms-3 me-3"
                    >
                      Remark : {data.RemarkRj}
                    </Alert>
                  )}
                  <IsiTimeline Show={true} Data={data?.LsApv} />
                </div>
              )}
            </Card.Body>
            <Card.Footer className="p-1 d-flex gap-2 ps-3 bg-light">
              {(editable || data?.Mode == 'D') && (
                <Button size="sm" variant="success" onClick={handleSubmit}>
                  Save
                </Button>
              )}
              {data?.Mode == 'S' && (
                <Button
                  size="sm"
                  variant="warning"
                  onClick={() => handleApp('S')}
                >
                  Disapprove
                </Button>
              )}
              {data?.Mode == 'A' && (
                <>
                  <Button
                    size="sm"
                    variant="warning"
                    onClick={() => handleApp('J')}
                  >
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleApp('A')}
                  >
                    Approve
                  </Button>
                </>
              )}
              <Button size="sm" variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>

      {/* remark */}
      <Modal show={showRemark} backdrop="static" keyboard={false}>
        <Modal.Header className="p-0 ps-3 pe-3 bg-primary">
          <Modal.Title>
            {data?.pnmode == 'S' ? 'Disapproving' : 'Rejecting'} Document
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="ps-3 pt-0 rounded-bottom">
          <IsiTxt
            label="Remark"
            row={3}
            val={data?.RemarkRj}
            onchange={e => setData({ ...data, RemarkRj: e.target.value })}
            isinvalid={vld.rmkRj}
          />
        </Modal.Body>
        <Modal.Footer className="p-1 ps-3 bg-light">
          <Button
            size="sm"
            variant="success"
            onClick={() => {
              const vald = { ...vld };
              vald.rmkRj = [true, ''];
              if (!data.RemarkRj) {
                vald.rmkRj = [false, 'Remark harus diisi'];
                setVld(vald);
                return;
              }
              setVld(vald);

              confirmISI({
                title: 'Konfirmasi',
                msg: `Anda akan ${
                  data?.pnmode == 'S' ? 'Disapprove' : 'Reject'
                } dokumen ini ?`,
                yesText: 'Yes',
                noText: 'No',
                noAction: () => {},
                yesAction: () => {
                  var obj = { ...data };
                  obj.ProsesId = 'App';
                  obj.Stat = data.pnmode;
                  prosesPost(obj);
                }
              });
            }}
          >
            Save
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setData({ ...data, RemarkRj: '', pnmode: '' });
              setShowRemark(false);
            }}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Mst001_FormITSREntry;
