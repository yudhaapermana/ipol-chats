import { Button } from 'bootstrap';
import React from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const IsiTxtGroup = ({
  id,
  label,
  css,
  row,
  val,
  dval,
  onchange,
  onkeydown,
  typ,
  obj,
  suval,
  datatxt,
  onblur,
  maxlength,
  disabled,
  placeholder,
  style,
  isnumber,
  suffix,
  prefix,
  idsubtn,
  suicon,
  suevclick,
  sufdisabled,
  idprebtn,
  preicon,
  preevclick,
  title,
  changetitle,
  isinvalid,
  autoinvalid,
  rfauto,
  rf,
  sufddl,
  ddldata,
  evauto,
  valauto,
  idauto,
  disauto,
  isuseunuse
}) => {
  if (disabled == undefined) disabled = false;
  if (isuseunuse == undefined) isuseunuse = true;

  isinvalid = isinvalid ?? [];
  autoinvalid = autoinvalid ?? [];
  return (
    <>
      <Form.Group className="mb-1">
        {label != undefined && label != '' && <Form.Label className="mb-0">{label}</Form.Label>}
        <InputGroup size="sm" className={'mb-1 txtgrp' + id}>
          {typ == 'checkbox' ? (
            <>
              {suffix != undefined ? <InputGroup.Checkbox id={`CB${suffix}`} checked={suval ?? false} onClick={suevclick} aria-label={suffix} disabled={sufdisabled} /> : ''}
              {sufddl != undefined ? (
                <DropdownButton variant="outline-primary" title={title || ''} id="ddlunused" onSelect={changetitle}>
                  {ddldata.map(f => {
                    return <Dropdown.Item eventKey={f.Value}>{f.Value}</Dropdown.Item>;
                  })}
                </DropdownButton>
              ) : (
                ''
              )}
              {evauto && (
                <Form.Control
                  type="text"
                  id={idauto}
                  autoComplete="off"
                  onChange={evauto}
                  value={valauto}
                  placeholder={title}
                  ref={rfauto}
                  isInvalid={autoinvalid.length > 0 ? !autoinvalid[0] : false}
                  isinvalid={autoinvalid}
                  disabled={disauto}
                />
              )}
              <Form.Control
                aria-label="Small"
                aria-describedby="inputGroup-sizing-sm"
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
                ref={rf}
                isInvalid={isinvalid.length > 0 ? !isinvalid[0] : false}
              />
              {prefix != undefined ? <InputGroup.Text>{prefix}</InputGroup.Text> : ''}
            </>
          ) : typ == 'button' ? (
            <>
              {suffix != undefined ? (
                <Button
                //id={idsubtn}
                //icon={suicon}
                //onClick={suevclick}
                >
                  {suffix}
                </Button>
              ) : (
                ''
              )}

              {isuseunuse ? (
                <DropdownButton variant="outline-primary" title={title || 'Used/Unused'} id="ddlunused" onSelect={changetitle} className={'txtgrp' + id}>
                  <Dropdown.Item eventKey="Unused">Unused</Dropdown.Item>
                  <Dropdown.Item eventKey="Used">Used</Dropdown.Item>
                </DropdownButton>
              ) : (
                ''
              )}
              <Form.Control
                aria-label="Small"
                aria-describedby="inputGroup-sizing-sm"
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
                ref={rf}
                isInvalid={isinvalid.length > 0 ? !isinvalid[0] : false}
              />

              <button type="button" className={'btn btn-primary'} id={idprebtn} onClick={preevclick}>
                {preicon != undefined ? <FontAwesomeIcon icon={preicon} className={'fa-w-16 text-white fs-9'} /> : prefix}
              </button>
            </>
          ) : typ == 'btnlink' ? (
            <>
              {suffix != undefined ? (
                <Button
                //id={idsubtn}
                //icon={suicon}
                //onClick={suevclick}
                >
                  {suffix}
                </Button>
              ) : (
                ''
              )}
              <Form.Control
                aria-label="Small"
                aria-describedby="inputGroup-sizing-sm"
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
                ref={rf}
                isInvalid={isinvalid.length > 0 ? !isinvalid[0] : false}
              />

              <button type="button" className={'btn btn-primary'} id={idprebtn} onClick={preevclick}>
                {preicon != undefined ? <FontAwesomeIcon icon={preicon} className={'fa-w-16 text-white fs-9'} /> : prefix}
              </button>
            </>
          ) : (
            <>
              {suffix != undefined ? <InputGroup.Text>{suffix}</InputGroup.Text> : ''}
              <Form.Control
                aria-label="Small"
                aria-describedby="inputGroup-sizing-sm"
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
                ref={rf}
                isInvalid={isinvalid.length > 0 ? !isinvalid[0] : false}
              />
              {prefix != undefined ? <InputGroup.Text>{prefix}</InputGroup.Text> : ''}
            </>
          )}
          <Form.Control.Feedback type="invalid">{isinvalid ? isinvalid[1] : ''}</Form.Control.Feedback>
        </InputGroup>
      </Form.Group>
    </>
  );
};

export default IsiTxtGroup;
