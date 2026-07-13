import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Modal } from 'bootstrap';
import $ from 'jquery';
import axios from 'axios';
import BootBox from 'react-bootbox';
import { confirm } from 'components/form/Confirm';
import { decode, encode } from 'base-64';
import { sassTrue } from 'sass';

/* eslint-disable */

const URL = process.env.REACT_APP_URL_API_LOCAL;
const lgdata = JSON.parse(localStorage.getItem('userData'));

export const getTiketList = async kd => {
  try {
    let temp = await axios({
      url: `${URL}api/Whs201_genPSfromPO/GetListNoTiket?sumber=${kd}`,
      method: 'GET',
      contentType: 'application/json; charset=utf-8',
      headers: {
        Keys: lgdata.UserTkn
      }
    });
    //setTiketList(temp.data.ListTiket);
    //console.log(temp.data);
    return temp.data;
  } catch (err) {
    alert(err);
  }
};

export function closeMdlAlert() {
  document.getElementById('btnMdlAlert').addEventListener('click', function () {
    let maxLength = document.getElementsByClassName('modal-backdrop fade show').length;
    for (let index = 0; index < maxLength; index++) {
      if (document.getElementsByClassName('modal-backdrop fade show')[0] != undefined) {
        if (document.getElementsByClassName('modal-backdrop fade show')[0].className == 'modal-backdrop fade show') document.getElementsByClassName('modal-backdrop fade show')[0].remove();
      }
    }
  });
}

//export const PopAlertFalcon = (Type, Hdr, Msg, Btn) => {
export function PopAlertFalcon(Type, Hdr, Msg, Btn, size = '') {
  //BTvar BT = "<button type='button' class='close' data-dismiss='modal' data-bs-dismiss='modal' style='color:black; opacity:1;'><i class='fas fa-times'></i></button>";
  var BT = `<div class='position-absolute top-0 end-0 mt-3  me-4 z-index-1'><button id="btnMdlAlert" type='button' class='btn-close mt-1' data-bs-dismiss='modal' onClick='' aria-label='Close'></button></div>`;
  if (Btn == 'none') BT = '';
  var CS = 'alert-danger';
  var IC = 'fa-ban';
  var TX = 'text-danger';
  if (Type == 'Warning') {
    CS = 'alert-warning';
    IC = 'fa-exclamation-triangle';
    TX = 'text-warning';
  } else if (Type == 'Info') {
    CS = 'alert-info';
    IC = 'fa-info';
    TX = 'text-info';
  } else if (Type == 'Success') {
    CS = 'alert-success';
    IC = 'fa-check-circle';
    TX = 'text-success';
  }
  if (Hdr == '') Hdr = Type;

  var dvAlert =
    "<div class='modal-dialog " +
    size +
    "'  backdrop='static'><div class='modal-content border-0 alert " +
    CS +
    " '>" +
    BT +
    "<div class='modal-body p-0'><div class='bg-light rounded-top-lg py-1 ps-3 pe-6'><h5 class='mb-1 " +
    TX +
    "'><span class='fas " +
    IC +
    "'></span> " +
    Hdr +
    '!</h5></div>' +
    "<div class='mt-1'>" +
    Msg +
    '</div></div></div></div>';

  //dvAlert += Msg + "</div>";
  $('#mdlAlert').html(dvAlert);

  var myModal = new Modal(document.getElementById('mdlAlert'), {
    keyboard: false,
    backdrop: 'static'
  });
  //$("#mdlAlert").modal();
  myModal.show();
  closeMdlAlert();
}

export function AlertException(ex) {
  var msg = ex.Message;
  //msg = ex.response.data.Message;
  if (ex.response && ex.response.data && ex.response.data.InnerException) msg = ex.response.data.InnerException.ExceptionMessage;
  else if (ex.response && ex.response.data && ex.response.data.ExceptionMessage) msg = ex.response.data.ExceptionMessage;
  else if (ex.response && ex.response.data) msg = ex.response.data.Message;
  PopAlertFalcon('error', 'error', msg, '');
}

