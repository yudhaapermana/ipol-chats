//import parse from 'html-react-parser';
/* eslint-disable react/prop-types */
import {
  faTrashAlt,
  faEdit,
  faEye,
  faCopy,
  faFileSignature,
  faCommentAlt,
  faFilePdf
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

function addCommas(nStr) {
  var minus = '';

  if (nStr && nStr != '') minus = nStr.toString().slice(-1);

  //nStr = parseFloat(nStr).toFixed(2);
  nStr += '';
  var x = nStr.split('.');
  var x1 = x[0];
  var x2 = x.length > 1 ? '.' + x[1] : '';
  // console.log(`nStr= ${nStr}`);
  // console.log(`x= ${x}`);
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }
  //if (x2 == '') x2 = '.00';

  var hasil = x1 + x2;

  if (minus == '-') {
    hasil = hasil + '-';
  }

  return hasil;
}

const GridCard = ({
  datas,
  maping,
  headers,
  parentFunction,
  clsname,
  dvstyle,
  tbstyle,
  modeact
}) =>
  //format header= dalam bentuk array of array of object
  //               array pertama untuk header baris ke 1
  //               array kedua untuk header baris ke 2
  //               array ketiga untuk header baris ke 3
  //               dan seterusnya.....
  //               [[{text: 'text header'}, {colSpan: 0}, {rowSpan:0}]]
  //datas = data dari list
  //maping = dalam bentuk array of object
  //         [
  //            propName:'Action',    // property name
  //            isNumber:true,        // apakah merupakan number? jika true, maka akan diformat number
  //            isAction:true,        // apakah merupakan button action?
  //            class:'text-center'   // class yang ingin diberikan
  //            col:6                 // untuk menentukan jumlah col default 2
  //         ]
  //
  //button action = dalam bentuk array string [class, title, name, value, text]
  {
    // let countIdHeader = 0;
    // let countIdTh = 0;
    // let countIdIsi = 0;
    // let countIdTd = 0;
    let clsheader = 'hdr';
    if (headers.length > 1) clsheader = '';

    let defTbStyle = { width: 'max-content' };
    if (tbstyle != '' && tbstyle != undefined)
      Object.assign(defTbStyle, defTbStyle, tbstyle);

    let defDvStyle = {
      margin: '0',
      overflow: 'auto'
    };
    if (dvstyle != '' && dvstyle != undefined)
      Object.assign(defDvStyle, defDvStyle, dvstyle);
    //console.log(datas);

    // let counthd = 0;
    // let counthddtl = 0;
    // let counthddtltmp = 0;
    // let arrHd = [];
    // headers.map(hd => {
    //   counthd++;
    //   hd.map(hdData => {
    //     let cols = hdData.colSpan;
    //     let rows = hdData.rowSpan;

    //     let dthd = "";
    //     if(cols > 0){
    //       //for(let x=0; x < cols; x++){
    //         //counthddtltmp++;
    //         for(let y=counthddtl; y < (cols + counthddtl); y++){
    //           //counthddtl++;
    //           dthd +=  hdData.text + " " + headers[counthd][y].text;
    //           console.log(`dthdpo5 = ${dthd} ${counthddtl}`);
    //           dthd = "";
    //           counthddtltmp++;
    //         }
    //         counthddtl = counthddtltmp;
    //       //}
    //     }

    //   })
    // });

    return (
      <>
        <div className={clsname + ' row'} style={defDvStyle}>
          {datas.map(data => {
            let arrActionData = [];
            let addActionData = [];
            return (
              <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 col-12 pb-3 pe-0 ps-0 ">
                <div className="card text-dark border border-200">
                  <div
                    className="card-body row p-0 ps-2 pe-2 g-1"
                    style={{ marginRight: '0px' }}
                  >
                    {maping.map(keyData => {
                      if (keyData.addbtn) {
                        addActionData = keyData.addbtn?.map(adbtn => {
                          adbtn['idEdit'] = keyData.idEdit;
                          return adbtn;
                        });
                      }
                      console.log(addActionData);

                      // console.log(`keyData nya: ${keyData.propName}`)
                      // console.log(`keyIdx nya: ${keyIdx}`)
                      {
                        keyData.isAction != true
                          ? ''
                          : (arrActionData = keyData.actcode
                              .split(',')
                              .map(x => ({
                                act: x,
                                dtbtn: keyData
                              })));
                      }
                      let col = `6`;
                      if (keyData.col !== undefined) {
                        col = keyData.col;
                      }

                      return (
                        <div className={`col-${col} mb-2`}>
                          <div className="position-relative">
                            <div className="position-absolute h-100 start-0"></div>
                            <div className=" mb-1 fs-sm--1">
                              {keyData.isAction != true ? keyData.title : ''}
                            </div>
                            <div className="d-flex align-items-center">
                              <div className="text-dark text-700 fs-sm--1">
                                {keyData.propName !== 'Action' && (
                                  <>
                                    <strong>{keyData.propName}:</strong>
                                    <div className="text-dark">
                                      {data[keyData.propName] || '-'}
                                    </div>
                                  </>
                                )}
                                {/* {keyData.isAction != true
                                ? data[keyData.propName]
                                : ''} */}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="card-footer bg-light p-2 ps-3">
                    <div className="row g-3">
                      {arrActionData.length > 0 &&
                        arrActionData.map(mp => {
                          let cond = {};
                          let dtbtn = mp.dtbtn;
                          let act = mp.act;

                          if (dtbtn.actcond != undefined) {
                            cond = dtbtn.actcond.find(x => x.btncd == act);
                            //if (co != undefined) cond = co;
                          }

                          if (cond && data[cond.propNm] != cond.validprop) {
                            return <></>;
                          }

                          let icn = {};
                          let id = '';
                          let clr = '';
                          let nm = data[dtbtn.idEdit];

                          // if (nm == '') nm = data[dtbtn.idEdit];
                          let tool = '';

                          if (modeact != 'View' && act == 'D') {
                            icn = faTrashAlt;
                            id = 'BtnDelG';
                            clr = 'text-danger';
                            tool = 'Delete';
                          } else if (modeact != 'View' && act == 'E') {
                            icn = faEdit;
                            id = 'BtnEditG';
                            clr = 'text-warning';
                            tool = 'Edit';
                          } else if (act == 'V') {
                            icn = faEye;
                            id = 'BtnViewG';
                            clr = 'text-success';
                            tool = 'View';
                          } else if (dtbtn == 'P') {
                            icn = faFilePdf;
                            id = 'BtnPrintG';
                            clr = 'text-warning';
                            tool = 'Print';
                          } else if (act == 'C') {
                            icn = faCopy;
                            id = 'BtnCopyG';
                            clr = 'text-warning';
                            tool = 'Copy';
                          } else if (modeact != 'View' && act == 'A') {
                            icn = faFileSignature;
                            id = 'BtnApproveG';
                            clr = 'text-success';
                            tool = 'Approve';
                          } else if (modeact != 'View' && act == 'R') {
                            icn = faFileSignature;
                            id = 'BtnRejectG';
                            clr = 'text-danger';
                            tool = 'Reject';
                          } else if (modeact != 'View' && act == 'U') {
                            icn = faFileSignature;
                            id = 'BtnDisApproveG';
                            clr = 'text-danger';
                            tool = 'Disapprove';
                          } else if (modeact != 'View' && act == 'T') {
                            icn = faCommentAlt;
                            id = 'BtnResponG';
                            clr = 'text-primary';
                            tool = 'Response';
                          }

                          return (
                            <div className="col-auto">
                              <button
                                type="button"
                                key={`btn${nm}${act}`}
                                id={id}
                                name={nm}
                                className={`btn btn-link p-0 ${clr}`}
                                onClick={parentFunction}
                                title={tool}
                              >
                                <FontAwesomeIcon
                                  icon={icn}
                                  className={`fs-7`}
                                />
                              </button>
                            </div>
                          );
                        })}
                      {addActionData?.length > 0 &&
                        addActionData.map(mp => {
                          let cond = {};

                          if (mp.actcond != undefined) {
                            cond = mp.actcond.find(x => x.btncd == mp.act);
                            //if (co != undefined) cond = co;
                          }

                          if (cond && data[cond.propNm] != cond.validprop) {
                            return <></>;
                          }

                          let icn = mp.icn;
                          let id = mp.id;
                          let clr = mp.color;
                          let nm = data[mp.idEdit];

                          // if (nm == '') nm = data[dtbtn.idEdit];
                          let tool = '';
                          return (
                            <div className="col-auto">
                              <button
                                type="button"
                                key={`btn${nm}${mp.act}`}
                                id={id}
                                name={nm}
                                className={`btn btn-link p-0 ${clr}`}
                                onClick={parentFunction}
                                title={tool}
                              >
                                <FontAwesomeIcon
                                  icon={icn}
                                  className={`fs-7`}
                                />
                              </button>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  };

export default GridCard;
