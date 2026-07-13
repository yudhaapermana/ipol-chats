import React, { forwardRef } from 'react';
import { Form } from 'react-bootstrap';

const ddlGroup = forwardRef(
  ({ value, onChange, formControlProps, errorMessage }, ref) => {
    return (
      <>
        <Form.Label>Group</Form.Label>
        <Form.Select
          ref={ref}
          isInvalid={!!errorMessage}
          onChange={onChange}
          value={value}
          {...formControlProps}
        >
          <option value="">Select</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </Form.Select>
        <Form.Control.Feedback type="invalid">
          {errorMessage}
        </Form.Control.Feedback>
      </>
    );
  }
);

export default ddlGroup;