export function CtlFocus(id) {
  document.getElementByName(id).focus();
}
export function PopConfirm(Hdr, Msg, txtCancel, txtConFirm, actCancel, actConfirm) {
  BootBox.confirm({
    title: Hdr,
    message: Msg,
    swapButtonOrder: true,
    buttons: {
      confirm: {
        label: txtConFirm //'<i class="fa fa-check"></i> Confirm'
      },
      cancel: {
        label: txtCancel //'<i class="fa fa-times"></i> Cancel'
      }
    },
    callback: function (result) {
      if (result) {
        if (actConfirm != '') window[actConfirm]();
      } else {
        if (actCancel != '') window[actCancel]();
      }
    }
  });
}

export const PopConfirm2 = ({ Type, Hdr, Msg, Btn, parentFunction, txtCancel, txtConFirm, actCancel, actConfirm }) => {
  //BTvar BT = "<button type='button' class='close' data-dismiss='modal' data-bs-dismiss='modal' style='color:black; opacity:1;'><i class='fas fa-times'></i></button>";
  var BT = "<div class='position-absolute top-0 end-0 mt-3  me-4 z-index-1'><button type='button' class='btn-close btn-close-white mt-1' data-bs-dismiss='modal' aria-label='Close'></button></div>";
  if (Btn == 'none') BT = '';
  var CS = '';
  var IC = '';
  var TX = '';
  if (Type == 'Warning') {
  } else if (Type == 'Info') {
  } else if (Type == 'Success') {
  }
  if (Hdr == '') Hdr = Type;

  Hdr = 'Text Header';
  Msg = 'Text Body';
  var dvAlert =
    // '<div role="dialog" aria-modal="true" class="fade modal show" '+
    //   'tabindex="-1" style="display: block; padding-left: 5px;">'+

    "<div class='modal-dialog'>" +
    "<div class='modal-content modalheight'>" +
    "<div class='modal-header'>" +
    "<div class='modal-title h4' id='contained-modal-title-vcenter'>" +
    Hdr +
    "<button type='button' class='btn-close' aria-label='Close'></button>" +
    '</div>' +
    '</div>' +
    "<div class='modal-body p-1' >" +
    "<div class='row p-1' >" +
    Msg +
    '</div>' +
    '</div>' +
    '<div class="p-1 modal-footer">' +
    '<button type="button" class="me-2 mb-1 float-right btn btn-secondary btn-sm" onClick={' +
    parentFunction +
    '}>No</button>' +
    '<button type="button" class="me-2 mb-1 float-right btn btn-primary btn-sm">Yes</button>' +
    '</div>' +
    '</div>' +
    '</div>' +
    ' ';

  //dvAlert += Msg + "</div>";
  $('#mdlAlert').html(dvAlert);

  var myModal = new Modal(document.getElementById('mdlAlert'), {
    keyboard: false
  });
  //$("#mdlAlert").modal();

  myModal.show();
};

export const confirmISI = async ({ title, msg, yesText, yesAction, noText, noAction }) => {
  console.log(yesAction);
  if (await confirm(`${msg}`, `${title}`, `${yesText}`, `${noText}`)) {
    yesAction();
  } else {
    noAction();
  }
};

export const confirmationISI = async ({ title = 'Confirmation', msg, yesText = 'Yes', noText = 'No' }) => {
  return await confirm(`${msg}`, `${title}`, `${yesText}`, `${noText}`, {
    enableEscape: false
  });
};

export function showReports(url, nm, orientation) {
  //orientation=0--> Potrait, orientation=1--> landscape test
  var w = 0;
  var h = 0;
  var sw = screen.width;
  var sh = screen.height - 50;
  var l = 0;
  var t = 0;

  if (orientation == 0) {
    w = 860;
    h = 650;
  } else if (orientation == 1) {
    w = 1190;
    h = 650;
  } else if (orientation == 2) {
    w = 1300;
    h = 650;
  } else if (orientation == 3) {
    w = 500;
    h = 400;
  }

  if (sw < w) {
    w = sw - 20;
  } else {
    l = (sw - w) / 2;
  }

  if (sh < h) {
    h = sh - 10;
  } else {
    t = (sh - h) / 2;
  }

  window.open(url, nm, 'menubar=no, width=' + w + ',height=' + h + ',toolbar=no,scrollbars=yes,left=' + l + ',top=' + t);
}

