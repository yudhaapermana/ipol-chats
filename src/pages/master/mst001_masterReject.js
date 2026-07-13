import {
  faPlus,
  faSearch,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import GridCard from 'components/form/GridCard';
import GridTable from 'components/form/GridTable';
import IsiTxt from 'components/form/IsiTxt';
import BtnMenu from 'components/navbar/headermenu/BtnMenu';
import { useBreakpoints } from 'hooks/useBreakpoints';
import useIsMobile from 'hooks/useIsMobile';
import React, { useEffect, useState } from 'react';
import { Button, Col, Modal, Nav, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import * as ISI from 'script/ISI.js';

const mst001_masterReject = () => {
  const URL = process.env.REACT_APP_URL_API;
  const path = `${URL}api/mst001_masterReject/`;

  const navigate = useNavigate();
  var userData = JSON.parse(localStorage.getItem('userData'));

  const isFrame = self != top;
  const { height, width } = useBreakpoints();
  const hlheight = height - (isFrame ? 56 : 120);

  const defaultValidation = {
    type: [true, ''],
    code: [true, ''],
    desc: [true, ''],
    // date: [false, 'Date range is required'],
    error: false
  };
  const defaultFilter = {
    type: '',
    code: '',
    desc: ''
  };
  const CheckDev = useIsMobile();
  const [data, setData] = useState({});
  const [list, setList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const styleFilter = {
    overflow: 'hidden',
    height: showFilter ? '100%' : 0,
    transition: 'height 1s ease-out',
    top: self == top ? '13vh' : '5vh'
  };

  const [id, setId] = useState('');
  const [key, setKey] = useState('');
  const [type, setType] = useState('');
  const [code, setCode] = useState('');
  const [desc, setDesc] = useState('');
  const [filter, setFilter] = useState(defaultFilter);
  // const [date, setDate] = useState([new Date(), new Date()]);

  //   const [remark, setRemark] = useState('');
  const [valid, setValid] = useState(defaultValidation);
  const [isUpdate, setIsUpdate] = useState(false);

  const onShow = upData => {
    if (upData) {
      setId(upData.Id);
      setType(upData.Type);
      setCode(upData.Code);
      setDesc(upData.Desc);
      setKey(upData.Key);
      setIsUpdate(true);
    } else {
      setId('');
      setType(filter.type);
      setKey('');
      setCode('');
      setDesc('');
      //   setRemark('');
      setIsUpdate(false);
    }

    setShowForm(true);
  };

  const onHide = () => {
    setShowForm(false);
    setValid({ ...defaultValidation });
  };

  const typeCh = e => {
    setType(e.target.value);
  };

  const codeCh = e => {
    setCode(e.target.value);
  };

  const descCh = e => {
    setDesc(e.target.value);
  };

  const dateCh = e => {
    console.log(e);

    // setDate(e);
  };

  const freshData = d => {
    setData(d);

    if (filter.code || filter.desc || filter.type) {
      filterData(d.RejectList);
    } else {
      setFilter({
        ...defaultFilter
      });
      setList(d.RejectList);
    }

    setType('QR_');
    setCode('');
    setDesc('');
  };

  const getList = async () => {
    try {
      var res = axios.get(
        `${path}?code=${filter.code}&type=${filter.type}&desc=${filter.desc}`,
        {
          headers: {
            Keys: userData.UserTkn
          }
        }
      );
      var resData = (await res).data;
      freshData(resData);
    } catch (error) {
      ISI.PopAlertFalcon('', 'Error', error.message);
    }
  };

  const filterData = list => {
    var l = list ?? data.RejectList;

    var filtered = l.filter(
      x =>
        x.Type == (filter?.type != '' ? filter.type : x.Type) &&
        x.Code.includes(filter?.code != '' ? filter.type : x.Code) &&
        x.Desc.includes(filter?.desc != '' ? filter.desc : x.Desc)
    );

    setList(filtered);
    setShowFilter(false);
  };

  useEffect(() => {
    getList();
  }, []);

  const mappingTable = [
    {
      title: '',
      propName: 'Action',
      isNumber: false,
      isAction: true,
      actcode: 'D,E',
      actcond: [{ btncd: 'D', propNm: 'AllowDelete', validprop: 'Y' }],
      idEdit: 'Id',
      class: 'text-center',
      col: '12'
    },
    {
      title: 'Code',
      propName: 'Code',
      isNumber: false,
      isAction: false,
      col: '3'
    },
    {
      title: 'Category',
      propName: 'TypeName',
      isNumber: false,
      isAction: false,
      col: '3'
    },
    {
      title: 'Description',
      propName: 'Desc',
      isNumber: false,
      isAction: false,
      col: '6'
    }
  ];
  const mappingHeader = [
    [
      { text: 'Action', width: '15%' },
      { text: 'Code', width: '15%' },
      { text: 'Category', width: '15%' },
      { text: 'Description', width: '55%' }
    ]
  ];
  const types = [
    {
      Text: 'Quality',
      Value: 'QR_'
    },
    {
      Text: 'Packing',
      Value: 'CR_P'
    },
    {
      Text: 'Service',
      Value: 'CR_S'
    }
  ];

  const handleAction = e => {
    var act = e.currentTarget.id;
    var key = e.currentTarget.name;
    var upData = list.find(c => c.Id === key);

    if (act === 'BtnEditG') {
      onShow(upData);
    } else if (act === 'BtnDelG') {
      // showConfirmation();
      ISI.confirmISI({
        title: 'Konfirmasi',
        msg: `Hapus Defect ${upData.Code}-${upData.Desc}?`,
        yesText: 'Yes',
        yesAction: () => del(key),
        noText: 'No',
        noAction: () => {}
      });
    }
  };

  const del = async id => {
    var delData = list.find(c => c.Id === id);

    try {
      var req = axios.post(
        path,
        {
          ...delData,
          prosesId: 'Del',
          userId: userData.UserId,
          ipAddress: userData.IP
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Keys: userData.UserTkn
          }
        }
      );

      var res = (await req).data;

      if (res.ErrMsg) {
        ISI.PopAlertFalcon('Warning', 'Warning', res.ErrMsg);
      } else {
        freshData(res);
      }
    } catch (error) {
      ISI.PopAlertFalcon('Error', 'Error', error.message);
    }
  };

  const handleSubmit = () => {
    if (checkValidation()) {
      return;
    }

    // showConfirmation();
    ISI.confirmISI({
      title: 'Konfirmasi',
      msg: 'Simpan data ?',
      yesText: 'Yes',
      yesAction: () => {
        if (!isUpdate) {
          onCreate();
        } else {
          onUpdate();
        }
      },
      noText: 'No',
      noAction: () => {}
    });
  };

  const onCreate = async () => {
    try {
      var req = axios.post(
        path,
        {
          type,
          code,
          desc,
          prosesId: 'Add',
          userId: userData.UserId,
          ipAddress: userData.IP
        },
        {
          headers: {
            Keys: userData.UserTkn
          }
        }
      );

      var res = (await req).data;

      if (res.ErrMsg) {
        ISI.PopAlertFalcon('Warning', 'Warning', res.ErrMsg);
      } else {
        freshData(res);
        onHide();
      }
    } catch (error) {
      ISI.PopAlertFalcon('Error', 'Error', error.message);
    }
  };

  const onUpdate = async () => {
    try {
      var req = axios.post(
        path,
        {
          id,
          key,
          type,
          code,
          desc,
          prosesId: 'Edit',
          //   remark,
          userId: userData.UserId,
          ipAddress: userData.IP
        },
        {
          headers: {
            Keys: userData.UserTkn
          }
        }
      );

      var res = (await req).data;

      if (res.ErrMsg) {
        ISI.PopAlertFalcon('Warning', 'Warning', res.ErrMsg);
      } else {
        freshData(res);
        onHide();
      }
    } catch (error) {
      ISI.PopAlertFalcon('Error', 'Error', error.message);
    }
  };

  const checkValidation = () => {
    const vld = { ...defaultValidation };
    vld.error = false;

    if (!type) {
      vld.type = [false, 'Category harus diisi'];
      vld.error = true;
    } else {
      vld.type = [true, ''];
    }

    if (!code && type === 'QR_') {
      vld.code = [false, 'Code harus diisi'];
      vld.error = true;
    } else if (code.length > 2 && !isUpdate) {
      vld.code = [false, 'Maks. panjang code adalah 2 karakter'];
      vld.error = true;
    } else {
      vld.code = [true, ''];
    }

    if (!desc) {
      vld.desc = [false, 'Description harus diisi'];
      vld.error = true;
    } else {
      vld.desc = [true, ''];
    }

    setValid({ ...vld });

    return vld.error;
  };

  return (
    <>
      <Row className="g-0">
        <Col lg="12">
          <div className="card">
            <div className="card-header bg-light ps-1 pe-1 pt-2 pb-2">
              <div className="row g-0">
                <div className="col-md-8 col-sm-8 col-xxl-8 col-lg-8 col-12 d-flex align-items-center">
                  <div className="icon-item icon-item-sm bg-soft-primary rounded-3 shadow-none me-1 bg-soft-success">
                    <span className="fas fa-table text-success"></span>
                  </div>
                  <h5 id="LblHdr" className="mb-0 ms-1">
                    Master Defect
                  </h5>
                </div>
                <div className="col">
                  <Nav className="justify-content-end">
                    <BtnMenu
                      id="btnAdd"
                      title={'Add'}
                      icon={faPlus}
                      color="text-info"
                      evclick={() => onShow(null)}
                    ></BtnMenu>
                    {/* <BtnMenu
                      id="btnReset"
                      title={'Refresh'}
                      icon={faUndo}
                      color="text-info"
                      evclick={() => {
                        setFilter({
                          ...filter,
                          ...defaultFilter
                        });
                        getList();
                      }}
                    ></BtnMenu> */}
                    <BtnMenu
                      id="BtnSearch"
                      title="Search"
                      evclick={() => setShowFilter(!showFilter)}
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
            <div className="card-body p-2 pt-0">
              <div className="d-flex">
                {!CheckDev.isMobile ? (
                  <GridTable
                    datas={list}
                    clsname="dvListDtl"
                    maping={mappingTable}
                    headers={mappingHeader}
                    parentFunction={handleAction}
                    tbstyle={{
                      width: '650px',
                      maxHeight: `${hlheight}px`
                    }}
                    dvstyle={{
                      width: `${width}px`,
                      maxHeight: `${hlheight}px`
                    }}
                  />
                ) : (
                  <GridCard
                    datas={list}
                    clsname="dvListDtl"
                    maping={mappingTable}
                    headers={mappingHeader}
                    parentFunction={handleAction}
                    tbstyle={{
                      width: '100vw'
                    }}
                    dvstyle={{
                      width: '100%',
                      // minHeight: '90vh',
                      maxHeight: `${hlheight}px`
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* form modal */}
      <Modal show={showForm} onHide={onHide} backdrop="static" keyboard={false}>
        <Modal.Header className="p-0 ps-3 pe-3 bg-primary">
          <Modal.Title>Form Defect</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-column gap-2 w-100">
            <div className="w-100">
              <IsiTxt
                label="Type / Category"
                typ="select"
                obj={types}
                val={type}
                onchange={typeCh}
                isinvalid={valid.type}
                css="d-flex w-100"
              />
            </div>
            {type === 'QR_' && (
              <div className="w-100">
                <IsiTxt
                  label="Code"
                  css="d-flex w-100"
                  maxlength={2}
                  disabled={isUpdate}
                  val={code}
                  onchange={codeCh}
                  isinvalid={valid.code}
                />
              </div>
            )}
            <div className="w-100">
              <IsiTxt
                label="Description"
                css="d-flex w-100"
                row={3}
                val={desc}
                onchange={descCh}
                isinvalid={valid.desc}
              />
            </div>
            {/* <div className="w-100">
              <IsiDateTimeRange
                label="Date"
                val={date[0]}
                valx={date[1]}
                onchange={dateCh}
                isinvalid={valid.date}
              />
            </div> */}
            {/* {isUpdate && (
              <div className="w-100">
                <IsiTxt
                  label="Remark"
                  css="d-flex w-100"
                  row={3}
                  val={remark}
                  onchange={remarkCh}
                />
              </div>
            )} */}
          </div>
        </Modal.Body>
        <Modal.Footer className="p-1 ps-3 bg-light">
          <Button size="sm" variant="success" onClick={handleSubmit}>
            Save
          </Button>
          <Button size="sm" variant="secondary" onClick={onHide}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* filter box */}
      <div className="form-boxentry bg-light" style={styleFilter}>
        <div className="card">
          <div className="card-body">
            <div className="row g-1 d-flex d-row">
              <div className="col-4 col-md-2">
                <IsiTxt
                  label="Category"
                  typ="select"
                  obj={types}
                  val={filter.type}
                  onchange={e => {
                    setFilter({
                      ...filter,
                      type: e.target.value
                    });
                  }}
                  css="d-flex w-100"
                />
              </div>
              <div className="col-4 col-md-2">
                <IsiTxt
                  label="Code"
                  val={filter.code}
                  onchange={e => {
                    setFilter({
                      ...filter,
                      code: e.target.value
                    });
                  }}
                />
              </div>
              <div className="col-4 col-md-2">
                <IsiTxt
                  label="Description"
                  val={filter.desc}
                  onchange={e => {
                    setFilter({
                      ...filter,
                      desc: e.target.value
                    });
                  }}
                />
              </div>
            </div>
          </div>
          <div className="card-footer">
            <Button
              className="btn btn-sm btn-primary me-2"
              id="btnfSearch"
              name="Search"
              onClick={() => {
                filterData();
              }}
            >
              Search
            </Button>
            <Button
              className="btn btn-sm btn-info me-2"
              id="btnfSearch"
              name="Reset"
              onClick={() => {
                setFilter({
                  ...defaultFilter
                });
                setShowFilter(false);
                setList(data.RejectList);
              }}
            >
              Clear Filter
            </Button>
            <Button
              className="btn btn-sm btn-secondary me-2"
              id="btnfClose"
              name="Close"
              onClick={() => setShowFilter(false)}
            >
              Hide
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default mst001_masterReject;
