import React from 'react';
import Form from 'react-bootstrap/Form';
import DateTimeField from 'assets/js/react-bootstrap-datetimepicker';
import { min } from 'd3';

const IsiDateTime = ({
  id,
  label,
  css,
  row,
  val,
  min,
  max,
  dval,
  onchange,
  onkeydown,
  format,
  mode,
  viewMode,
  dataval,
  datatxt,
  onblur,
  maxlength,
  disabled,
  placeholder,
  style,
  isnumber,
  isinvalid
}) => {
  isinvalid = isinvalid ?? [];
  return (
    <>
      <div style={style}>
        <Form.Group className="mb-1">
          {label != undefined && label != '' && <Form.Label className="mb-0">{label}</Form.Label>}

          <DateTimeField
            id={id}
            dateTime={val}
            inputDisplayFormat={format || 'DD/MM/YYYY'}
            mode={mode || 'date'}
            className="form-control mb-2 "
            viewMode={viewMode || 'days'}
            inputProps={
              isinvalid.length > 0 && !isinvalid[0]
                ? {
                    className: 'form-control form-control-sm is-invalid'
                  }
                : null
            }
            size="sm"
            onChange={onchange}
            minDate={min}
            maxDate={max}
            disabled={disabled}
          />

          {isinvalid.length > 0 && !isinvalid[0] && <span className="invalid-feedback d-block">{isinvalid[1]}</span>}
        </Form.Group>
      </div>
    </>
  );
};

export default IsiDateTime;