export const RunProgress = () => {
  //alert("Awal");
  var h = ($(window).height() - 50) / 2;
  // $('#LoadBox').css('top', h);
  $('#progressback').css('display', 'block');
  $('#LoadBox').css('display', 'block');
};
export const StopProgress = () => {
  $('#progressback').fadeOut(function () {
    $('#progressback').css('display', 'none');
  });
  $('#LoadBox').fadeOut(function () {
    // $(this).remove();
    $('#LoadBox').css('display', 'none');
  });
};

export const ToLogin = () => {
  const nav = useNavigate();

  useEffect(() => {
    //alert(lgdata.iserp);
    nav.navigate('/login/IsiLogin');
    // console.log('MASUK KE USEEFFECT');
  }, []);
};

let totReq = 0;
export const setReq = () => {
  $('#progressback').html('100');
};
export const resetReq = () => {
  $('#progressback').html('0');
};

axios.interceptors.request.use(config => {
  // trigger 'loading=true' event here
  // RunProgress();

  let totReqHtml = $('#progressback').html();
  if (totReqHtml == '') totReqHtml = 1;
  else totReqHtml++;
  $('#progressback').html(totReqHtml);

  totReq++;
  return config;
});

axios.interceptors.response.use(
  response => {
    // trigger 'loading=false' event here
    totReq--;

    let totReqHtml = $('#progressback').html();
    totReqHtml--;
    $('#progressback').html(totReqHtml);

    setTimeout(() => {
      if (totReqHtml <= 0 && totReq <= 1) {
        $('#progressback').html('');
        StopProgress();
      }
    }, 50);

    return response;
  },
  async error => {
    // trigger 'loading=false' event here
    totReq = 0;
    console.log('Masuk response axios error');
    $('#progressback').html('-99');
    StopProgress();
    if (error && error.request && error.request.status == '401') {
      sessionStorage.setItem('returnUrlAfterRefresh', window.location.pathname);
      window.location.href = '/login/RefreshToken';
      return new Promise(() => { });
      //alert(error.request.status);
      //ToLogin();
    } else return Promise.reject(error);
  }
);

export function ConvertbyteTopdf(databyte) {
  var arrrayBuffer = Base64ToArrayBuffer(databyte);

  var file = new Blob([arrrayBuffer], { type: 'application/pdf' });
  var url = window.URL || window.webkitURL;
  return url.createObjectURL(file);
}

export function ConvertbyteTotxt(databyte) {
  var arrrayBuffer = Base64ToArrayBuffer(databyte);

  var file = new Blob([arrrayBuffer], { type: 'text/plain' });
  var url = window.URL || window.webkitURL;
  return url.createObjectURL(file);
}

export function ConvertbyteToxls(databyte, filename) {
  var arrrayBuffer = Base64ToArrayBuffer(databyte);

  var file = new Blob([arrrayBuffer], { type: 'application/vnd.ms-excel' });
  var url = window.URL || window.webkitURL;

  var link = document.createElement('a');
  document.body.appendChild(link);
  link.href = url.createObjectURL(file);
  link.download = filename;
  link.click();
  document.body.removeChild(link);
  return '';
}
// const url = window.URL.createObjectURL(new Blob([response.data]));
// const link = document.createElement("a");
// link.href = url;
// link.setAttribute("download", "List_Sales.xlsx");
// document.body.appendChild(link);
// link.click();

export function Base64ToArrayBuffer(data) {
  var binaryString = decode(data);
  var binaryLen = binaryString.length;
  var bytes = new Uint8Array(binaryLen);
  for (var i = 0; i < binaryLen; i++) {
    var ascii = binaryString.charCodeAt(i);
    bytes[i] = ascii;
  }
  return bytes;
}

