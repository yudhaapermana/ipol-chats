import React from 'react';
import { Form } from 'react-bootstrap';

const IsiRadio = ({ id, label, name, data, inlen, css, onchange, val }) => {
  if (data === null || data === undefined) {
    data = [];
  }
  if (inlen === null || inlen === undefined) {
    inlen = true;
  }
  return (
    <>
      <Form.Group className="mb-1 pb-0">
        <Form.Label className="mb-0">{label}</Form.Label>
        <div key={`inline-radio`} className={`form-control mb-0 pt-1 pb-0 ${css}`} style={{ display: 'table' }}>
          {data.map((e, idx) => (
            <Form.Check id={id} className="pb-0" style={{ marginBottom: '-0.5rem' }} inline={inlen} type="radio" name={name} onChange={onchange} checked={val == e.value} {...e} />
          ))}
        </div>
      </Form.Group>
    </>
  );
};
export default IsiRadio;
