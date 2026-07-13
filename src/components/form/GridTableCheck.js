//import parse from 'html-react-parser';
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from 'react';
import reactStringReplace from 'react-string-replace';
import Form from 'react-bootstrap/Form';
import createMarkup from 'helpers/createMarkup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrashAlt,
  faEdit,
  faEye,
  faCopy,
  faFileSignature,
  faCommentAlt,
  faFileAlt,
  faFilePdf
} from '@fortawesome/free-solid-svg-icons';
import IsiCheck from './IsiCheck';

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

const GridTableCheck = ({
  propKey,
  datas,
  dtotal,
  maping,
  headers,
  parentFunction,
  clsname,
  dvstyle,
  tbstyle,

  clshdr,
  showtotal,
  totalpos,
  freezecol,
  handletxt,
  handlescrol,
  dsctotal,
  modeact,
  tdstyle,
  pcontdstyle,

  showcheck = false,
  oncheck
}) =>

//format header= dalam bentuk array of array of object
//               array pertama untuk header baris ke 1
//               array kedua untuk header baris ke 2
//               array ketiga untuk header baris ke 3
//               dan seterusnya.....
//               [
//                  {text: 'text header'},
//                  {colSpan: 0},
//                  {rowSpan:0}
//                  width:100          //width satuan px
//                  color:warna
//              ]
//datas = data dari list
//maping = dalam bentuk array of object
//         [
//            propName:'Action',    // property name
//            isNumber:true,        // apakah merupakan number? jika true, maka akan diformat number
//            isAction:true,        // apakah merupakan button action?
//            class:'text-center'   // class yang ingin diberikan
//            dPoint:2              // decimalpoint
//            width:100             // width satuan px
//            isTotal:false         // jika true akan di tampilkan total jika tidak kosong
//            shownol:false         // jika isnumber dan true akan di tampilkan 0 jika tidak blank
//            isEdit:false          // jika td bisa di edit
//            omitedit:             // jika td bisa di edit dan td ini di disable
//            otWarna:''            // untuk warna background dari properties ada 2 array di split | (arr[0]=backgroundcolor, arr[1]=color)
//            colSpan: 0            // untuk colspan default 0
//
//         ]
//
//button action = dalam bentuk array string [class, title, name, value, text]
{
  let ukuran = [];
  let ukrfrez = [];
  let ukrfrezn = [];
  let colrow = [];
  let countIdHeader = 0;
  let countIdTh = 0;
  let countIdIsi = 0;
  let countIdTd = 0;
  let clsheader = clshdr;
  let twd = 0;
  let twdn = 0;
  let lsidx = 0;
  let lscol = 1;
  let lebar = [];

  let strlf2 = 0;
  let strlf3 = 0;
  let strlf4 = 0;

  //console.table(dvstyle);
  if (clshdr == undefined) {
    clsheader = 'hdr';
    if (headers.length > 1) clsheader = '';
  }
  const [idcl, setidcl] = useState('');

  const [dformat, setdformat] = useState({
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const inputTxt = useRef(false);

  let defTbStyle = { width: 'max-content' };
  if (tbstyle != '' && tbstyle != undefined)
    Object.assign(defTbStyle, defTbStyle, tbstyle);

  let defDvStyle = {
    width: 'max-content',
    overflow: 'auto'
  };
  if (dvstyle != '' && dvstyle != undefined)
    Object.assign(defDvStyle, defDvStyle, dvstyle);

  const handleclick = event => {
    //console.log(event);
    //let id = event.currentTarget.id;
    //setidcl(id);
  };

  const isi = () => { };

  useEffect(() => {
    //inputTxt.current.focus();
    setidcl('');
  }, []);

  //console.log(datas);
  let istotal = false;
  let tdcolp = 0;
  let tdtot = [];
  let isisi = false;

  let tdtotal = 0;
  if (showtotal) {
    var isexit = false;
    maping.map(tddata => {
      istotal = true;

      if (tddata.isTotal) {
        isexit = true;
      } else if (!isexit) tdcolp++;
    });
  }
  // if (showtotal) {
  //   tdtotal = maping.map(tddata => {
  //     istotal = true;
  //     let dpoin = tddata.dPoint;
  //     let ppd = dformat;

  //     if (dpoin != undefined) {
  //       ppd = {
  //         minimumFractionDigits: dpoin,
  //         maximumFractionDigits: dpoin
  //       };
  //     }
  //     //console.log(ppd);
  //     let prid = tddata.propName;
  //     if (tddata.isTotal) {
  //       isisi = true;
  //       let tot = dtotal[prid];
  //       return (
  //         <td className="txtBil">
  //           {tot != 0 && tot != undefined
  //             ? tot.toLocaleString('en', ppd)
  //             : tddata.shownol == undefined
  //             ? ''
  //             : '0'}
  //         </td>
  //       );
  //     } else {
  //       if (!isisi) tdcolp++;
  //       else return <td></td>;
  //     }
  //   });
  //}
  ukrfrez.push(0);
  // alert(tdtot);
  // console.log(dtotal);

  //alert(freezecol);
  // lebar = [];
  // headers.map((header, index) => {
  //   lscol = 0;
  //   lsidx = 0;
  //   header.map((headerText, idx) => {
  //     if (headerText.colSpan == 0 || headerText.colSpan == undefined) {
  //       var lbr = lebar.find(x => x.col == index + '.' + lscol);
  //       if (lbr == undefined || lbr == null) {
  //         lebar.push({
  //           idx: lsidx,
  //           col: '',
  //           wdt: headerText.width,
  //           nm: headerText.text
  //         });
  //         lsidx++;
  //       } else {
  //         lbr.nm = headerText.text;
  //         lbr.wdt = headerText.width;

  //         lscol++;
  //       }
  //     } else if (headerText.colSpan > 0) {
  //       for (var j = 0; j < headerText.colSpan; j++) {
  //         var c = index + 1 + '.' + lscol;
  //         var lbr = lebar.find(x => x.col == index + '.' + lscol);
  //         if (lbr == undefined || lbr == null) {
  //           lebar.push({
  //             idx: lsidx,
  //             col: c
  //             // ,
  //             // wdt: headerText.width,
  //             //nm: headerText.text
  //           });
  //           lsidx++;
  //           lscol++;
  //         } else {
  //           lbr.col = c;
  //         }
  //       }
  //     }
  //   });
  // });

  //console.log(lebar);
  if (freezecol == undefined) freezecol = 0;
  let lsfz = 0;

  return (
    <>
      <div
        className={`table-responsive floatHeader frezeLeft ${clsname}`}
        style={defDvStyle}
        onScroll={handlescrol}
      >
        <table
          // responsive="xl"
          //id="gvlistDetail"
          className="GridItem"
          style={defTbStyle}
          onKeyDown={event => {
            (event.key === 'Enter' || event.key === 'Tab') && setidcl('');
            //inputTxt.current.focus();
          }} //{handleclick}}
        >
          <thead>
            {headers.map((header, index) => {
              countIdHeader++;
              lscol = 0;
              lsidx = 0;
              let cfrez = 'frezeColH';
              if (index > 0) cfrez = `frezeColH${index + 1}`;
              let wcol = 0;
              let tidx = 0;
              let lsfrz = lsfz;
              //let nix =lsfz ;
              return (
                <tr className={`${cfrez} ${clsheader}`} key={`H${index}`}>
                  {header.map((headerText, idx) => {
                    countIdTh++;
                    let colspan = '1';
                    let rowspan = '1';
                    let iscols = false;
                    lsfrz++;
                    let wlfz = headerText.width + 1;
                    //alert(headerText.colSpan);
                    if (
                      headerText.colSpan == 0 ||
                      headerText.colSpan == undefined
                    ) {
                      if (headerText.width !== undefined)
                        ukuran.push(headerText.width);
                      else ukuran.push(0);

                      var lbr = lebar.find(x => x.col == index + '.' + lscol);
                      if (lbr == undefined || lbr == null) {
                        lebar.push({
                          idx: lsidx,
                          col: '',
                          wdt: headerText.width,
                          nm: headerText.text,
                          wlf: twdn
                        });
                        lsidx++;
                        twdn += wlfz;
                      } else {
                        lbr.nm = headerText.text;
                        lbr.wdt = headerText.width;
                        lbr.wlf += wcol;
                        wcol += wlfz;
                        lscol++;
                      }
                      lsfz += 1;
                      //console.log(`${index},${idx},${headerText.width}`);
                    } else if (headerText.colSpan > 0) {
                      //nix += headerText.colSpan;

                      for (var j = 0; j < headerText.colSpan; j++) {
                        var c = index + 1 + '.' + lscol;
                        var lbr = lebar.find(
                          x => x.col == index + '.' + lscol
                        );

                        if (lbr == undefined || lbr == null) {
                          lebar.push({
                            idx: lsidx,
                            col: c,
                            wlf: twdn
                            // ,
                            // wdt: headerText.width,
                            //nm: headerText.text
                          });
                          lsidx++;
                          lscol++;
                        } else {
                          lbr.col = c;
                        }
                      }
                      lsfrz += headerText.colSpan - 1;
                      twdn += wlfz;
                    }

                    if (headerText.colSpan !== undefined) {
                      if (headerText.colSpan == 0) headerText.colSpan = 1;
                      else {
                        colspan = headerText.colSpan;
                        iscols = true;
                      }
                    }

                    if (headerText.rowSpan !== undefined) {
                      if (headerText.rowSpan == 0) headerText.rowSpan = 1;
                      rowspan = headerText.rowSpan;
                    }
                    twd += wlfz;

                    ukrfrez.push(twd);
                    //alert(`${idx},${freezecol}`);
                    //alert(headerText.color);
                    var lb = lebar.find(x => x.idx == lsfrz - 1);
                    if (index > 0) {
                      lb = lebar.find(x => x.col == index + '.' + idx);
                      if (lb) lsfrz = lb.idx + 1;
                    }
                    let lftw = lb ? lb.wlf : 0;
                    let warna = 'White';
                    if (headerText.fcolor != undefined)
                      warna = headerText.fcolor;
                    //alert(warna);

                    return (
                      <th
                        scope="col"
                        className="tdcenter"
                        colSpan={colspan}
                        rowSpan={rowspan}
                        key={`TH${idx}`}
                        width={headerText.width}
                        style={
                          freezecol > 0 && lsfrz <= freezecol
                            ? {
                              position: 'sticky',
                              zIndex: 1,
                              left: lftw,
                              //left: ukrfrez[idx],
                              backgroundColor:
                                headerText.color != undefined
                                  ? headerText.color
                                  : 'var(--falcon-badge-soft-primary-color)',
                              color:
                                headerText.fcolor != undefined
                                  ? headerText.fcolor
                                  : 'White'
                            }
                            : headerText.color != undefined
                              ? {
                                backgroundColor: headerText.color,
                                color:
                                  headerText.fcolor != undefined
                                    ? headerText.fcolor
                                    : 'White'
                              }
                              : {}
                        }
                      >
                        {reactStringReplace(
                          headerText.text,
                          '<br/>',
                          (match, i) => (
                            <br />
                          )
                        )}
                        {/* {headerText.text} */}
                      </th>
                    );
                  })}
                </tr>
              );
            })}

            {istotal && (totalpos == undefined || totalpos == 'T') && (
              <tr className={`total`}>
                {freezecol > 0 && tdcolp > freezecol ? (
                  <>
                    <td
                      className="text-end pe-2 frz"
                      colSpan={freezecol}
                      style={{ left: 0 }}
                    ></td>
                    <td className="text-end pe-2">
                      <b>{dsctotal != undefined ? dsctotal : 'Total'}</b>
                    </td>
                  </>
                ) : (
                  <td
                    colSpan={tdcolp}
                    // className={
                    //   tdcolp <= freezecol
                    //     ? 'text-end pe-2 frz'
                    //     : 'text-end pe-2'
                    // }
                    className={
                      tdcolp <= freezecol
                        ? 'text-end pe-2 frz'
                        : 'text-end pe-2'
                    }
                    style={tdcolp <= freezecol ? { left: ukrfrez[0] } : {}}
                  >
                    <b>{dsctotal != undefined ? dsctotal : 'Total'}</b>
                  </td>
                )}{' '}
                {maping.map((tddata, x) => {
                  //istotal = true;
                  let dpoin = tddata.dPoint;
                  let ppd = dformat;

                  if (dpoin != undefined) {
                    ppd = {
                      minimumFractionDigits: dpoin,
                      maximumFractionDigits: dpoin
                    };
                  }

                  let prid = tddata.propName;
                  //if (tddata.isTotal) {
                  if (x + 1 > tdcolp) {
                    isisi = true;
                    let tot = dtotal ? dtotal[prid] : 0;
                    let stl1 = '';
                    let stl2 = {};
                    if (freezecol > 0 && x < freezecol) {
                      stl1 = 'frz';
                      stl2 = { left: ukrfrez[x] };
                    }

                    //if (tot < 0) stl1 += ' text-danger';

                    return (
                      <td className={`txtBil ${stl1}`} style={stl2}>
                        {tddata.isTotal ? (
                          <b>
                            {tot != 0 && tot != undefined
                              ? tot.toLocaleString('en', ppd)
                              : tddata.shownol == undefined
                                ? '-'
                                : '0'}
                          </b>
                        ) : (
                          ''
                        )}
                      </td>
                    );
                  }
                })}
              </tr>
            )}
          </thead>

          <tbody>
            {datas.map(data => {
              countIdIsi++;
              let idtr = '';
              if (propKey != undefined) {
                //console.log(propKey);
                idtr = data[propKey];
              }

              return (
                <tr key={countIdIsi}>
                  {maping.map((keyData, idxtd) => {
                    countIdTd++;
                    let kydt = keyData.propName;
                    let idxBtn = 0;
                    let dpoin = keyData.dPoint;
                    let wd = 100;
                    let ppd = dformat;
                    //alert(dpoin);
                    if (dpoin != undefined) {
                      ppd = {
                        minimumFractionDigits: dpoin,
                        maximumFractionDigits: dpoin
                      };
                    }
                    //alert(dpoin);

                    let stl1 = '';
                    let stl2 = { 'align-content': 'baseline' };
                    let tds = false;
                    if (pcontdstyle && data[pcontdstyle] && tdstyle) {
                      stl2 = { ...tdstyle };
                      tds = true;
                    } else if (!pcontdstyle && tdstyle != undefined) {
                      stl2 = { ...tdstyle };
                      tds = true;
                    }

                    // if (tdstyle != undefined) {
                    //   stl2 = { ...tdstyle };
                    //   tds = true;
                    // }

                    if (freezecol > 0 && idxtd < freezecol) {
                      stl1 = 'frz';
                      if (tds) {
                        //if (tdstyle != undefined)
                        //Object.assign(stl2, stl2, { left: ukrfrez[idxtd] });
                        //stl2['Left'] = ukrfrez[idxtd];
                        stl2['left'] = ukrfrez[idxtd];
                        stl2['align-content'] = 'baseline';
                      } else
                        stl2 = {
                          left: ukrfrez[idxtd],
                          'align-content': 'baseline'
                        };
                    }

                    if (keyData.isAction) stl1 += ' pb-0';

                    let idd = `TD${countIdTd}`;

                    let btns = [];
                    if (keyData.isAction && keyData.actcode != undefined) {
                      //stl2 = { padding: 0, 'align-content': 'baseline' };
                      // Object.assign(stl2, stl2, {
                      //   padding: 0,
                      //   'align-content': 'baseline'
                      // });

                      btns = keyData.actcode.split(',');
                    }
                    // else {
                    //   Object.assign(stl2, stl2, {
                    //     'align-content': 'baseline'
                    //   });
                    //   //stl2 = { 'align-content': 'baseline' };
                    //   //stl2.alignContent = 'baseline';
                    // }
                    //if (keyData.isAction) console.log(btns);
                    let nedit = false;

                    if (
                      keyData.otWarna != undefined &&
                      data[keyData.otWarna] != undefined &&
                      data[keyData.otWarna] != ''
                    ) {
                      var wr = data[keyData.otWarna].split('|');

                      stl2['backgroundColor'] = wr[0];
                      if (wr.length > 1) stl2['color'] = wr[1];
                    }

                    let warna = '';
                    if (keyData.isNumber && data[kydt] < 0)
                      warna = ' text-danger';

                    if (keyData.omitedit != undefined) {
                      nedit = data[keyData.omitedit];
                      // if (data[keyData.omitedit] && keyData.isEdit)
                      //   warna += ' bg-warning';
                    }

                    let cols = '';
                    if (
                      keyData.colspan != undefined &&
                      keyData.colspan != 0
                    ) {
                      cols = `${keyData.colspan}`;
                      //alert(cols);
                    }

                    if (showcheck && idxtd == 0) {
                      var show = true;

                      if (keyData.checkcond) {
                        show =
                          data[keyData.checkcond.propNm] ===
                          keyData.checkcond.validprop;
                      }

                      return (
                        <td>
                          {keyData.ischeck && show && (
                            <div
                              style={{ float: 'left' }}
                              className="mb-3 ms-2"
                            >
                              <IsiCheck
                                cls={'customcheck-sm'}
                                change={e => oncheck(e, data)}
                              />
                            </div>
                          )}
                        </td>
                      );
                    }

                    return (
                      <td
                        key={idd}
                        colSpan={cols}
                        className={
                          keyData.isNumber != true
                            ? keyData.class != undefined
                              ? `${keyData.class} ${stl1}`
                              : `${stl1}`
                            : keyData.class != undefined
                              ? `${keyData.class} txtBil ${stl1} ${warna}`
                              : `txtBil ${stl1} ${warna}`
                        }
                        //width={ukuran[idxtd]} //  keyData.width
                        width={lebar.find(x => x.idx == idxtd).wdt}
                        style={stl2}
                        onClick={e => {
                          setidcl(`${idd}`);
                          //inputTxt.current.focus();
                        }} //{handleclick}
                      >
                        {keyData.isAction != true ? (
                          keyData.isEdit && !nedit && idcl == idd ? (
                            <Form.Control
                              id={`txt${data[keyData.idEdit]}`}
                              size="sm"
                              type="text"
                              className="tdright pe-1"
                              ref={inputTxt}
                              defaultValue={
                                keyData.isNumber != true
                                  ? data[kydt]
                                  : data[kydt] != 0
                                    ? addCommas(
                                      data[kydt].toLocaleString('en', ppd)
                                    )
                                    : keyData.shownol == undefined
                                      ? '-'
                                      : '0'
                              }
                              onKeyDown={handletxt}
                            ></Form.Control>
                          ) : keyData.isNumber != true ? (
                            <div
                              dangerouslySetInnerHTML={createMarkup(
                                isNaN(data[kydt])
                                  ? data[kydt] != undefined &&
                                    data[kydt] != null
                                    ? data[kydt].replace(/\n/g, '<br />')
                                    : ''
                                  : data[kydt]
                              )}
                            />
                          ) : data[kydt] != 0 ? (
                            addCommas(data[kydt].toLocaleString('en', ppd))
                          ) : keyData.shownol == undefined ? (
                            '-'
                          ) : (
                            '0'
                          )
                        ) : keyData.actcode == undefined ? (
                          data[kydt] &&
                          data[kydt].map((actionData, idx) => {
                            idxBtn++;
                            return (
                              //button action = dalam bentuk array string [class, title, name, value, text]
                              <div
                                key={idxBtn + 'divSeparator'}
                                style={{ display: 'inline' }}
                              >
                                <button
                                  key={idxBtn + actionData.Name}
                                  type="button"
                                  className={
                                    actionData.ClassGrid == ''
                                      ? 'btn btn-sm btn-link p-0'
                                      : actionData.ClassGrid
                                  }
                                  data-bs-toggle="tooltip"
                                  title={
                                    typeof actionData.Title === 'object'
                                      ? actionData.Name
                                      : actionData.Title
                                  }
                                  name={actionData.Name}
                                  value={actionData.Value}
                                  onClick={parentFunction}
                                >
                                  {actionData.Title}
                                </button>
                                {data[kydt].length - 1 !== idx ? (
                                  <div
                                    key={idx + 'spanSeparator'}
                                    style={{ display: 'inline' }}
                                  >
                                    |
                                  </div>
                                ) : (
                                  <div
                                    key={idx + 'spanSeparator'}
                                    style={{ display: 'inline' }}
                                  >
                                    &nbsp;
                                  </div>
                                )}
                              </div>
                            );
                          })
                        ) : (
                          <div className="row g-1 gx-2 justify-content-center">
                            {btns.map((dtbtn, i) => {
                              let cond = {};
                              if (keyData.actcond != undefined) {
                                cond = keyData.actcond.find(
                                  x => x.btncd == dtbtn
                                );
                                //if (co != undefined) cond = co;
                              }
                              if (
                                cond == undefined ||
                                data[cond.propNm] == cond.validprop
                              ) {
                                let icn = {};
                                let id = '';
                                let clr = '';
                                let nm = idtr;
                                if (nm == '') nm = data[keyData.idEdit];
                                let tool = '';
                                //alert(dtbtn);
                                if (modeact != 'View' && dtbtn == 'D') {
                                  icn = faTrashAlt;
                                  id = 'BtnDelG';
                                  clr = 'text-danger';
                                  tool = 'Delete';
                                } else if (
                                  modeact != 'View' &&
                                  dtbtn == 'E'
                                ) {
                                  icn = faEdit;
                                  id = 'BtnEditG';
                                  clr = 'text-warning';
                                  tool = 'Edit';
                                } else if (dtbtn == 'V') {
                                  icn = faFileAlt;
                                  id = 'BtnViewG';
                                  clr = 'text-success';
                                  tool = 'View';
                                } else if (dtbtn == 'P') {
                                  icn = faFilePdf;
                                  id = 'BtnPrintG';
                                  clr = 'text-warning';
                                  tool = 'Print';
                                } else if (dtbtn == 'C') {
                                  icn = faCopy;
                                  id = 'BtnCopyG';
                                  clr = 'text-warning';
                                  tool = 'Copy';
                                } else if (
                                  modeact != 'View' &&
                                  dtbtn == 'A'
                                ) {
                                  icn = faFileSignature;
                                  id = 'BtnApproveG';
                                  clr = 'text-success';
                                  tool = 'Approve';
                                } else if (
                                  modeact != 'View' &&
                                  dtbtn == 'R'
                                ) {
                                  icn = faFileSignature;
                                  id = 'BtnRejectG';
                                  clr = 'text-danger';
                                  tool = 'Reject';
                                } else if (
                                  modeact != 'View' &&
                                  dtbtn == 'U'
                                ) {
                                  icn = faFileSignature;
                                  id = 'BtnDisApproveG';
                                  clr = 'text-danger';
                                  tool = 'Disapprove';
                                } else if (
                                  modeact != 'View' &&
                                  dtbtn == 'T'
                                ) {
                                  icn = faCommentAlt;
                                  id = 'BtnResponG';
                                  clr = 'text-primary';
                                  tool = 'Response';
                                }

                                //alert(`${idtr},${nm}`);
                                return (
                                  <div className="col-auto">
                                    <button
                                      type="button"
                                      key={`btn${nm}${dtbtn}`}
                                      id={id}
                                      name={nm}
                                      className={`btn btn-link btn-sm p-0 ${clr}`}
                                      onClick={parentFunction}
                                      title={tool}
                                    >
                                      <FontAwesomeIcon
                                        icon={icn}
                                        className={`fs-9`}
                                      />
                                    </button>
                                  </div>
                                );
                              }
                            })}
                            {keyData.addbtn &&
                              keyData.addbtn.map((d, z) => {
                                let nm = idtr;
                                if (nm == '') nm = data[keyData.idEdit];
                                if (
                                  !d.propNm ||
                                  data[d.propNm] == d.validprop
                                ) {
                                  return (
                                    <div className="col-auto">
                                      <button
                                        type="button"
                                        key={`btn${d.name}${d.id}`}
                                        id={d.id}
                                        name={nm}
                                        className={`btn btn-link btn-sm p-0 ${d.color}`}
                                        onClick={parentFunction}
                                        title={d.tool}
                                      >
                                        <FontAwesomeIcon
                                          icon={d.icn}
                                          className={`fs-9`}
                                        />
                                      </button>
                                    </div>
                                  );
                                }
                              })}
                          </div>
                          //console.log(`Data = ${data[kydt]}`)
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}

            {istotal && totalpos == 'B' && (
              <tr className={`total`}>
                <td
                  colSpan={tdcolp}
                  className={
                    tdcolp < freezecol ? 'text-end pe-2 frz' : 'text-end pe-2'
                  }
                  style={tdcolp < freezecol ? { left: 0 } : {}}
                >
                  <b>{dsctotal != undefined ? dsctotal : 'Total'}</b>
                </td>{' '}
                {maping.map((tddata, x) => {
                  //istotal = true;
                  let dpoin = tddata.dPoint;
                  let ppd = dformat;

                  if (dpoin != undefined) {
                    ppd = {
                      minimumFractionDigits: dpoin,
                      maximumFractionDigits: dpoin
                    };
                  }

                  let prid = tddata.propName;
                  //if (tddata.isTotal) {
                  if (x + 1 > tdcolp) {
                    isisi = true;
                    let tot = dtotal ? dtotal[prid] : 0;
                    let stl1 = '';
                    let stl2 = {};
                    if (freezecol > 0 && x < freezecol) {
                      stl1 = 'frz';
                      stl2 = { left: ukrfrez[x] };
                    }

                    //if (tot < 0) stl1 += ' text-danger';

                    return (
                      <td className={`txtBil ${stl1}`} style={stl2}>
                        {tddata.isTotal ? (
                          <b>
                            {tot != 0 && tot != undefined
                              ? tot.toLocaleString('en', ppd)
                              : tddata.shownol == undefined
                                ? '-'
                                : '0'}
                          </b>
                        ) : (
                          ''
                        )}
                      </td>
                    );
                  }
                })}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default GridTableCheck;
