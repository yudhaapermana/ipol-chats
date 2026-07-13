import parse from 'html-react-parser';

function GenerateHeader(headers) {
  let colomHeader = '<thead>';
  let countIdHeader = 0;
  let clsheader = 'hdr';

  if (headers.length > 1) clsheader = '';

  headers.forEach(function (header) {
    countIdHeader++;
    //console.log('countIdHeader : ' + countIdHeader);
    colomHeader +=
      '<tr className="' + clsheader + '" key="H' + countIdHeader + '">';
    header.forEach(function (headerText) {
      let colspan = '';
      let rowspan = '';

      if (headerText[1] !== undefined) {
        if (headerText[1] == 0) headerText[1] = 1;
        colspan = 'colspan = ' + headerText[1];
      }
      if (headerText[2] !== undefined) {
        if (headerText[2] == 0) headerText[2] = 1;
        rowspan = 'rowspan = ' + headerText[2];
      }

      colomHeader +=
        '<th scope="col" className="tdcenter frezeColH" ' +
        colspan +
        ' ' +
        rowspan +
        ' > ' +
        headerText[0] +
        ' </th>';
    });
    colomHeader += '</tr>';
  });
  colomHeader += '</head>';

  return colomHeader;
}

function GenerateIsi(datas, maping, countid) {
  let colom = '';
  datas.map(data => {
    countid++;

    colom += '<tr className="" key="' + countid + '">';
    Object.values(maping).forEach(val => {
      colom += '<td className="isidata">' + data[val] + '</td>';
    });
    colom += '</tr>';

    console.log(colom);
    return colom;
  });
  return colom;
}

const GridTable = ({ datas, maping, headers }) =>
  //format maping header= //text,colspan,rowspan
  {
    let htmlHeaderTable = '';
    let htmlIsiTable = '';
    let htmlTable = '';
    htmlHeaderTable = GenerateHeader(headers);
    htmlIsiTable = GenerateIsi(datas, maping, 0);
    htmlIsiTable = '<tbody>' + htmlIsiTable + '</tbody>';

    htmlTable = htmlHeaderTable + htmlIsiTable;

    //return parse(htmlTable);
    //return <div dangerouslySetInnerHTML={{__html:htmlTable}} />;

    return (
      <>
        <table
          responsive="xl"
          id="gvlistDetail"
          className="GridItem"
          style={{ minWidth: '100%', width: 'max-content' }}
        >
          {htmlTable}
        </table>
      </>
    );
  };

export default GridTable;
