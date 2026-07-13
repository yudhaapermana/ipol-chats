import React, { forwardRef } from 'react';
import Form from 'react-bootstrap/Form';

const IsiDll = forwardRef(
  (
    {
      label,
      data,
      value,
      onChange,
      formControlProps,
      errorMessage,
      className,
      IsNotBlank,
      disabled
    },
    ref
  ) => {
    if (data === null) {
      data = [];
    }
    if (IsNotBlank == undefined) IsNotBlank = false;
    if (disabled == undefined) disabled = false;
    return (
      <>
        {label != '' && label != undefined ? (
          <Form.Label>{label}</Form.Label>
        ) : (
          ''
        )}
        <Form.Select
          ref={ref}
          isInvalid={!!errorMessage}
          onChange={onChange}
          value={value}
          {...formControlProps}
          className={className}
          disabled={disabled}
        >
          {!IsNotBlank ? <option value=""></option> : ''}

          {data.map(({ Text, Value }) => {
            return (
              <option value={Value} key={Value}>
                {Text}
              </option>
            );
          })}
        </Form.Select>
        <Form.Control.Feedback type="invalid">
          {errorMessage}
        </Form.Control.Feedback>
      </>
    );
  }
);
export default IsiDll;
