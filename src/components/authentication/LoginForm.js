import Divider from 'components/common/Divider';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { Button, Col, Form, Image, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import * as ISI from 'script/ISI.js?2';
import axios from 'axios';

import barcode from 'assets/img/barcode.svg';
import { FiUser } from 'react-icons/fi';
import IsiTxt from 'components/form/IsiTxt';
import { PiLockKeyOpen } from 'react-icons/pi';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';

const LoginForm = ({ hasLabel, layout, handleForgot, handleChangePassword }) => {
  const navigate = useNavigate();
  const URL = process.env.REACT_APP_URL_API;
  const lgdata = localStorage.getItem('userData');
  const [msg, setMsg] = useState('');
  const [msgForgot, setMsgForgot] = useState('');
  const [showPass, setShowPass] = useState(false);

  // State
  const [formData, setFormData] = useState({
    UserId: '',
    Password: '',
    remember: false
  });

  // const checkPopupBlocker = () => {
  //   const popup = window.open('about:blank', '_blank', 'width=1,height=1');

  //   if (!popup || popup.closed || typeof popup.closed === 'undefined') {
  //     return false;
  //   } else {
  //     popup.close();
  //     return true;
  //   }
  // };

  // Handler
  const handleSubmit = async e => {
    e.preventDefault();
    setMsg('');
    const payload = {
      ...formData,
      UserId: formData.UserId.toLowerCase()
    };
    //alert(URL);
    try {
      let temp = await axios({
        url: `${URL}api/Utility/GetLoginApp`,
        method: 'POST',
        data: payload,
        contentType: 'application/json; charset=utf-8'
      });

      // console.table(temp.data);
      // console.log(temp.data.Msg);

      if (temp.data.Msg == '') {
        // handleChangePassword();
        localStorage.setItem('userData', JSON.stringify(temp.data));
        // checkPopupBlocker();
        // if (!checkPopupBlocker()) {
        //   navigate('/login/popup-blocker');
        // } else {
        //   // GetAllMenu(temp.data);
        //   GetMenuMobile(temp.data);
        //   // GetMenuErp(temp.data);
        //   // GetEmail(temp.data);
        //   navigate('/');
        // }
        navigate('/chat');
      } else {
        console.log('masuk error');
        setMsg(temp.data.Msg);
        // ISI.PopAlertFalcon('Warning', '', temp.data.Msg, '');
        console.log(`Alert Baru`);
        //ISI.confAlert("Warning","test"+temp.data.Msg);
      }
      // console.log('TEMP.DATA : ');
      // console.log(temp.data);
      // setUser(temp.data);
      // console.log(userData);
    } catch (err) {
      ISI.PopAlertFalcon('error', 'error', err, '');

      //ISI.confAlert("Danger","test"+err);
    }
  };

  const handleFieldChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const isForgotPassword = () => {
    if (!formData.UserId || formData.UserId === '') {
      setMsgForgot('User ID Not Empty');
    } else {
      handleForgot();
      setMsgForgot('');
    }
  };

  const GetEmail = async data => {
    try {
      let temp = await axios({
        url: `${URL}api/Utility/GetEmail?userid=${data?.UserId}&nik=${data?.NIK}`,
        method: 'GET',
        contentType: 'application/json; charset=utf-8',
        headers: {
          Keys: data?.UserTkn
        }
      })
        .then(response => {
          localStorage.setItem('lsEmail', JSON.stringify(response.data));
        })
        .catch(err => {
          ISI.AlertException(err);
        });
    } catch (err) {
      ISI.AlertException(err);
    }
  };

  useEffect(() => {
    if (lgdata) {
      navigate('/chat');
    }
  }, [])

  return (
    <Form>
      <Row className="g-0 gx-3 mx-n2 mb-4 d-flex align-items-start justify-content-between">
        <Col xl={8} xxl={9} className="col-12 d-flex flex-column gap-3 gap-lg-4">
          <div className="d-flex flex-column gap-3">
            <div className="d-flex flex-column gap-1">
              <p className="fs-10 m-0 fw-semibold font-sans-serif">User ID</p>
              <Row className="px-2 py-1 pb-0 border border-300 rounded-2 g-0">
                <Col xs={1} className="text-center">
                  <FiUser className="fs-9 ms-1 m-0" />
                </Col>
                <Col xs={11}>
                  <IsiTxt
                    label=""
                    id="UserId"
                    name={'UserId'}
                    css="ms-1 shadow-none border-0 px-0 py-0 m-0 ps-1 mb-n1"
                    placeholder="Input Your User ID"
                    value={formData?.UserId}
                    autofocus={true}
                    onblur={handleFieldChange}
                    onchange={handleFieldChange}
                  />
                </Col>
              </Row>
              {msgForgot && <p className="fs-10 text-danger m-0 mt-n1 mb-n2">{msgForgot}</p>}
            </div>
            <div className="d-flex flex-column gap-1">
              <p className="fs-10 m-0 fw-semibold font-sans-serif">Password</p>
              <Row className="px-2 py-1 border border-300 rounded-2 g-0 d-flex align-items-center">
                <Col xs={1} className="text-center">
                  <PiLockKeyOpen className="fs-9 ms-1 m-0" />
                </Col>
                <Col xs={10}>
                  <Form.Control
                    type={`${showPass ? 'text' : 'password'}`}
                    id="Password"
                    name="Password"
                    placeholder="Input Your Password"
                    value={formData.Password}
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
              {msg && <p className="fs-10 text-danger m-0 mt-n1">{msg}</p>}
            </div>
          </div>
        </Col>
        <Col xl={4} xxl={3} className="col-12 mt-3 mt-xl-n1 d-flex justify-content-xl-end justify-content-center h-100">
          <div className="d-flex flex-column align-items-center">
            <p className="fs-10 fw-semibold m-0 align-self-center">Scan Me</p>
            <Image
              src={barcode}
              fluid
              style={{
                maxWidth: '124px',
                minWidth: '60px'
              }}
            />
          </div>
        </Col>
      </Row>

      <Row className="justify-content-between align-items-center g-0 ms-n1 mb-3">
        <Col xs="auto">
          <Form.Check type="checkbox" id="rememberMe" className="mb-0 d-flex align-items-center gap-2">
            <Form.Check.Input
              type="checkbox"
              name="remember"
              className="pb-0"
              checked={formData.remember}
              onChange={e =>
                setFormData({
                  ...formData,
                  remember: e.target.checked
                })
              }
            />
            <Form.Check.Label className="mb-0 fw-normal font-sans-serif text-primary fs-10">Remember me</Form.Check.Label>
          </Form.Check>
        </Col>

        <Col xs="auto">
          <p className="fs-10 mb-0 fw-normal m-0 font-sans-serif text-primary cursor-pointer" onClick={isForgotPassword}>
            Forgot Password?
          </p>
        </Col>
      </Row>

      <Form.Group>
        <Button type="submit" color="primary" className="mt-3 w-100" disabled={!formData?.UserId || !formData.Password} onClick={handleSubmit}>
          Log in
        </Button>
      </Form.Group>

      {/* <Divider className="mt-4">or log in with</Divider>

      <SocialAuthButtons /> */}
    </Form>
  );
};

LoginForm.propTypes = {
  layout: PropTypes.string,
  hasLabel: PropTypes.bool
};

LoginForm.defaultProps = {
  layout: 'simple',
  hasLabel: false
};

export default LoginForm;
