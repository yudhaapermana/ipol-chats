import React from 'react';
import Form from 'react-bootstrap/Form';
import MaskedInput from 'react-text-mask';

const IsiMaskedTimeRange = ({
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
  min,
  minx,
  max,
  maxx,
  viewMode,
  formatx,
  modex,
  viewModex,
  dataval,
  datatxt,
  onblur,
  maxlength,
  disabled,
  placeholder,
  style,
  isnumber,
  isinvalid,
  isinvalidx
}) => {
  isinvalid = isinvalid ?? [];
  isinvalidx = isinvalidx ?? [];
  return (
    <>
      <div style={style}>
        <Form.Group className="mb-1">
          {label != undefined && label != '' && <Form.Label className="mb-0">{label}</Form.Label>}
          <div className="d-flex align-items-center">
            <div>
              <MaskedInput
                id={id}
                mask={[/[0-2]/, /[0-9]/, ':', /[0-5]/, /[0-9]/]}
                placeholder={format}
                value={val}
                onChange={onchange}
                isInvalid={isinvalid.length > 0 ? !isinvalid[0] : false}
                render={(ref, props) => <Form.Control ref={ref} type="text" className="form-control form-control-sm" {...props} />}
              />
              <Form.Control.Feedback type="invalid">{isinvalid ? isinvalid[1] : ''}</Form.Control.Feedback>
            </div>
            <div className="ps-1 pe-1">
              <Form.Label className="mb-0">{labelx}</Form.Label>
            </div>
            <div>
              <MaskedInput
                id={idx}
                mask={[/[0-2]/, /[0-9]/, ':', /[0-5]/, /[0-9]/]}
                placeholder={formatx}
                value={valx}
                onChange={onchangex}
                isInvalid={isinvalidx.length > 0 ? !isinvalidx[0] : false}
                render={(ref, props) => <Form.Control ref={ref} type="text" className="form-control form-control-sm" {...props} />}
              />
              <Form.Control.Feedback type="invalid">{isinvalidx ? isinvalidx[1] : ''}</Form.Control.Feedback>
            </div>
          </div>
        </Form.Group>
      </div>
    </>
  );
};

export default IsiMaskedTimeRange;
