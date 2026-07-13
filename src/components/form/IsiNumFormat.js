import React from 'react';

function IsiNumFormat(nStr) {
  var minus = '';
  //alert(nStr);
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

export default IsiNumFormat;
