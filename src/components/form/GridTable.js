//import parse from 'html-react-parser';
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from 'react';
import reactStringReplace from 'react-string-replace';
import Form from 'react-bootstrap/Form';
import createMarkup from 'helpers/createMarkup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit, faEye, faCopy, faFileSignature, faCommentAlt, faFileAlt, faFilePdf, faFilter } from '@fortawesome/free-solid-svg-icons';
import IsiTxt from './IsiTxt';
import IsiCheck from './IsiCheck';
import { TbSortAscendingLetters, TbSortDescendingLetters } from 'react-icons/tb';
import { CiFilter } from 'react-icons/ci';
import { Button, Col, Dropdown, Overlay, Row } from 'react-bootstrap';
import { MdFilterAlt, MdFilterAltOff } from 'react-icons/md';
import { PiFunnelFill, PiFunnelLight } from 'react-icons/pi';
import IsiAutoComplete from './IsiAutoComplete';
import SvgIcon from 'components/app/kanban/SvgIcon';

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

const GridTable = ({
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
  handleAutocomplete,
  onSelectionChange
}) =>
  //format header= dalam bentuk array of array of object
  //               array pertama untuk header baris ke 1
  //               array kedua untuk header baris ke 2
  //               array ketiga untuk header baris ke 3
  //               dan seterusnya.....
  //               [
  //                  {text: 'text header'},
  //                  {colSpan: 0},
  //                  {rowSpan:0},
  //                  width:100,          //width satuan px
  //                  color:warna,
  //                  isSort:false,      // jika true akan ditampilkan fitur sort asc dan desc
  //                  isFilter:false,    // jika true akan ditampilkan fitur filter
  //                  isVertical: false  // jika true akan menampilkan ikon Sort dan Filter berpindah ke bawah (vertikal)
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
  //            cellclick:true        // cell bisa di click
  //            isTxt:false           // jika true, td akan ditampilkan menjadi textbox
  //            isCheck:false         // jika true, td akan ditampikan menjadi checkbox
  //            typ:''                // jika isTxt, diisi dengan tipe dari textbox dan jika isCheck, diisi dengan 'switch' apabila ingin td menjadi switch
  //            obj:[]                // jika typ berisi select, wajib diisi dengan
  //            css:'fs-10'           // jika isTxt atau isCheck, diisi dengan class yang ingin diberikan untuk textbox atau checkbox
  //            validProp:''          // jika isCheck, diisi dengan data valid propName
  //            idDisabled:''         // jika isCheck atau isTxt, diisi dengan property name, apabila ingin checkbox atau textbox memiliki kondisi disabled
  //            validDisabled:''      // diisi dengan data valid dari idDisabled, untuk memenuhi kondisi disabled
  //         ]
  //
  //button action = dalam bentuk array string [class, title, name, value, text]

  // button switch = penambahan properti komponen Form.Check menggunakan propName: 'keyData.isCheckMx', // memastikan bahwa kolom yang sedang diproses memang tipe kolom 'ChekBox/Switch',
  // !nedit: Jika tabel tidak dalam mode edit, switch bisa ditampilkan sebagai kontrol aksi..
  // propName komponen switch = Form.Check type = switch
  // switch-corona, switch-flame = penambahan css untuk mengubah warna komponen switch
  // Pemanahan kondisi prop shownoil false di FormControl

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

    const [editVal, setEditVal] = useState('');
    const [editDesc, setEditDesc] = useState('');

    const inputTxt = useRef(false);

    let defTbStyle = { width: 'max-content' };
    if (tbstyle != '' && tbstyle != undefined) Object.assign(defTbStyle, defTbStyle, tbstyle);

    let defDvStyle = {
      width: 'max-content',
      overflow: 'auto',
      scrollbarWidth: 'thin'
    };
    if (dvstyle != '' && dvstyle != undefined) Object.assign(defDvStyle, defDvStyle, dvstyle);

    const handleclick = event => {
      //console.log(event);
      //let id = event.currentTarget.id;
      //setidcl(id);
    };

    const isi = () => {};

    useEffect(() => {
      //inputTxt.current.focus();
      setidcl('');
    }, []);

    //console.log(datas);
    let istotal = false;
    let tdcolp = 0;
    let tdcolp2 = 0;
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

    // Sort
    const [masterDatas, setMasterDatas] = useState([]);
    const [displayDatas, setDisplayDatas] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: '', isAsc: true });
    const [selectedCheckboxes, setSelectedCheckboxes] = useState({});
    const [search, setSearch] = useState('');

    useEffect(() => {
      if (!datas || !Array.isArray(datas) || datas.length === 0) {
        setMasterDatas([]);
        setDisplayDatas([]);
        return;
      }

      const isDataLengthDifferent = datas.length !== masterDatas.length;
      const isFirstItemDifferent = propKey && datas[0] && masterDatas[0] && datas[0][propKey] !== masterDatas[0][propKey];

      if (!propKey || isDataLengthDifferent || isFirstItemDifferent) {
        setMasterDatas(datas);

        const filtered = applyFilters(datas, selectedCheckboxes);
        setDisplayDatas(filtered);

        setSortConfig({ key: '', isAsc: true });
      } else {
        setMasterDatas(datas);
        setDisplayDatas(prevDisplay => {
          const updatedDisplay = prevDisplay.map(item => {
            const updatedItem = datas.find(d => d[propKey] === item[propKey]);
            return updatedItem ? { ...item, ...updatedItem } : item;
          });

          return applyFilters(updatedDisplay, selectedCheckboxes);
        });
      }
    }, [datas, propKey]);

    // FIlter
    const handleSortInternal = sortId => {
      const currentData = [...displayDatas];

      if (currentData.length < 2) return;

      const newDirectionIsAsc = sortConfig.key === sortId ? !sortConfig.isAsc : true;

      const getComparableValue = val => {
        if (val === null || val === undefined || val === '') return '';

        if (typeof val === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(val)) {
          const [day, month, year] = val.split('/');
          return new Date(`${year}-${month}-${day}`).getTime();
        }

        const numericVal = parseFloat(val.toString().replace(/,/g, ''));
        return isNaN(numericVal) ? val.toString().toLowerCase() : numericVal;
      };

      const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

      currentData.sort((a, b) => {
        const aVal = getComparableValue(a[sortId]);
        const bVal = getComparableValue(b[sortId]);

        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return newDirectionIsAsc ? aVal - bVal : bVal - aVal;
        }

        const comparison = collator.compare(aVal.toString(), bVal.toString());
        return newDirectionIsAsc ? comparison : -comparison;
      });

      setSortConfig({ key: sortId, isAsc: newDirectionIsAsc });
      setDisplayDatas(currentData);
    };

    const getUniqueValues = (sortId, search) => {
      if (!Array.isArray(masterDatas)) {
        return [];
      }

      const allValues = masterDatas.map(item => {
        const val = item[sortId];
        return val !== null && val !== undefined ? val.toString().trim() : '';
      });

      let unique = [...new Set(allValues)].filter(val => val !== '');

      if (search) {
        unique = unique.filter(val => val.toLowerCase().includes(search.toLowerCase()));
      }

      return unique.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
    };

    useEffect(() => {
      if (!masterDatas || masterDatas.length === 0) return;

      let hasChanged = false;
      const newSelections = { ...selectedCheckboxes };

      const activeSortIds = Object.keys(newSelections);

      activeSortIds.forEach(sortId => {
        const currentFilters = newSelections[sortId] || [];
        if (currentFilters.length === 0) return;

        const latestUniqueOptions = getUniqueValues(sortId, '');

        const validFilters = currentFilters.filter(val => latestUniqueOptions.includes(val));

        if (validFilters.length !== currentFilters.length) {
          hasChanged = true;
          if (validFilters.length > 0) {
            newSelections[sortId] = validFilters;
          } else {
            delete newSelections[sortId];
          }
        }
      });

      if (hasChanged) {
        setSelectedCheckboxes(newSelections);
        const filteredData = applyFilters(masterDatas, newSelections);
        setDisplayDatas(filteredData);
      }
    }, [masterDatas]);

    const applyFilters = (dataToFilter, selections) => {
      return dataToFilter.filter(item => {
        return Object.keys(selections).every(key => {
          const criteria = selections[key];
          if (!criteria || criteria.length === 0) return true;

          const itemValue = item[key] !== null && item[key] !== undefined ? item[key].toString().trim() : '';

          return criteria.includes(itemValue);
        });
      });
    };

    const handleCheckboxToggle = (sortId, value) => {
      const currentSelections = selectedCheckboxes[sortId] || [];
      let updatedSelections;

      setSortConfig({ key: '', isAsc: true });

      if (currentSelections.includes(value)) {
        updatedSelections = currentSelections.filter(v => v !== value);
      } else {
        updatedSelections = [...currentSelections, value];
      }

      const newSelections = { ...selectedCheckboxes, [sortId]: updatedSelections };

      if (updatedSelections.length === 0) {
        delete newSelections[sortId];
      }
      setSelectedCheckboxes(newSelections);      
      if (onSelectionChange) {
        onSelectionChange(newSelections);
      }

      const filteredData = applyFilters(masterDatas, newSelections);
      setDisplayDatas(filteredData);
    };

    const handleResetFilter = sortId => {
      const newSelections = { ...selectedCheckboxes };
      delete newSelections[sortId];
      setSelectedCheckboxes(newSelections);
      setSearch('');
      const filteredData = applyFilters(masterDatas, newSelections);
      setDisplayDatas(filteredData);
    };
    // End Filter

    const getMappingIndex = (headers, mapping) => {
      const grid = [];
      const cellMappings = [];

      if (Array.isArray(headers)) {
        headers.forEach((row, rowIndex) => {
          let colIndex = 0;
          let newColIndex = 0;

          if (Array.isArray(row)) {
            row.forEach(cell => {
              while (grid[rowIndex] && grid[rowIndex][colIndex]) {
                colIndex++;
              }

              for (let r = 0; r < (cell.rowSpan || 1); r++) {
                for (let c = 0; c < (cell.colSpan || 1); c++) {
                  const targetRow = rowIndex + r;
                  const targetCol = colIndex + c;
                  if (!grid[targetRow]) grid[targetRow] = [];
                  grid[targetRow][targetCol] = true;
                }
              }

              cellMappings.push({
                rowIndex,
                text: cell.text,
                colIndex: newColIndex,
                propName: mapping[colIndex]?.propName
              });

              newColIndex++;
              colIndex += cell.colSpan || 1;
            });
          }
        });
      }

      return cellMappings;
    };

    const cellMappings = getMappingIndex(headers, maping);

    const [openFilterId, setOpenFilterId] = useState(null);
    const [filterTarget, setFilterTarget] = useState(null);

    const handleIconClick = (e, id) => {
      setFilterTarget(e.currentTarget);
      setOpenFilterId(openFilterId === id ? null : id);
      setSearch('');
    };

    const getStatusBadge = (status = '') => {
      const s = status?.toLowerCase();

      const statusMap = {
        'bg-info-highlight': ['waiting for reply'],
        'bg-success-highlight': ['approved', 'done', 'finished', 'completed'],
        'bg-primary-highlight': ['on going'],
        'bg-warning-highlight text-dark-subtle': ['pending', 'waiting for', 'process'],
        'bg-danger-highlight': ['rejected', 'cancel', 'failed', 'deleted'],
        'bg-secondary-highlight': ['draft', 'hold']
      };

      const badgeClass = Object.keys(statusMap).find(key => statusMap[key].some(val => s.includes(val)));

      return badgeClass;
    };

    return (
      <>
        <div className={`table-responsive floatHeader frezeLeft ${clsname}`} style={defDvStyle} onScroll={handlescrol}>
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
                      if (headerText.colSpan == 0 || headerText.colSpan == undefined) {
                        if (headerText.width !== undefined) ukuran.push(headerText.width);
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
                          var lbr = lebar.find(x => x.col == index + '.' + lscol);

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
                      if (headerText.fcolor != undefined) warna = headerText.fcolor;
                      //alert(warna);

                      const currentMap = cellMappings.find(m => m.colIndex === idx && m.rowIndex === index);
                      const autoSortId = currentMap?.propName;

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
                                  backgroundColor: headerText.color != undefined ? headerText.color : 'var(--falcon-badge-soft-primary-color)',
                                  color: headerText.fcolor != undefined ? headerText.fcolor : 'White'
                                }
                              : headerText.color != undefined
                              ? {
                                  backgroundColor: headerText.color,
                                  color: headerText.fcolor != undefined ? headerText.fcolor : 'White'
                                }
                              : {}
                          }
                        >
                          <div className={`d-flex align-items-center justify-content-center gap-1 ${headerText.isVertical ? 'flex-column' : ''}`}>
                            <span className="d-flex align-items-center">
                              {reactStringReplace(headerText.text, '<br/>', (match, i) => (
                                <br key={i} />
                              ))}
                            </span>
                            <div className="d-flex align-items-center">
                              {headerText.isSort && autoSortId && (
                                <div onClick={() => handleSortInternal(autoSortId)}>
                                  {sortConfig.key === autoSortId && sortConfig.isAsc ? (
                                    <TbSortAscendingLetters size={16} className="text-white cursor-pointer" />
                                  ) : sortConfig.key === autoSortId && !sortConfig.isAsc ? (
                                    <TbSortDescendingLetters size={16} className="text-white cursor-pointer" />
                                  ) : (
                                    <TbSortAscendingLetters size={16} className="text-light cursor-pointer" style={{ opacity: 0.6 }} />
                                  )}
                                </div>
                              )}
                              {headerText.isFilter && autoSortId && (
                                <>
                                  <div onClick={e => handleIconClick(e, autoSortId)} className="cursor-pointer d-inline-block">
                                    {selectedCheckboxes[autoSortId] ? <PiFunnelFill size={15} className="text-white" /> : <PiFunnelFill size={15} className="text-light" style={{ opacity: 0.6 }} />}
                                  </div>
                                  <Overlay target={filterTarget} show={openFilterId === autoSortId} placement="bottom-start" rootClose onHide={() => setOpenFilterId(null)}>
                                    {({ placement, arrowProps, show: _show, popper, ...props }) => (
                                      <div
                                        {...props}
                                        className="shadow rounded-3 bg-light pb-2 px-2 pt-0 overflow-y-auto"
                                        style={{
                                          ...props.style,
                                          minWidth: '15rem',
                                          height: 'fit-content',
                                          maxHeight: '20rem',
                                          width: headerText.width,
                                          zIndex: 10000
                                        }}
                                      >
                                        <div
                                          className="pt-2 position-sticky top-0 bg-light"
                                          style={{
                                            zIndex: 2,
                                            marginTop: '-1px'
                                          }}
                                        >
                                          <p className="fw-bold fs-10 m-0 text-dark mb-1">Filter</p>
                                          <Row className="g-0 align-items-start">
                                            <Col className="pe-2">
                                              <IsiTxt id={autoSortId} val={search} onchange={e => setSearch(e.target.value)} css="px-1 fs-10 fw-light shadow-none" />
                                            </Col>
                                            <Col className="col-auto w-fit">
                                              <Button className="px-1 p-0 bg-200 text-dark border-0" title="Reset" onClick={() => handleResetFilter(autoSortId)}>
                                                <MdFilterAltOff />
                                              </Button>
                                            </Col>
                                          </Row>
                                          <hr className="border-secondary mt-2" />
                                        </div>

                                        <div className="mt-3">
                                          {getUniqueValues(autoSortId, search).map((val, idx) => (
                                            <IsiCheck
                                              key={idx}
                                              name={headerText.name}
                                              txt={val}
                                              change={() => handleCheckboxToggle(autoSortId, val)}
                                              ischeck={selectedCheckboxes[autoSortId]?.includes(val) || false}
                                              cls={'customcheck-sm fw-light text-dark'}
                                              fs={'fs-11'}
                                              id={autoSortId}
                                            />
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </Overlay>
                                </>
                              )}
                            </div>
                          </div>

                          {headerText.isbtn &&
                            headerText.propbtn.map((d, z) => {
                              if (!d.propNm) {
                                return (
                                  <div className="col-auto">
                                    <button type="button" key={`btn${d.name}${d.id}`} id={d.id} name={d.id} className={`btn btn-link btn-sm p-0 ${d.color}`} onClick={parentFunction} title={d.tool}>
                                      <FontAwesomeIcon icon={d.icn} className={`fs-9`} />
                                    </button>
                                  </div>
                                );
                              }
                            })}
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
                      <td className="text-end pe-2 frz" colSpan={freezecol} style={{ left: 0 }}>
                        <b>{dsctotal != undefined ? dsctotal : 'Total'}</b>
                      </td>
                      <td className="text-end pe-2" colSpan={tdcolp - freezecol}></td>
                    </>
                  ) : (
                    <td
                      colSpan={tdcolp}
                      // className={
                      //   tdcolp <= freezecol
                      //     ? 'text-end pe-2 frz'
                      //     : 'text-end pe-2'
                      // }
                      className={tdcolp <= freezecol ? 'text-end pe-2 frz' : 'text-end pe-2'}
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

                      if (tddata.IsRed && dtotal[tddata.IsRed] === true) {
                        stl2['backgroundColor'] = '#d62020';
                        stl2['color'] = 'white';
                      }

                      //if (tot < 0) stl1 += ' text-danger';

                      return (
                        <td className={`txtBil ${stl1}`} style={stl2}>
                          {tddata.isTotal ? <b>{tot != 0 && tot != undefined ? tot?.toLocaleString('en', ppd) : tddata.shownol == undefined ? '-' : '0'}</b> : ''}
                        </td>
                      );
                    }
                  })}
                </tr>
              )}
            </thead>

            <tbody>
              {displayDatas.map(data => {
                countIdIsi++;
                let idtr = '';
                if (propKey != undefined) {
                  //console.log(propKey);
                  idtr = data[propKey];
                }

                //console.log(idtr);
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

                      if (keyData.otWarna != undefined && data[keyData.otWarna] != undefined && data[keyData.otWarna] != '') {
                        var wr = data[keyData.otWarna].split('|');

                        stl2['backgroundColor'] = wr[0];
                        if (wr.length > 1) stl2['color'] = wr[1];
                      }

                      let warna = '';
                      if (keyData.isNumber && data[kydt] < 0) warna = ' text-danger';

                      if (keyData.omitedit != undefined) {
                        nedit = data[keyData.omitedit];
                        // if (data[keyData.omitedit] && keyData.isEdit)
                        //   warna += ' bg-warning';
                      }

                      let cols = '';
                      if (keyData.colspan != undefined && keyData.colspan != 0) {
                        cols = `${keyData.colspan}`;
                        //alert(cols);
                      }
                      if (keyData.cellclick && data[keyData.key]) stl2['cursor'] = 'pointer';

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
                            if (idcl !== idd) {
                              setidcl(`${idd}`);
                              if (keyData.isAutocomplete) {
                                setEditVal(data[kydt]);
                                setEditDesc(data[kydt]);
                              }
                            }

                            if (keyData.cellclick && data[keyData.key]) {
                              //alert('click');
                              e.currentTarget.id = data[keyData.key];

                              parentFunction(e);
                            }
                            //inputTxt.current.focus();
                          }} //{handleclick}
                        >
                          {keyData.isAction != true ? (
                            keyData.isCheckMx && !nedit ? (
                              (kydt === 'Crn' && data.IsCrn === true) || (kydt === 'Flme' && data.IsFlme === true) ? (
                                <div id={`chk${kydt}|${data.Loc}`} onClick={e => parentFunction(e)} style={{ cursor: 'pointer', display: 'inline-block' }}>
                                  <Form.Check
                                    type="switch"
                                    id={`chk${kydt}|${data.Loc}`}
                                    /*  */
                                    checked={data[kydt] == 1}
                                    className={kydt === 'Crn' ? 'switch-corona' : 'switch-flame'}
                                    onChange={() => {}}
                                    readOnly
                                    style={{ cursor: 'pointer' }}
                                  />
                                </div>
                              ) : null
                            ) : keyData.isAutocomplete && !nedit && idcl == idd ? (
                              <IsiAutoComplete
                                id={`ac${data[keyData.idEdit]}`}
                                val={editVal}
                                desc={editDesc}
                                onchange={val => {
                                  setEditVal(val);
                                  //handleAutocomplete(val, data, keyData);
                                  //setidcl('');
                                }}
                                onchangedesc={val => {
                                  setEditDesc(val);
                                }}
                                type={keyData.autocompleteType}
                                onkeydown={e => {
                                  if (e.key === 'Enter') {
                                    handleAutocomplete(editVal, data, keyData);
                                    setidcl('');
                                  }
                                }}
                                onSelect={val => {
                                  handleAutocomplete(val, data, keyData);
                                  setidcl('');
                                }}
                                urlprm={keyData.urlprm}
                                url={keyData.url}
                              />
                            ) : keyData.isTxt ? (
                              (() => {
                                let nm = idtr || data[keyData.idEdit];
                                let dataObj = keyData.obj;
                                if (!dataObj && keyData?.objprop) {
                                  dataObj = data[keyData.objprop];
                                }
                                if (!dataObj && keyData?.objid) {
                                  dataObj = keyData.objid.find(x => x.ID == nm)?.ListData;
                                  if (!dataObj) dataObj = [];
                                }
                                dataObj = dataObj || [];
                                return (
                                  <div className="col-auto">
                                    <IsiTxt
                                      // key={`${nm}-${keyData.propName}`}
                                      id={keyData.propName}
                                      name={nm}
                                      typ={keyData.typ}
                                      val={data[keyData.propName] === 0 || !data[keyData.propName] ? '' : data[keyData.propName]}
                                      dval={''}
                                      isnumber={keyData.isNumber}
                                      onchange={handletxt}
                                      css={`fs-11 px-1 py-0, ${keyData.css}`}
                                      style={{ marginBottom: '-0.3rem' }}
                                      // obj={keyData.obj}
                                      obj={dataObj}
                                      onkeydown={handletxt}
                                      disabled={keyData.idDisabled && data[keyData.idDisabled] === keyData.validDisabled}
                                      maxlength={keyData.maxlength}
                                    />
                                  </div>
                                );
                              })()
                            ) : keyData.isCheck ? (
                              (() => {
                                let nm = idtr || data[keyData.idEdit];
                                return (
                                  <div className="col-auto">
                                    <IsiCheck
                                      type={keyData.typ}
                                      id={keyData.propName}
                                      cls={`fs-10 ${keyData.css} ${keyData.typ === 'switch' ? '' : 'customcheck-sm d-inline-block ms-2'}`}
                                      name={nm}
                                      ischeck={data[keyData.propName] === keyData.validProp}
                                      change={handletxt}
                                      disabled={keyData.idDisabled && data[keyData.idDisabled] === keyData.validDisabled}
                                    />
                                  </div>
                                );
                              })()
                            ) : keyData.isEdit && !nedit && idcl == idd ? (
                              <Form.Control
                                id={`txt${data[keyData.idEdit]}`}
                                size="sm"
                                type="text"
                                className={`${keyData.class} pe-1`}
                                ref={inputTxt}
                                defaultValue={
                                  keyData.isNumber != true
                                    ? data[kydt]
                                    : data[kydt] != 0
                                    ? addCommas(data[kydt]?.toLocaleString('en', ppd))
                                    : keyData.shownol === false
                                    ? ''
                                    : keyData.shownol == undefined
                                    ? '-'
                                    : '0'
                                }
                                onKeyDown={handletxt}
                                style={{ textAlign: keyData.class?.includes('text-start') ? 'left' : 'right' }}
                              ></Form.Control>
                            ) : keyData.isNumber != true ? (
                              <div
                                className={`${
                                  keyData.propName === 'Status' || keyData.propName === 'StatusDesc' || keyData.propName === 'StatD'
                                    ? getStatusBadge(data[kydt]) + ' rounded-pill text-black fs-12 font-sans-serif custom-badge d-flex align-items-center justify-content-center justify-content-center'
                                    : ''
                                }`}
                                dangerouslySetInnerHTML={createMarkup(isNaN(data[kydt]) ? (data[kydt] != undefined && data[kydt] != null ? data[kydt].replace(/\n/g, '<br />') : '') : data[kydt])}
                              />
                            ) : data[kydt] != 0 ? (
                              addCommas(data[kydt]?.toLocaleString('en', ppd))
                            ) : keyData.shownol === false ? (
                              ''
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
                                <div key={idxBtn + 'divSeparator'} style={{ display: 'inline' }}>
                                  <button
                                    key={idxBtn + actionData.Name}
                                    type="button"
                                    className={actionData.ClassGrid == '' ? 'btn btn-sm btn-link p-0' : actionData.ClassGrid}
                                    data-bs-toggle="tooltip"
                                    title={typeof actionData.Title === 'object' ? actionData.Name : actionData.Title}
                                    name={actionData.Name}
                                    value={actionData.Value}
                                    onClick={parentFunction}
                                  >
                                    {actionData.Title}
                                  </button>
                                  {data[kydt].length - 1 !== idx ? (
                                    <div key={idx + 'spanSeparator'} style={{ display: 'inline' }}>
                                      |
                                    </div>
                                  ) : (
                                    <div key={idx + 'spanSeparator'} style={{ display: 'inline' }}>
                                      &nbsp;
                                    </div>
                                  )}
                                </div>
                              );
                            })
                          ) : (
                            <div className="row g-1 gx-2 justify-content-center pb-1">
                              {btns.map((dtbtn, i) => {
                                let cond = {};
                                if (keyData.actcond != undefined) {
                                  cond = keyData.actcond.find(x => x.btncd == dtbtn);
                                  //if (co != undefined) cond = co;
                                }
                                if (cond == undefined || data[cond.propNm] == cond.validprop) {
                                  let icn = {};
                                  let id = '';
                                  let clr = '';
                                  let nm = idtr;
                                  if (nm == '') nm = data[keyData.idEdit];
                                  let tool = '';
                                  //alert(dtbtn);
                                  if (modeact != 'View' && dtbtn == 'D') {
                                    icn = faTrashAlt && 'trash-01';
                                    id = 'BtnDelG';
                                    clr = 'text-danger';
                                    tool = 'Delete';
                                  } else if (modeact != 'View' && dtbtn == 'E') {
                                    icn = faEdit && 'edit';
                                    id = 'BtnEditG';
                                    clr = 'text-primary';
                                    tool = 'Edit';
                                  } else if (dtbtn == 'V') {
                                    icn = faFileAlt && 'file-05';
                                    id = 'BtnViewG';
                                    clr = 'text-primary';
                                    tool = 'View';
                                  } else if (dtbtn == 'P') {
                                    icn = faFilePdf && 'printer';
                                    id = 'BtnPrintG';
                                    clr = 'text-primary';
                                    tool = 'Print';
                                  } else if (dtbtn == 'C') {
                                    icn = faCopy && 'copy-right';
                                    id = 'BtnCopyG';
                                    clr = 'text-primary';
                                    tool = 'Copy';
                                  } else if (modeact != 'View' && dtbtn == 'A') {
                                    icn = faFileSignature && 'approve';
                                    id = 'BtnApproveG';
                                    clr = 'text-primary';
                                    tool = 'Approve';
                                  } else if (modeact != 'View' && dtbtn == 'R') {
                                    icn = faFileSignature && 'disapprove';
                                    id = 'BtnRejectG';
                                    clr = 'text-danger';
                                    tool = 'Reject';
                                  } else if (modeact != 'View' && dtbtn == 'U') {
                                    icn = faFileSignature && 'cancel-right';
                                    id = 'BtnDisApproveG';
                                    clr = 'text-danger';
                                    tool = 'Disapprove';
                                  } else if (modeact != 'View' && dtbtn == 'T') {
                                    icn = faCommentAlt && 'message-square';
                                    id = 'BtnResponG';
                                    clr = 'text-primary';
                                    tool = 'Response';
                                  }

                                  //alert(`${idtr},${nm}`);
                                  return (
                                    <div className={`${dtbtn ? 'col-auto' : 'd-none'}`} key={i}>
                                      <button
                                        type="button"
                                        key={`btn${nm}${dtbtn}`}
                                        id={id}
                                        name={nm}
                                        className={`${
                                          dtbtn ? 'border-0 rounded-1 custom-btn-table bg-primary-highlight p-0 d-flex align-items-center justify-content-center' : 'btn btn-link btn-sm p-0'
                                        } ${clr}`}
                                        onClick={parentFunction}
                                        title={tool}
                                      >
                                        <SvgIcon name={icn} size={14} />
                                        {/* <FontAwesomeIcon icon={icn} className={`fs-12`} /> */}
                                      </button>
                                    </div>
                                  );
                                }
                              })}
                              {keyData.addbtn &&
                                keyData.addbtn.map((d, z) => {
                                  let nm = idtr;
                                  if (nm == '') nm = data[keyData.idEdit];
                                  if (!d.propNm || data[d.propNm] == d.validprop) {
                                    return (
                                      <div className="col-auto">
                                        <button
                                          type="button"
                                          key={`btn${d.name}${d.id}`}
                                          id={d.id}
                                          name={nm}
                                          className={`${d.icn ? 'border-0 rounded-2 custom-btn-table d-flex align-items-center justify-content-center bg-primary-highlight' : ''} ${d.color}`}
                                          onClick={parentFunction}
                                          title={d.tool}
                                        >
                                          <FontAwesomeIcon icon={d.icn} className={`fs-12`} />
                                        </button>
                                      </div>
                                    );
                                  }
                                })}
                              {keyData.addcb &&
                                keyData.addcb.map((d, z) => {
                                  let nm = idtr || data[keyData.idEdit];

                                  if (!d.propNm || data[d.propNm] !== undefined) {
                                    return (
                                      <div className="col-auto" key={z}>
                                        <Form.Check type="checkbox" id={`${d.id}`} name={nm} className="customcheck-sm" onChange={parentFunction} checked={Number(data[d.propNm]) === 1} />
                                      </div>
                                    );
                                  }
                                  return null;
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
                  <td colSpan={tdcolp} className={tdcolp < freezecol ? 'text-end pe-2 frz' : 'text-end pe-2'} style={tdcolp < freezecol ? { left: 0 } : {}}>
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

                      if (tddata.IsRed && dtotal[tddata.IsRed] === true) {
                        stl2['backgroundColor'] = '#d62020';
                        stl2['color'] = 'white';
                      }

                      //if (tot < 0) stl1 += ' text-danger';

                      return (
                        <td className={`txtBil ${stl1}`} style={stl2}>
                          {tddata.isTotal ? <b>{tot != 0 && tot != undefined ? tot?.toLocaleString('en', ppd) : tddata.shownol == undefined ? '-' : '0'}</b> : ''}
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

export default GridTable;
