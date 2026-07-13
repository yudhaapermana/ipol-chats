import React from 'react';
import Form from 'react-bootstrap/Form';

const IsiTxtRange = ({
  id,
  label,
  idx,
  labelx,
  css,
  row,
  val,
  cssx,
  rowx,
  valx,
  dval,
  dvalx,
  onchange,
  onchangex,
  onkeydown,
  typ,
  obj,
  objx,
  dataval,
  datatxt,
  datavalx,
  datatxtx,
  onblur,
  maxlength,
  disabled,
  placeholder,
  disabledx,
  placeholderx,
  style,
  isnumber,
  group
}) => {
  if (disabled == undefined) disabled = false;
  return (
    <>
      <Form.Group className={group != undefined ? group : 'mb-1'}>
        {label != undefined && label != '' && (
          <Form.Label className="mb-0">{label}</Form.Label>
        )}

        {typ == 'select' ? (
          <div className="d-flex align-items-center">
            <div>
              <Form.Control
                id={id}
                as="select"
                size="sm"
                rows={row}
                value={val}
                className={css}
                onChange={onchange}
                onKeyDown={onkeydown}
                onBlur={onblur}
                disabled={disabled}
                placeholder={placeholder}
              >
                <option value="">{dval != undefined ? dval : ''}</option>
                {/* {obj.map(({ Text, Value }) => (
              <option value={Value} key={`d${Value}`}>
                {Text}
              </option>
            ))} */}

                {obj.map(data => (
                  <option
                    value={data[dataval != undefined ? dataval : 'Value']}
                    key={`${id}${
                      data[dataval != undefined ? dataval : 'Value']
                    }`}
                  >
                    {data[datatxt != undefined ? datatxt : 'Text']}
                  </option>
                ))}
              </Form.Control>
            </div>
            <div className="ps-1 pe-1">
              <Form.Label className="mb-0">{labelx}</Form.Label>
            </div>
            <div>
              <Form.Control
                id={idx}
                as="select"
                size="sm"
                rows={rowx}
                value={valx}
                className={cssx}
                onChange={onchange}
                onKeyDown={onkeydown}
                onBlur={onblur}
                disabled={disabledx}
                placeholder={placeholderx}
              >
                <option value="">{dvalx != undefined ? dvalx : ''}</option>
                {/* {obj.map(({ Text, Value }) => (
              <option value={Value} key={`d${Value}`}>
                {Text}
              </option>
            ))} */}

                {objx.map(data => (
                  <option
                    value={data[datavalx != undefined ? datavalx : 'Value']}
                    key={`${id}${
                      data[datavalx != undefined ? datavalx : 'Value']
                    }`}
                  >
                    {data[datatxtx != undefined ? datatxtx : 'Text']}
                  </option>
                ))}
              </Form.Control>
            </div>
          </div>
        ) : row > 0 ? (
          <Form.Control
            id={id}
            type="text"
            as="textarea"
            rows={row}
            value={val}
            onChange={onchange}
            onKeyDown={onkeydown}
            onBlur={onblur}
            maxLength={maxlength}
            disabled={disabled}
            style={style}
          ></Form.Control>
        ) : (
          <div className="d-flex align-items-center">
            <div>
              <Form.Control
                id={id}
                size="sm"
                type={isnumber ? 'number' : 'text'}
                className={css}
                value={val}
                defaultValue={dval}
                onChange={onchange}
                onKeyDown={onkeydown}
                onBlur={onblur}
                maxLength={maxlength}
                disabled={disabled}
                placeholder={placeholder}
                style={style}
              ></Form.Control>
            </div>
            <div className="ps-1 pe-1">
              <Form.Label className="mb-0">{labelx}</Form.Label>
            </div>
            <div>
              <Form.Control
                id={idx}
                size="sm"
                type={isnumber ? 'number' : 'text'}
                className={cssx}
                value={valx}
                defaultValue={dvalx}
                onChange={onchangex}
                onKeyDown={onkeydown}
                onBlur={onblur}
                maxLength={maxlength}
                disabled={disabledx}
                placeholder={placeholderx}
                style={style}
              ></Form.Control>
            </div>
          </div>
        )}
      </Form.Group>
    </>
  );
};

export default IsiTxtRange;
