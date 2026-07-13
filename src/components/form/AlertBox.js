import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import reactStringReplace from 'react-string-replace';

function AlertBox({ type, hdr, msg, show, handleClose }) {
  //let msgg = msg.replace('\n', <br />);
  let cs = 'alert-danger';
  let IC = 'fa-ban';
  let TX = 'text-danger';
  if (type == 'Warning') {
    cs = 'alert-warning';
    IC = 'fa-exclamation-triangle';
    TX = 'text-warning';
  } else if (type == 'Info') {
    cs = 'alert-info';
    IC = 'fa-info';
    TX = 'text-info';
  } else if (type == 'Success') {
    cs = 'alert-success';
    IC = 'fa-check-circle';
    TX = 'text-success';
  }

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        className="rounded-1"
      >
        {/* <Modal.content className="border-0 alert alert-danger"> */}
        <Modal.Header
          className={`border-0 alert ${cs} p-0 pe-3 ps-3 m-0 rounded-bottom-0`}
          closeButton
        >
          <h5 className={`mb-1 mt-3`}>
            <span className={`fas ${IC} ${TX}  `}></span> {`${hdr} !`}{' '}
          </h5>
        </Modal.Header>
        <Modal.Body
          className={`border-0 alert ${cs} p-1 pe-3 ps-3 m-0 rounded-top-0`}
        >
          <div className="mt-1 fs-10">
            {reactStringReplace(msg, '<br/>', (match, i) => (
              <br />
            ))}
          </div>

          {/* {msg} */}
        </Modal.Body>
        {/* </Modal.content> */}
      </Modal>
    </>
  );
}

export default AlertBox;
