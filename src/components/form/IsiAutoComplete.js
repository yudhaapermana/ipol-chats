import { faCheck, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Visibility from 'components/utilities/Visibility';
import React, { useState, useEffect, useRef } from 'react';
import { ListGroup, Form, Spinner, Button } from 'react-bootstrap';
import * as ISI from 'script/ISI.js?2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const IsiAutoComplete = ({
  id,
  label,
  val,
  onchange,
  desc,
  onchangedesc,
  disabled,
  group,
  rf,
  isinvalid,
  placeholder,
  url,
  datakey,
  type,
  datalist,
  urlprm,
  readonly,
  grpStyle,
  onkeydown,
  setIsFind,

  //KEBUTHAN UNTUK SELECTED MULTIPLE
  IsSelected, //FLAGING TRUE, FALSE
  datalistSelected, //LIST DATA SELECT
  setdatalistSelected, //Set LIST DATA SELECT
  updateFunction, // COMPONEN FOR UPDATE
  isUpdtSelected, //KEBUTUHAN UNTUK DATA KLO ADA PERUBAHAN DILUAR COMPN 0/1
  setisUpdtSelected, //KEBUTUHAN UNTUK DATA KLO ADA PERUBAHAN DILUAR COMPN 0/1
  onSelect
}) => {
  isinvalid = isinvalid ?? [];
  type = type ?? '';
  url = url ?? '';
  datakey = datakey ?? { Key: 'Value', Text: 'Value|Text' }; //pkey,listData[Val,Text]
  urlprm = urlprm ?? {};
  if (setIsFind) {
    setIsFind(false);
  }

  const [Refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state to manage data fetch status
  const [pertamax, setPertamax] = useState(true); // Loading state to manage data fetch status
  const URL = process.env.REACT_APP_URL_API;

  const lgdata = JSON.parse(localStorage.getItem('userData'));
  const link = `${URL}api/`;
  const [isNameSelected, setIsNameSelected] = useState(false);
  const [Results, setResults] = useState([]);
  const [Datas, setDatas] = useState([]);
  const [DataAwal, setDataAwal] = useState([]);
  const isrunn = useRef(false);
  // const [Inpt, setInpt] = useState('');

  const [lUrl, setlUrl] = useState('');

  if (type?.toUpperCase() == 'EMPL') {
    url = `${link}/Utility/GetEmployee?prm=%`;
    datakey = { Key: 'Value', Text: 'Value|Text' };
  } else if (type?.toUpperCase() == 'ITEM') {
    url = `${link}/Utility/GetItems?usid=${lgdata.UserId}&cls=${urlprm?.itmcls ?? ''}&ctg=`;
    datakey = { Key: 'Value', Text: 'Value|Text' };
  } else if (type?.toUpperCase() == 'CUST') {
    url = `${link}/Utility/GetCustomers?prm=${urlprm?.prm ?? ''}`;
    datakey = { Key: 'Value', Text: 'Value|Text' };
  }

  const GetDataArr = async url => {
    try {
      var obj = {};
      // console.log('GetDataArr');
      let temp = await axios({
        url: url,
        method: 'GET',
        contentType: 'application/json; charset=utf-8',
        headers: {
          Keys: lgdata.UserTkn
        }
      })
        .then(response => {
          setDatas(response.data);
          setDefault(response.data);
          setlUrl(url);
        })
        .catch(err => {
          ISI.PopAlertFalcon('error', 'error', err.message + '<br/>' + err.response.data.Message, '');
        });
    } catch (err) {
      ISI.AlertException(err);
    }
  };
  const handleInputChange = e => {
    const nameValue = e.target.value?.toUpperCase();

    onchange(e.target.value);
    onchangedesc(e.target.value);
    // setInpt(e.target.value);

    setIsNameSelected(false);
    setResults([]);
    if (nameValue.length > 1) {
      setLoading(true);
      mockResults(nameValue)
        .then(res => {
          setResults(res);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  };
  const onSelected = (id, val) => {
    if (IsSelected) {
      let dtxxx = Results.find(x => x?.[datakey.Key] == id);
      if (dtxxx != undefined) {
        let dtx = datalistSelected.find(x => x?.[datakey.Key] == id);
        let lsck = datalistSelected;
        if (dtx == undefined) {
          lsck.push(dtxxx);
        } else {
          lsck = lsck.filter(x => x?.[datakey.Key] !== id);
        }
        setdatalistSelected(lsck);
      }
      setRefresh(true);
    } else {
      onchange(id);
      if (onSelect) onSelect(id);
      onchangedesc(val);
      setIsNameSelected(true);
      setResults([]);

      if (setIsFind) {
        setIsFind(true);
      }
    }
  };

  const mockResults = keyword => {
    let rtn = new Promise((res, rej) => {
      setTimeout(() => {
        const searchResults = Datas.filter(item => {
          let rtn = '';
          datakey.Text.split('|').forEach(e => {
            rtn += item[e] + ' - ';
          });
          return rtn.includes(keyword);
        });
        res(searchResults);
      }, 500);
    });
    return rtn;
  };

  useEffect(() => {
    // if (isrunn.current === false) {
    //   if (url != '') GetDataArr(url);

    //   return () => {
    //     isrunn.current = true;
    //   };
    // }
    if (url != '') GetDataArr(url);
    else if (datalist?.length > 1) {
      setDatas(datalist);
      setDefault(datalist);
    }
    if (datalistSelected) {
      let arrAwal = [];
      datalistSelected?.map(x => {
        arrAwal.push(x);
      });
      setDataAwal(arrAwal);
    }
  }, []);

  useEffect(() => {
    // if (isrunn.current === false) {
    //   if (url != '') GetDataArr(url);

    //   return () => {
    //     isrunn.current = true;
    //   };
    // }
    if (datalist?.length > 1) {
      setDatas(datalist);
      setDefault(datalist);
    }
  }, [datalist]);

  if (pertamax) {
    if (val != '') {
      console.log('val', val, url);
      // setDefault(Datas);
      setPertamax(false);
    }
  }

  const setDefault = arrData => {
    if (val && arrData.length > 0) {
      var GetFirstData = arrData.find(item => {
        let rtn = '';
        datakey.Text.split('|').forEach(e => {
          rtn += item[e]?.toUpperCase() + ' - ';
        });
        return rtn?.toUpperCase().includes(val?.toUpperCase());
      });
      if (GetFirstData != undefined) {
        let rtn = '';
        datakey.Text.split('|').forEach(e => {
          rtn += GetFirstData[e] + ' - ';
        });
        if (rtn != '') rtn = rtn.substring(0, rtn.length - 3);
        onchange(GetFirstData[datakey.Key]);
        onchangedesc(rtn);
        // setInpt(rtn);
      }
    }
  };

  const onFocusChange = e => {
    if (lUrl != url) {
      GetDataArr(url);
    }
    e.target.select();
  };

  useEffect(() => {
    setRefresh(false);
  }, [Refresh]);

  const HandleBtnUpd = e => {
    onchange('');
    onchangedesc('');
    setIsNameSelected(true);
    setResults([]);
    updateFunction(e);

    if (datalistSelected) {
      let arrAwal = [];
      datalistSelected?.map(x => {
        arrAwal.push(x);
      });
      setDataAwal(arrAwal);
    }
  };
  const HandleBtnCncl = e => {
    setdatalistSelected(DataAwal);

    onchange('');
    onchangedesc('');
    setIsNameSelected(true);
    setResults([]);
  };

  useEffect(() => {
    if (isUpdtSelected == 1) {
      if (datalistSelected) {
        let arrAwal = [];
        datalistSelected?.map(x => {
          arrAwal.push(x);
        });
        setDataAwal(arrAwal);
      }
      setisUpdtSelected(0);
    }
  }, [isUpdtSelected]);

  const reftyphd = useRef();
  const [hghtRef, sethghtRef] = useState(0);
  useEffect(() => {
    sethghtRef(reftyphd?.current?.offsetHeight);
  }, [reftyphd?.current?.offsetHeight]);
  // console.log(reftyphd?.current?.offsetHeight);
  return (
    <>
      <Form.Group className={'typeahead-form-group ' + (group != undefined ? group : 'mb-1')}>
        {label != undefined && label != '' && <Form.Label className="mb-0 ms-1">{label}</Form.Label>}

        <Form.Control type="text" id={id + 'id'} autoComplete="off" value={val} style={{ display: 'none' }} />
        {/* <Form.Control type="text" id={id + 'val'} autoComplete="off" value={desc} style={{ display: 'none' }} /> */}
        <Form.Control
          type="text"
          id={id}
          autoComplete="off"
          onChange={handleInputChange}
          value={desc}
          placeholder={placeholder}
          ref={rf}
          isInvalid={isinvalid.length > 0 ? !isinvalid[0] : false}
          disabled={disabled}
          onFocus={onFocusChange}
          className="form-control form-control-sm"
          readOnly={readonly}
          onKeyDown={onkeydown}
        />

        <ListGroup className="typeahead-list-group" ref={reftyphd} style={grpStyle}>
          {!isNameSelected &&
            desc != '' &&
            Results.length > 0 &&
            Results.map(result => {
              let rtn = '';
              datakey.Text.split('|').forEach(e => {
                rtn += result[e] + ' - ';
              });
              if (rtn != '') rtn = rtn.substring(0, rtn.length - 3);
              let isSelected = false;
              if (IsSelected) {
                let slctd = datalistSelected?.filter(x => x?.[datakey.Key] == result[datakey.Key]);
                if (slctd?.length > 0) isSelected = true;
              }

              return (
                <>
                  <ListGroup.Item key={result[datakey.Key]} className="typeahead-list-group-item py-1" onClick={() => onSelected(result[datakey.Key], rtn)}>
                    {IsSelected ? (
                      <>
                        <span>
                          <FontAwesomeIcon icon={isSelected ? faCheck : faTimes} />
                        </span>
                        {' - '}
                      </>
                    ) : (
                      ''
                    )}
                    {rtn}
                  </ListGroup.Item>
                </>
              );
            })}
          {!Results.length && loading && (
            <div className="typeahead-spinner-container">
              <Spinner animation="border" />
            </div>
          )}
        </ListGroup>
        <Form.Control.Feedback type="invalid">{isinvalid ? isinvalid[1] : ''}</Form.Control.Feedback>

        {!isNameSelected && desc != '' && Results.length > 0 && IsSelected ? (
          <div className="btn-typeahead-list-group form-group" style={{ top: hghtRef + 55 + 'px' }}>
            <div className="row g-2">
              <div className="col-6">
                <Button size="sm" variant="warning" className="form-control" onClick={HandleBtnUpd}>
                  <span className="fas fa-save fs--2 me-1"></span>
                  Update
                </Button>
              </div>
              <div className="col-6">
                <Button size="sm" variant="danger" className="form-control" onClick={HandleBtnCncl}>
                  <span className="fas fa-times fs--2 me-1"></span>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        ) : (
          ''
        )}
      </Form.Group>
    </>
  );
};

export default IsiAutoComplete;
