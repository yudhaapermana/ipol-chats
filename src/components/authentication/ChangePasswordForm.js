import React, { useState, useEffect } from 'react';
import { Button, Col, Form, Image, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import * as ISI from 'script/ISI.js?2';
import axios from 'axios';

import IsiTxt from 'components/form/IsiTxt';
import SvgIcon from 'components/app/kanban/SvgIcon';
import { PiLockKeyOpen } from 'react-icons/pi';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';

const ChangePasswordForm = ({ onBack }) => {
  const navigate = useNavigate();
  const URL = process.env.REACT_APP_URL_API;
  const userData = localStorage.getItem('userData');
  const [msg, setMsg] = useState('');  
  const [showPass, setShowPass] = useState(false);
  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);

  // State
  const [formData, setFormData] = useState({
    OTP: ''
  });

  // Handler
  const handleSubmitPassword = async e => {
    e.preventDefault();
    setMsg('');
    handleBack();
    //alert(URL);
    // try {
    //   let temp = await axios({
    //     url: `${URL}api/Utility/GetLoginApp`,
    //     method: 'POST',
    //     data: formData,
    //     contentType: 'application/json; charset=utf-8'
    //   });

    //   // console.table(temp.data);
    //   // console.log(temp.data.Msg);

    //   if (temp.data.Msg == '') {
    //     // alert('masuk login');
    //     // if (userData) {
    //     //   localStorage.setItem('partnerData', JSON.stringify(temp.data));
    //     //   navigate('/imes/ims003_logSheetCW500');
    //     // } else {
    //     // }
    //     localStorage.setItem('userData', JSON.stringify(temp.data));
    //     navigate('/home');
    //   } else {
    //     console.log('masuk error');
    //     setMsg(temp.data.Msg);
    //     // ISI.PopAlertFalcon('Warning', '', temp.data.Msg, '');
    //     console.log(`Alert Baru`);
    //     //ISI.confAlert("Warning","test"+temp.data.Msg);
    //   }
    //   // console.log('TEMP.DATA : ');
    //   // console.log(temp.data);
    //   // setUser(temp.data);
    //   // console.log(userData);
    // } catch (err) {
    //   ISI.PopAlertFalcon('error', 'error', err, '');
    // }
  };

  const handleFieldChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleResendOtp = () => {};

  const handleBack = () => {
    setFormData({});
    onBack();
  };

  return (
    <Form>
      <Row className="g-0 mb-4">
        <Col className="col-12">
          <div className="d-flex flex-column gap-3">
            <div className="d-flex flex-column gap-1">
              <p className="fs-10 m-0 fw-semibold font-sans-serif">Current Password</p>
              <Row className="px-2 py-1 border border-300 rounded-2 g-0 d-flex align-items-center">
                <Col xs={1} className="text-center">
                  <PiLockKeyOpen className="fs-9 ms-1 m-0" />
                </Col>
                <Col xs={10}>
                  <Form.Control
                    type={`${showPass ? 'text' : 'password'}`}
                    id="CurrentPassword"
                    name="CurrentPassword"
                    placeholder="Input Your Password"
                    value={formData.CurrentPassword}
                    onChange={handleFieldChange}
                    className="px-0 py-1 m-0 shadow-none border-0 ms-1"
                  />
                </Col>
                <Col xs={1} className="text-end">
                  <div className="cursor-pointer" onClick={() => setShowPass(!showPass)}>
                    {showPass ? <IoEyeOutline className="fs-9 m-0 me-1" /> : <IoEyeOffOutline className="fs-9 m-0 me-1" />}
                  </div>
                </Col>
              </Row>
            </div>
            <hr className='border border-1 border-400 mt-2 mb-1'/>
            <div className="d-flex flex-column gap-1">
              <p className="fs-10 m-0 fw-semibold font-sans-serif">New Password</p>
              <Row className="px-2 py-1 border border-300 rounded-2 g-0 d-flex align-items-center">
                <Col xs={1} className="text-center">
                  <PiLockKeyOpen className="fs-9 ms-1 m-0" />
                </Col>
                <Col xs={10}>
                  <Form.Control
                    type={`${showPass1 ? 'text' : 'password'}`}
                    id="NewPassword"
                    name="NewPassword"
                    placeholder="Input Your Password"
                    value={formData.NewPassword}
                    onChange={handleFieldChange}
                    className="px-0 py-1 m-0 shadow-none border-0 ms-1"
                  />
                </Col>
                <Col xs={1} className="text-end">
                  <div className="cursor-pointer" onClick={() => setShowPass1(!showPass1)}>
                    {showPass1 ? <IoEyeOutline className="fs-9 m-0 me-1" /> : <IoEyeOffOutline className="fs-9 m-0 me-1" />}
                  </div>
                </Col>
              </Row>
            </div>
            <div className="d-flex flex-column gap-1">
              <p className="fs-10 m-0 fw-semibold font-sans-serif">New Password (to-verify)</p>
              <Row className="px-2 py-1 border border-300 rounded-2 g-0 d-flex align-items-center">
                <Col xs={1} className="text-center">
                  <PiLockKeyOpen className="fs-9 ms-1 m-0" />
                </Col>
                <Col xs={10}>
                  <Form.Control
                    type={`${showPass2 ? 'text' : 'password'}`}
                    id="Password"
                    name="Password"
                    placeholder="Input Your Password"
                    value={formData.Password}
                    onChange={handleFieldChange}
                    className="px-0 py-1 m-0 shadow-none border-0 ms-1"
                  />
                </Col>
                <Col xs={1} className="text-end">
                  <div className="cursor-pointer" onClick={() => setShowPass2(!showPass2)}>
                    {showPass2 ? <IoEyeOutline className="fs-9 m-0 me-1" /> : <IoEyeOffOutline className="fs-9 m-0 me-1" />}
                  </div>
                </Col>
              </Row>
              {formData.NewPassword && formData.Password && formData.NewPassword !== formData.Paenvssword && <p className="fs-10 text-danger m-0">Passwords do not match</p>}
            </div>
          </div>
        </Col>
      </Row>
      <Row className="g-0 gx-2 mx-n1">
        <Col className="col-6">
          <Button
            type="submit"
            variant="primary"
            className="rounded-3 fs-10 m-0 fw-normal w-100 py-2 font-sans-serif"
            disabled={!formData.CurrentPassword || !formData.NewPassword || !formData.Password || formData.NewPassword !== formData.Password}
            onClick={handleSubmitPassword}
          >
            Save
          </Button>
        </Col>
        <Col className="col-6">
          <Button variant="dark" className="rounded-3 fs-10 m-0 fw-normal w-100 py-2 font-sans-serif" onClick={handleBack}>
            Cancel
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default ChangePasswordForm;