import { faClipboardCheck, faCopy, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import IconButtonNew from 'components/app/kanban/IconButtonNew';
import IconButton from 'components/common/IconButton';
import GridTable from 'components/form/GridTable';
import { useBreakpoints } from 'hooks/useBreakpoints';
import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';

const Example = () => {
  let { width, height, breakpoints } = useBreakpoints();
  const [lsData, setLsData] = useState([]);

  let ghdr = [
    [
      { text: 'Act', rowSpan: 2, width: 122 },
      { text: 'Document <br/> No', rowSpan: 2, width: 100 },
      { text: 'Document <br/> Date', rowSpan: 2, width: 100 },
      { text: 'Received <br/> Date', rowSpan: 2, width: 100 },
      { text: 'Customer', rowSpan: 2, width: 416 },
      { text: 'Document <br/> Reference', rowSpan: 2, width: 180 },
      { text: 'Sales', rowSpan: 2, width: 280 },
      { text: 'Status', rowSpan: 2, width: 220 }
    ]
  ];

  let gmap = [
    {
      propName: 'Action',
      isAction: true,
      actcode: 'E,D,V',
      actcond: [
        { btncd: 'D', propNm: 'BtnDel', validprop: 'D' },
        { btncd: 'E', propNm: 'StatBtn', validprop: 'C' }
      ],
      addbtn: [
        {
          icn: faCopy,
          id: 'BtnVass',
          nm: 'DocNo',
          color: 'text-info',
          tool: 'View Visitor'
        },
        {
          icn: faEnvelope,
          id: 'BtnSend',
          nm: 'DocNo',
          color: 'text-secondary',
          tool: 'Send Invitation Link'
        },
        {
          icn: faClipboardCheck,
          id: 'BtnF',
          nm: 'DocNo',
          color: 'text-warning',
          tool: 'Selesai Kunjungan'
        }
      ],
      class: 'text-center'
    },
    { propName: 'DocNo' },
    { propName: 'DocDate', class: 'text-center' },
    { propName: 'RecDate', class: 'text-center' },
    { propName: 'Cust' },
    { propName: 'DocRef' },
    { propName: 'Sales', class: 'text-center text-uppercase' },
    { propName: 'Status', class: 'text-center' }
  ];

  let data = [
    {
      DocNo: 'CR251200004',
      DocDate: '09/12/2025',
      RecDate: '02/09/2025',
      Cust: 'YOUL CHON CHEMICAL CO., LTD.',
      DocRef: 'Email 2 September 2025',
      Sales: 'Budi Santoso',
      Status: 'Waiting for Reply Farita Triwijacahya'
    },
    {
      DocNo: 'CR251200003',
      DocDate: '08/12/2025',
      RecDate: '03/12/2025',
      Cust: 'VARION CUAN CORPORA INTER,PT.',
      DocRef: '035/QCRM/XI/2025',
      Sales: 'Siti Aminah',
      Status: 'Waiting for QAI Completion'
    },
    {
      DocNo: 'CR251200002',
      DocDate: '08/12/2025',
      RecDate: '20/11/2025',
      Cust: 'VARION CUAN CORPORA INTER,PT.',
      DocRef: '035/QCRM/XI/2025',
      Sales: 'Agus Setiawan',
      Status: 'Waiting for QAI Completion'
    },
    {
      DocNo: 'CR251200001',
      DocDate: '08/12/2025',
      RecDate: '21/11/2025',
      Cust: 'VARION CUAN CORPORA INTER,PT.',
      DocRef: '035/QCRM/XI/2025',
      Sales: 'Budi Santoso',
      Status: 'Waiting for QAI Completion'
    },
    {
      DocNo: 'CR251100001',
      DocDate: '03/12/2025',
      RecDate: '03/12/2025',
      Cust: 'VARION CUAN CORPORA INTER,PT.',
      DocRef: '035/QCRM/XI/2025',
      Sales: 'Siti Aminah',
      Status: 'Rejected'
    },
    {
      DocNo: 'CR251100030',
      DocDate: '01/12/2025',
      RecDate: '01/12/2025',
      Cust: 'SAPTAWARNA CEMERLANG, PT.',
      DocRef: '035/QCRM/XI/2025',
      Sales: 'Siti Aminah',
      Status: 'Completed'
    }
  ];

  useEffect(() => {
    setLsData(data);
  }, []);

  let htab = height - 110;
  let htabe = height - 50;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="text-primary fw-bold m-0 fs-8">Complaint Report List</h5>
        <div className="d-flex gap-2">
          <IconButtonNew iconName="plus" variant="light" className="text-primary">
            New
          </IconButtonNew>
          <IconButtonNew iconName="search" variant="light" className="text-primary">
            Search
          </IconButtonNew>
          <IconButtonNew iconName="table-outline" variant="light" className="text-primary">
            Change
          </IconButtonNew>
          <IconButtonNew iconName="help-line" variant="light" className="text-primary">
            Help
          </IconButtonNew>
          <IconButtonNew iconName="download" variant="light" className="text-primary">
            Download
          </IconButtonNew>
          <IconButtonNew iconName="printer" variant="light" className="text-primary">
            Print
          </IconButtonNew>
          <IconButtonNew iconName="logout" variant="light" className="text-primary">
            Back
          </IconButtonNew>
        </div>
      </div>
      <div>
        <GridTable
          propKey={'DocNo'}
          datas={lsData}
          headers={ghdr}
          maping={gmap}
          tbstyle={{ width: '100%' }}
          dvstyle={{
            width: 'auto',
            maxHeight: self == top ? htab - 440 : htabe - 440
          }}
          clshdr="hdr"
          clsname="dvListDtl"
          // parentFunction={handleClickDo}
        />
      </div>
    </>
  );
};

export default Example;
