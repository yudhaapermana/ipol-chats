import React from 'react';
import Form from 'react-bootstrap/Form';
import Select from 'react-select';

const IsiSelect2 = ({
  id,
  label,
  css,
  row,
  val,
  dval,
  onchange,
  onchangecapture,
  onkeydown,
  typ,
  obj,
  dataval,
  datatxt,
  onblur,
  maxlength,
  disabled,
  placeholder,
  style,
  isnumber,
  group,
  rf,
  isinvalid,
  readonly,
  isblank
}) => {
  if (disabled == undefined) disabled = false;
  if (isblank == undefined) isblank = true;
  if (css == undefined) css = '';

  isinvalid = isinvalid ?? [];

  let organizerOptions = [];

  obj.map(data => {
    organizerOptions.push({ value: data[dataval != undefined ? dataval : 'Value'], label: data[datatxt != undefined ? datatxt : 'Text'] });
  });

  let isSelectInvalid = isinvalid.length > 0 ? !isinvalid[0] : false;

  // Define your custom styles
  const customStyles = {
    // --- Style the main control (the box) ---
    control: (baseStyles, state) => ({
      ...baseStyles,
      margin: '0px 0px 0px 0px',
      paddingLeft: '5px',
      color: 'white'
    }),

    // --- Style the individual selected chips (MultiValue) ---
    multiValue: (baseStyles, state) => ({
      ...baseStyles,
      backgroundColor: '#e6f3ff', // Light blue background for chips
      border: '.2px solid #007bff', // Blue border
      borderRadius: '4px',
      margin: '0px 2px 0px 0px',
      paddingLeft: '0px'
    }),

    ValueContainer: (baseStyles, state) => ({
      ...baseStyles,
      margin: '0px !important'
    }),

    input: (baseStyles, state) => ({
      ...baseStyles,
      color: 'var(--falcon-gray-900)'
    }),

    // --- Style the text inside the chip (MultiValueLabel) ---
    multiValueLabel: (baseStyles, state) => ({
      ...baseStyles,
      color: '#007bff' // Blue text color
      // fontWeight: 'bold'
    }),

    // --- Style the remove button on the chip (MultiValueRemove) ---
    multiValueRemove: (baseStyles, state) => ({
      ...baseStyles,
      color: '#ff0000ff',
      '&:hover': {
        backgroundColor: '#ff0000ff', // Darker blue on hover
        color: 'white',
        cursor: 'pointer'
      }
    }),

    // --- Style the options in the dropdown menu ---
    option: (baseStyles, state) => ({
      ...baseStyles,
      textAlign: 'left !important'
      // backgroundColor: state.isSelected ? '#007bff' : state.isFocused ? '#f0f0f0' : 'white',
      // color: state.isSelected ? 'white' : 'black'
    })
  };

  return (
    <>
      <Form.Group className={group != undefined ? group : 'mb-1'}>
        {label != undefined && label != '' && <Form.Label className="mb-0 ms-1">{label}</Form.Label>}
        <Select
          closeMenuOnSelect={false}
          options={organizerOptions}
          placeholder=""
          isMulti
          classNamePrefix="react-select"
          value={val}
          onChange={onchange}
          styles={customStyles} // Apply your custom styles here
          className={'form-control form-control-sm ' + isSelectInvalid ? 'is-invalid-select' : ''}
        />
        <Form.Control.Feedback type="invalid">{isinvalid ? isinvalid[1] : ''}</Form.Control.Feedback>
      </Form.Group>
    </>
  );
};

export default IsiSelect2;