export function left(str, n) {
  if (n <= 0) return '';
  else if (n > String(str).length) return str;
  else return String(str).substring(0, n);
}
export function right(str, n) {
  if (n <= 0) return '';
  else if (n > String(str).length) return str;
  else {
    var iLen = String(str).length;
    return String(str).substring(iLen, iLen - n);
  }
}
export function cutleft(str, n) {
  if (String(str).Length < n) return str;
  else {
    var iLen = String(str).Length;
    return String(str).substring(n);
  }
}

export function TglDate(tgl, jam) {
  var y = left(cutleft(tgl, 6), 4);
  var m = left(cutleft(tgl, 3), 2);
  var d = left(tgl, 2);
  if (jam == '') return new Date(Number(y), Number(m) - 1, Number(d));
  else {
    var j = left(jam, 2);
    var mn = left(cutleft(jam, 3), 2);
    var dt = left(cutleft(jam, 6), 2);
    return new Date(Number(y), Number(m) - 1, Number(d), j, mn, dt);
  }
}
export function TglNumDate(tgl, jam) {
  var y = left(tgl, 4);
  var m = left(cutleft(tgl, 4), 2);
  var d = right(tgl, 2);
  if (jam == '') return new Date(Number(y), Number(m) - 1, Number(d));
  else {
    var j = left(jam, 2);
    var mn = left(cutleft(jam, 2), 2);
    var s = right(jam, 2);
    return new Date(Number(y), Number(m) - 1, Number(d), j, mn, s);
  }
}

//format :y=>tahun, M=>bulan, d=>hari, h=>jam, i=>menit, s=detik
export function DateDiff(tglfrom, tglto, format) {
  if (format.toUpperCase() == 'S') return Math.abs((tglfrom.getTime() - tglto.getTime()) / 1000);
  else if (format.toUpperCase() == 'I') return Math.abs((tglfrom.getTime() - tglto.getTime()) / 1000 / 60);
  else if (format.toUpperCase() == 'H') return Math.abs((tglfrom.getTime() - tglto.getTime()) / 1000 / 3600);
  else if (format.toUpperCase() == 'D') return Math.abs(tglfrom.getDate() - tglto.getDate());
  else if (format.toUpperCase() == 'M') return Math.abs(tglfrom.getMonth() - tglto.getMonth());
  else if (format.toUpperCase() == 'Y') return Math.abs(tglfrom.getFullYear() - tglto.getFullYear());
}
export function RemComma(val) {
  if (typeof val === 'string') return val.replace(/\,/g, '');
  else return val;
}
export function FormatStr(val, n) {
  if (typeof val === 'number') return Number(val.toFixed(n)).toLocaleString('en-US');
  else return val;
}
export function splitString(str) {
  var originalStr = str;
  var charLimit = 15;
  var slicedStringList = [];
  var flag = 1;
  while (flag) {
    if (str.length <= 15) {
      slicedStringList.push(str);
      flag = 0;
    } else {
      var tempChar = str[charLimit];
      if (tempChar == ' ' || tempChar == '\n' || tempChar == '\r') {
        slicedStringList.push(str.substring(0, charLimit));
        str = str.substring(charLimit + 1, originalStr.length);
      } else {
        var tempStr = str.substring(0, charLimit);
        var nearestSpace = tempStr.lastIndexOf(' ');
        if (nearestSpace > -1) {
          slicedStringList.push(str.substring(0, nearestSpace));
          str = str.substring(nearestSpace + 1, originalStr.length);
        } else {
          slicedStringList.push(tempStr);
          str = str.substring(charLimit + 1, originalStr.length);
        }
      }
    }
  }
  var newString = slicedStringList.join('\r\n');
  return newString;
}

export function DateStr(tgl) {
  const year = tgl.getFullYear();
  const month = String(tgl.getMonth() + 1).padStart(2, '0'); // months are 0-based
  const day = String(tgl.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

export function DateToTimeStr(tgl) {
  const hours = String(tgl.getHours()).padStart(2, '0'); // 0–23
  const minutes = String(tgl.getMinutes()).padStart(2, '0');
  const seconds = String(tgl.getSeconds()).padStart(2, '0');
  return `${hours}${minutes}${seconds}`;
}

export function Distinct(array) {
  return array.filter(function (el, index, arr) {
    return index === arr.indexOf(el);
  });
}
