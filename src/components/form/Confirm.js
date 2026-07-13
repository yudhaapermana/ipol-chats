import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { confirmable, createConfirmation } from 'react-confirm';

const Confirmation = ({
  cancelLabel = 'Cancel',
  proceedLabel = 'OK',
  title = 'Confirmation',
  confirmation,
  show,
  proceed,
  enableEscape = true
}) => {
  return (
    <div className="static-modal">
      <Modal
        animation={false}
        show={show}
        onHide={() => proceed(false)}
        backdrop={enableEscape ? true : 'static'}
        keyboard={enableEscape}
        className="modalconfirm"
      >
        <Modal.Header closeButton className="p-2">
          <Modal.Title className="h5">{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{confirmation}</Modal.Body>
        <Modal.Footer className="p-1">
          <Button
            size="sm"
            variant="secondary"
            className="button-l float-right"
            onClick={() => proceed(false)}
          >
            {cancelLabel}
          </Button>
          <Button
            className="button-l float-right"
            size="sm"
            bsStyle="primary"
            onClick={() => proceed(true)}
          >
            {proceedLabel}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

Confirmation.propTypes = {
  okLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  proceedLabel: PropTypes.string,
  title: PropTypes.string,
  confirmation: PropTypes.string,
  show: PropTypes.bool,
  proceed: PropTypes.func, // called when ok button is clicked.
  enableEscape: PropTypes.bool
};

export function confirm(
  confirmation,
  title,
  proceedLabel = 'OK',
  cancelLabel = 'Cancel',
  options = {}
) {
  return createConfirmation(confirmable(Confirmation))({
    confirmation,
    title,
    proceedLabel,
    cancelLabel,
    ...options
  });
}
