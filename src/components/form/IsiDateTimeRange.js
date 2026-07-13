import React from 'react';
import Form from 'react-bootstrap/Form';
import DateTimeField from 'assets/js/react-bootstrap-datetimepicker';

const IsiDateTimeRange = ({
  id,
  label,
  labelx,
  idx,
  css,
  row,
  val,
  valx,
  dval,
  onchange,
  onchangex,
  onkeydown,
  format,
  mode,
  viewMode,
  formatx,
  modex,
  viewModex,
  dataval,
  datatxt,
  onblur,
  maxlength,
  disabled,
  disabledx,
  placeholder,
  style,
  isnumber,
  isinvalid,
  min,
  max,
  minx,
  maxx
}) => {
  isinvalid = isinvalid ?? [];
  return (
    <>
      <div style={style}>
        <Form.Group className="mb-1">
          {label != undefined && label != '' && <Form.Label className="mb-0">{label}</Form.Label>}
          <div className="d-flex align-items-center">
            <div>
              <DateTimeField
                id={id}
                dateTime={val}
                inputDisplayFormat={format || 'DD/MM/YYYY'}
                mode={mode || 'date'}
                viewMode={viewMode || 'days'}
                inputProps={
                  isinvalid.length > 0 && !isinvalid[0]
                    ? {
                        className: 'form-control form-control-sm is-invalid'
                      }
                    : null
                }
                className="form-control mb-2"
                size="sm"
                onChange={onchange}
                minDate={min}
                maxDate={max}
                disabled={disabled}
              />
            </div>
            <div className="ps-1 pe-1">
              <Form.Label className="mb-0">{labelx}</Form.Label>
            </div>
            <div>
              <DateTimeField
                id={idx}
                dateTime={valx}
                inputDisplayFormat={formatx || 'DD/MM/YYYY'}
                mode={modex || 'date'}
                viewMode={viewModex || 'days'}
                inputProps={
                  isinvalid.length > 0 && !isinvalid[0]
                    ? {
                        className: 'form-control form-control-sm is-invalid'
                      }
                    : null
                }
                minDate={minx}
                maxDate={maxx}
                className="form-control mb-2"
                size="sm"
                onChange={onchangex}
                disabled={disabledx}
              />
            </div>
          </div>

          {isinvalid.length > 0 && !isinvalid[0] && <span className="invalid-feedback d-block">{isinvalid[1]}</span>}
        </Form.Group>
      </div>
    </>
  );
};

export default IsiDateTimeRange;
