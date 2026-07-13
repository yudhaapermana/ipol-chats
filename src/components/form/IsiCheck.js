import React from 'react';
import Form from 'react-bootstrap/Form';

const IsiCheck = ({ id, txt, ischeck, change, disabled, cls, type }) => {
  return (
    <>
      {type === 'switch' ? (
        <Form.Check type="switch" id={id} className={`rotateswitch ${cls}`} checked={ischeck} onChange={change} disabled={disabled} />
      ) : (
        <label className={`customcheck fs-10 ${cls}`}>
          {txt}
          <input type="checkbox" disabled={disabled} id={id} checked={ischeck} onChange={change} />
          <span className="checkmark"></span>
        </label>
      )}
    </>
  );
};
export default IsiCheck;
