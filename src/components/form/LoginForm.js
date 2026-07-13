// import Divider from 'components/common/Divider';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import * as ISI from 'script/ISI.js';
//import { Route, Routes, useNavigate } from 'react-router-dom';

// const URL = process.env.REACT_APP_URL_API_LOCAL;
const URL = process.env.REACT_APP_URL_API;

const LoginForm = ({ hasLabel, layout }) => {
  // State
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
    remember: false
  });

  const [userData, setUser] = useState([]);
  const getUser = async () => {
    try {
      let temp = await axios({
        url: `${URL}api/login/GetData?userid=${formData.userId}&password=${formData.password}`,
        method: 'GET',
        contentType: 'application/json;',
        headers: {
          Keys: 'cobhAuKwS5HUFA8mtQnpPnWBkJ6PgMPr8GwamnANZJRg46UI96qosj2BOnCVBpEM'
        }
      });
      setUser(temp.data);
      console.log(userData);
      setLocalStorage();
    } catch (err) {
      alert(err);
    } finally {
      //StopProgress(); //to turn off loading
    }
  };

  const setLocalStorage = () => {
    let tipe = 'Danger';
    let hdr = 'ERROR !!';
    let msg = 'Default error msg';

    console.log(`User data user name : ${userData.UserName}`);
    console.log(`User data user id : ${userData.UserId}`);
    console.log(`formData.UserId : ${formData.userId}`);

    console.log(`Isi ganti pwd ${userData.GantiPwd}`);
    if (userData.GantiPwd == 'Y') {
      console.log('Masuk ganti pwd');
      tipe = 'Warning';
      hdr = 'Konfirmasi';
      msg = userData.ErrMsgLogin;
      ISI.PopConfirm(
        hdr,
        userData.ErrMsgLogin,
        'No',
        'Yes',
        '',
        'UbahPassword'
      );
      //localStorage.setItem('userData', JSON.stringify(userData));
    } else if (
      userData.UserName != null &&
      userData.UserId == formData.userId
    ) {
      // <Navigate to="authentication/simple/reset-password" />;
      //const navigate = useNavigate();
      //navigate('authentication/simple/reset-password');
      localStorage.setItem('userData', JSON.stringify(userData));
      window.location.href = '/';
    } else {
      console.log(`Alert Baru`);
      //ISI.confAlert(hdr,"test"+msg);
    }
  };

  //function UbahPassword() {
  // <Navigate to="authentication/simple/reset-password" />;
  //}

  // Handler
  const handleSubmit = e => {
    e.preventDefault();

    getUser();
    let url = process.env.REACT_APP_URL_API;
    console.log('INI COBA GLOBAL ');
    console.log(url);
    toast.success(`Logged in as ${formData.userId}`, {
      theme: 'colored'
    });
  };

  const handleFieldChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        {hasLabel && <Form.Label>Email address</Form.Label>}
        <Form.Control
          placeholder={!hasLabel ? 'User Id' : ''}
          value={formData.email}
          id="userId"
          name="userId"
          onChange={handleFieldChange}
          type="text"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        {hasLabel && <Form.Label>Password</Form.Label>}
        <Form.Control
          placeholder={!hasLabel ? 'Password' : ''}
          value={formData.password}
          id="password"
          name="password"
          onChange={handleFieldChange}
          type="password"
        />
      </Form.Group>

      <Row className="justify-content-between align-items-center">
        <Col xs="auto">
          <Link
            className="fs--1 mb-0"
            to={`/authentication/${layout}/forgot-password`}
          >
            Forgot Password?
          </Link>
        </Col>
      </Row>

      <Form.Group>
        <Button
          type="submit"
          color="primary"
          className="mt-3 w-100"
          disabled={!formData.userId || !formData.password}
        >
          Log in
        </Button>
      </Form.Group>
      {/*}
      <Divider className="mt-4">or log in with</Divider>
      {*/}
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
