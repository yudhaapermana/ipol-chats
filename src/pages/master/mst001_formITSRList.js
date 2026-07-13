import {
  faFileImport,
  faPlus,
  faSearch,
  faSignOutAlt,
  faUndo
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Flex from 'components/common/Flex';
import GridCard from 'components/form/GridCard';
import GridTable from 'components/form/GridTable';
import IsiTxt from 'components/form/IsiTxt';
import BtnMenu from 'components/navbar/headermenu/BtnMenu';
import { useBreakpoints } from 'hooks/useBreakpoints';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, ListGroup, Nav, Row } from 'react-bootstrap';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  AlertException,
  confirmISI,
  ConvertbyteTopdf,
  PopAlertFalcon,
  showReports
} from 'script/ISI';
import { format } from 'date-fns';
import IsiDateTimeRange from 'components/form/IsiDateTimeRange';

const Mst001_FormITSRList = () => {
  const URL = process.env.REACT_APP_URL_API;
  const path = `${URL}api/mst001_FormITSR`;
  const { height, breakpoints, width } = useBreakpoints();
  const isFrame = self != top;
  const hlheight = height - (isFrame ? 60 : 120);
  const isMobile = breakpoints.down('md');
  const userData = JSON.parse(localStorage.getItem('userData'));

  const navigate = useNavigate();

  const mappingTable = [
    {
      title: '',
      propName: 'Action',
      isNumber: false,
      isAction: true,
      actcode: 'D,E,V,P,A,U',
      actcond: [
        { btncd: 'D', propNm: 'AllowDelete', validprop: true },
        { btncd: 'E', propNm: 'AllowEdit', validprop: true },
        { btncd: 'A', propNm: 'AllowApp', validprop: true },
        { btncd: 'U', propNm: 'AllowDisApp', validprop: true }
      ],
      addbtn: [
        {
          id: 'BtnDk',
          tool: 'Kembalikan Asset',
          icn: faFileImport,
          color: 'text-info',
          propNm: 'AllowDk',
          validprop: true
        }
      ],
      idEdit: 'DocNo',
      class: 'text-center',
      col: '12'
    },
    {
      title: 'Document No',
      propName: 'DocNo',
      isNumber: false,
      isAction: false,
      col: '8'
    },
    {
      title: 'Date',
      propName: 'DateD',
      isNumber: false,
      isAction: false,
      col: '6'
    },
    {
      title: 'Employee',
      propName: 'UserText',
      isNumber: false,
      isAction: false,
      col: '12'
    },
    {
      title: 'Department',
      propName: 'Dept',
      isNumber: false,
      isAction: false,
      col: '12'
    },
    {
      title: 'Description',
      propName: 'Desc',
      isNumber: false,
      isAction: false,
      col: '12'
    },
    {
      title: 'Return',
      propName: 'RetD',
      isNumber: false,
      isAction: false,
      col: '12'
    },
    {
      title: 'Status',
      propName: 'StatD',
      isNumber: false,
      isAction: false,
      col: '12'
    },
    {
      title: 'Created',
      propName: 'UserDept',
      isNumber: false,
      isAction: false,
      col: '12'
    }
  ];

  const mappingHeader = [
    [
      { text: 'Action', width: '8%' },
      { text: 'Document No', width: '7%' },
      { text: 'Date', width: '8%' },
      { text: 'User', width: '11%' },
      { text: 'Department', width: '13%' },
      { text: 'Description', width: '16%' },
      { text: 'Return', width: '5%' },
      { text: 'Status', width: '18%' },
      { text: 'Created By', width: '10%' }
    ]
  ];
  const now = new Date();
  const defaultFilter = {
    usr: '',
    dept: '',
    stat: '',
    typ: '',
    date: new Date(now.getFullYear(), now.getMonth(), 1, 8, 0, 0),
    dateT: new Date()
  };

  const typDdl = [
    {
      Text: 'Yes',
      Value: 'Y'
    },
    {
      Text: 'No',
      Value: 'N'
    }
  ];

  const [data, setData] = useState(undefined);
  const [list, setList] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [pref, setPref] = useState('Form');

  const [LsDept, setLsDept] = useState([]);

  const [searchParams, setSearchParams] = useSearchParams();
  const { state: params } = useLocation();

  const [showFilter, setShowFilter] = useState(false);
  const [filter, setFilter] = useState(defaultFilter);
  const styleFilter = {
    overflow: 'hidden',
    height: showFilter ? '100%' : 0,
    transition: 'height 1s ease-out',
    top: isFrame ? '5vh' : '13vh'
  };

  const getData = async f => {
    var filt = { ...filter };

    if (f) {
      filt = { ...f };
    }

    var mode = searchParams.get('kd') ?? '';

    if (mode == 'S') setPref('Disapprove');
    if (mode == 'A') setPref('Approve');

    ProsesPost({
      ProsesId: 'Get',
      DateFd: !filt.date ? '' : format(filt.date, 'dd/MM/yyyy'),
      DateTd: !filt.dateT ? '' : format(filt.dateT, 'dd/MM/yyyy'),
      UserC: userData.UserId,
      User: filt.usr,
      Dept: filt.dept,
      Stat: filt.stat,
      UserDept: userData.KdDept,
      Dikem: filt.typ,
      Mode: mode
    });
  };

  const checkTemp = async () => {
    try {
      var res = await axios.get(
        `${path}?ip=${userData.IP}&usid=${userData.UserId}&docNo=&asset=&mode=E`,
        {
          headers: {
            Keys: userData.UserTkn
          }
        }
      );

      var dt = await res.data;
      if (!dt.ErrMsg) {
        navigate(`/master/mst001_formitsrentry/${dt.DocNo}/C`);
      }
    } catch (error) {
      AlertException(error);
    }
  };

  const freshData = d => {
    setData(d);
    setStatuses(d.LsStat);
    setList(d.LsData);
  };

  const ProsesPost = async d => {
    try {
      var res = await axios.post(
        path,
        {
          ...d,
          Ip: d.Ip ?? userData.IP,
          UserC: d.ProsesId == 'Get' ? d.UserC : userData.UserId,
          Dept: d.ProsesId == 'Get' ? d.Dept : userData.KdDept
        },
        {
          headers: {
            Keys: userData.UserTkn
          }
        }
      );

      var dt = await res?.data;

      if (dt?.ErrMsg) {
        PopAlertFalcon('Error', 'Error', dt.ErrMsg);
        return;
      }

      // handle prosesId
      if (dt.ProsesId == 'Create') {
        // Create -> navigate to entry
        // navigate('/master/mst001_formitsrentry');
      } else if (dt.ProsesId == 'Edit') {
        navigate(`/master/mst001_formitsrentry/${dt.DocNo}/E`, {
          state: {
            mode: 'E',
            filter: filter
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

  const handleEmp = async e => {
    var val = e.target.value;
    setFilter({ ...filter, usr: val });

    if (!val) {
      setFilter({ ...filter, usr: '' });
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
    setEmployee([]);
    setFilter({
      ...filter,
      usr: d.Value
    });
  };

  const handleAction = e => {
    var act = e.currentTarget.id;
    var key = e.currentTarget.name;
    var dt = list.find(c => c.DocNo == key);

    if (act == 'BtnEditG') {
      dt.ProsesId = 'Edit';
      ProsesPost(dt);
    } else if (act == 'BtnViewG') {
      navigate(`/master/mst001_formitsrentry/${dt.DocNo}/V`, {
        state: {
          mode: searchParams.get('kd') == 'V' ? '' : searchParams.get('kd'),
          act: params?.mode ?? data?.Mode,
          filter: filter
        }
      });
    } else if (act == 'BtnPrintG') {
      PrintPdf(dt);
    } else if (act == 'BtnDk') {
      navigate(`/master/mst001_formitsrentry/${dt.DocNo}/D`, {
        state: {
          mode: searchParams.get('kd') == 'D' ? '' : searchParams.get('kd'),
          act: params?.mode ?? data?.Mode,
          filter: filter
        }
      });
    } else if (act == 'BtnDelG') {
      confirmISI({
        title: 'Konfirmasi',
        msg: `Hapus Form Serah Terima Asset IT dengan nomor :(${dt.DocNo}) ?`,
        yesText: 'Yes',
        noText: 'No',
        noAction: () => {},
        yesAction: () => {
          var obj = { ...data };
          obj.ProsesId = 'Stat';
          dt.Stat = 'D';
          obj.Data = dt;
          ProsesPost(obj);
        }
      });
    } else if (act == 'BtnApproveG') {
      navigate(`/master/mst001_formitsrentry/${dt.DocNo}/A`, {
        state: {
          // docNo: dt.DocNo,
          mode: searchParams.get('kd'),
          act: params?.mode ?? data?.Mode,
          filter: filter
        }
      });
    } else if (act == 'BtnDisApproveG') {
      navigate(`/master/mst001_formitsrentry/${dt.DocNo}/S`, {
        state: {
          // docNo: dt.DocNo,
          mode: searchParams.get('kd'),
          act: params?.mode ?? data?.Mode,
          filter: filter
        }
      });
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

  useEffect(() => {
    if (params?.filter) {
      setFilter(params?.filter);
    }
    getDept();
    getData(params?.filter);
    checkTemp();
  }, []);

  return (
    <>
      <Row className="g-0">
        <Col lg={12}>
          <Card>
            <Card.Header className="bg-light px-1 py-2">
              <Row className="g-0">
                <Col lg="8" className="d-flex align-items-center">
                  <div className="icon-item icon-item-sm bg-soft-primary rounded-3 shadow-none me-1 bg-soft-success">
                    <span className="fas fa-table text-success"></span>
                  </div>
                  <h5 id="LblHdr" className="mb-0 ms-1">
                    {data?.Mode == 'D'
                      ? 'Pengembalian'
                      : `${pref} Serah Terima`}{' '}
                    Asset IT
                  </h5>
                </Col>
                <Col>
                  <Nav className="justify-content-end">
                    {userData?.KdDept == 'IT' &&
                      (!data?.Mode || ['C', 'E'].includes(data?.Mode)) && (
                        <BtnMenu
                          id="btnAdd"
                          title={'Add'}
                          icon={faPlus}
                          color="text-info"
                          evclick={() => {
                            // data.ProsesId = 'Create';
                            // data.Dept = userData.KdDept;
                            // data.Sect = userData.Sectn;
                            // ProsesPost(data);
                            navigate('/master/mst061_formPAIList/ST', {
                              state: {
                                mode: 'ST',
                                filter: filter
                              }
                            });
                          }}
                        ></BtnMenu>
                      )}
                    <BtnMenu
                      id="BtnSearch"
                      title="Search"
                      evclick={() => {
                        setShowFilter(!showFilter);
                      }}
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
                </Col>
              </Row>
            </Card.Header>
            <Card.Body className="p-2 pt-0">
              <Flex>
                {!isMobile ? (
                  <GridTable
                    datas={list}
                    clsname="dvListDtl"
                    maping={mappingTable}
                    headers={mappingHeader}
                    parentFunction={handleAction}
                    tbstyle={{
                      width: '1560px',
                      maxHeight: `${hlheight}px`
                    }}
                    dvstyle={{
                      width: `${width}px`,
                      height: `${hlheight}px`
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
              </Flex>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* filter box */}
      <div className="form-boxentry bg-light" style={styleFilter}>
        <div className="card">
          <div className="card-body">
            <div className="row g-1">
              <div className="col-12 col-md-4 col-lg-3">
                <div className="w-100">
                  <IsiDateTimeRange
                    label={'Date'}
                    val={filter.date}
                    valx={filter.dateT}
                    style={{ width: '100%' }}
                    labelx={'to'}
                    onchange={e => {
                      e.setHours(8);
                      setFilter({
                        ...filter,
                        date: e
                      });
                    }}
                    onchangex={e => {
                      e.setHours(8);
                      setFilter({
                        ...filter,
                        dateT: e
                      });
                    }}
                  />
                </div>
              </div>
              <div className="col-12 col-md-4 col-lg-3">
                <div className="typeahead-form-group w-100">
                  <IsiTxt label="User" val={filter.usr} onchange={handleEmp} />
                  <ListGroup className="typeahead-list-group">
                    {filter.usr &&
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
              <div className="col-12 col-md-4 col-lg-3">
                <div className="w-100">
                  <IsiTxt
                    label="Department"
                    typ="select"
                    obj={LsDept ?? []}
                    val={filter.dept}
                    onchange={e => {
                      setFilter({
                        ...filter,
                        dept: e.target.value
                      });
                    }}
                  />
                </div>
              </div>
              <div className="col-12 col-md-4 col-lg-3">
                <div className="w-100">
                  <IsiTxt
                    label="Status"
                    typ="select"
                    obj={statuses}
                    val={filter.stat}
                    onchange={e => {
                      setFilter({
                        ...filter,
                        stat: e.target.value
                      });
                    }}
                  />
                </div>
              </div>
              <div className="col-12 col-md-4 col-lg-3">
                <div className="w-100">
                  <IsiTxt
                    label="Return"
                    typ="select"
                    obj={typDdl}
                    val={filter.typ}
                    onchange={e => {
                      setFilter({
                        ...filter,
                        typ: e.target.value
                      });
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="card-footer">
            <Button
              className="btn btn-sm btn-primary me-2"
              id="btnfSearch"
              name="Search"
              onClick={() => {
                getData();
                setShowFilter(false);
              }}
            >
              Search
            </Button>
            <Button
              className="btn btn-sm btn-info me-2"
              id="btnfReset"
              name="Reset"
              onClick={() => {
                setFilter({
                  ...defaultFilter
                });
                setShowFilter(false);

                getData({ ...defaultFilter });
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

export default Mst001_FormITSRList;
