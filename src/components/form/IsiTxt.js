import React from 'react';
import Form from 'react-bootstrap/Form';

const IsiTxt = ({ id, label, css, row, val, dval, onchange, onkeydown, typ, obj, dataval, datatxt, onblur, onfocus, autofocus, maxlength, disabled, placeholder, style, isnumber, group, rf, isinvalid, readonly, isblank, name }) => {
  if (disabled == undefined) disabled = false;
  if (isblank == undefined) isblank = true;

  if (isnumber) typ = 'number';
  else if (!typ) typ = 'text';

  isinvalid = isinvalid ?? [];
  return (
    <>
      <Form.Group className={group != undefined ? group : 'mb-1'}>
        {label != undefined && label != '' && <Form.Label className="mb-0 ms-1">{label}</Form.Label>}

        {typ == 'select' ? (
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
            style={style}
            ref={rf}
            isInvalid={isinvalid.length > 0 ? !isinvalid[0] : false}
            readOnly={readonly}
            name={name}
          >
            {isblank ? <option value="">{dval != undefined ? dval : ''}</option> : ''}

            {/* {obj.map(({ Text, Value }) => (
              <option value={Value} key={`d${Value}`}>
                {Text}
              </option>
            ))} */}

            {obj.map(data => (
              <option value={data[dataval != undefined ? dataval : 'Value']} key={`${id}${data[dataval != undefined ? dataval : 'Value']}`}>
                {data[datatxt != undefined ? datatxt : 'Text']}
              </option>
            ))}
          </Form.Control>
        ) : row > 0 ? (
          <Form.Control
            id={id}
            type="text"
            as="textarea"
            className={css}
            rows={row}
            value={val}
            onChange={onchange}
            onKeyDown={onkeydown}
            onBlur={onblur}
            onClick={onfocus}
            autoFocus={autofocus}
            maxLength={maxlength}
            disabled={disabled}
            style={style}
            ref={rf}
            isInvalid={isinvalid.length > 0 ? !isinvalid[0] : false}
            readOnly={readonly}
            name={name}
          ></Form.Control>
        ) : (
          <Form.Control
            id={id}
            size="sm"
            type={typ}
            className={css}
            value={val}
            defaultValue={dval}
            onChange={onchange}
            onKeyDown={onkeydown}
            onBlur={onblur}
            onClick={onfocus}
            autoFocus={autofocus}
            maxLength={maxlength}
            disabled={disabled}
            placeholder={placeholder}
            style={style}
            ref={rf}
            isInvalid={isinvalid.length > 0 ? !isinvalid[0] : false}
            readOnly={readonly}
            name={name}                        
          ></Form.Control>
        )}
        <Form.Control.Feedback type="invalid">{isinvalid ? isinvalid[1] : ''}</Form.Control.Feedback>
      </Form.Group>
    </>
  );
};

export default IsiTxt;
