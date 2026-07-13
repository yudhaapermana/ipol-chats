import React, { forwardRef } from 'react';
import { Form } from 'react-bootstrap';

const ddlShift = forwardRef(
  ({ value, onChange, formControlProps, errorMessage }, ref) => {
    return (
      <>
        <Form.Label>Shift</Form.Label>
        <Form.Select
          ref={ref}
          isInvalid={!!errorMessage}
          onChange={onChange}
          value={value}
          {...formControlProps}
        >
          <option value="">Select</option>
          <option value="1">1 [ Jam 07:00 - 15:00 Normal ]</option>
          <option value="2">2 [ Jam 15:00 - 23:00 Normal ]</option>
          <option value="3">3 [ Jam 23:00 - 07:00 Normal ]</option>
          <option value="4">4 [ Jam 07:00 - 19:00 Long Shift ]</option>
          <option value="5">5 [ Jam 19:00 - 07:00 Long Shift ]</option>
        </Form.Select>
        <Form.Control.Feedback type="invalid">
          {errorMessage}
        </Form.Control.Feedback>
      </>
    );
  }
);

export default ddlShift;
