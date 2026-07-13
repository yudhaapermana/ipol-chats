import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const AlertIsi = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <Modal className="mt-4" show={show} onHide={handleClose}>
      <Modal.Header className="bg-shape modal-shape-header px-4 position-relative">
        <div className="position-relative z-1" data-bs-theme="light">
          <h4 className="mb-0 text-white" id="authentication-modal-label">
            Register
          </h4>
          <p className="fs-10 mb-0 text-white">
            Please create your free Falcon account
          </p>
        </div>
        <CloseButton
          variant="white"
          className="position-absolute end-0 me-2 mt-2 top-0"
        />
      </Modal.Header>
      <Modal.Body className="p-4">tdtdtd</Modal.Body>
    </Modal>
  );
};

export default AlertIsi;
