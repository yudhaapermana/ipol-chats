import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import team3 from 'assets/img/team/3.jpg';
import Avatar from 'components/common/Avatar';
import { Button, Card, Col, Dropdown, ListGroup, Row } from 'react-bootstrap';
import * as ISI from 'script/ISI.js';

const URL = process.env.REACT_APP_URL_API;

const ProfileDropdown = () => {
  const navigate = useNavigate();
  const lgdata = JSON.parse(localStorage.getItem('userData'));
  let img = '';
  if (lgdata && lgdata.Link) img = lgdata.Link;
  // console.log(lgdata);
  // console.log('gambar:' + img);

  const Logoffuser = async () => {
    try {
      await axios({
        url: `${URL}api/Utility/Logoff?usid=${lgdata.UserId}`,
        method: 'POST',
        contentType: 'application/json;'
      })
        .then(response => {
          //alert('keluar');
        })
        .catch(err => {
          // catch any unexpected errors
          ISI.PopAlertFalcon('error', 'error', err.response.data.Message, '');
        });
    } catch (err) {
      alert(err);
    } finally {
      //StopProgress(); //to turn off loading
    }
  };

  return (
    <Dropdown navbar={true} as="li">
      {lgdata && (
        <>
          <Dropdown.Toggle bsPrefix="toggle" as={Link} to="#!" className="pe-1 ps-3 nav-link">
            <Avatar src={img} size="l" />
          </Dropdown.Toggle>

          <Dropdown.Menu className="dropdown-menu-card dropdown-menu-end dropdown-caret dropdown-caret-bg mt-1 me-2">
            <Card className="dropdown-menu-notification dropdown-menu-end shadow-none " style={{ maxWidth: '15rem' }}>
              <Card.Body>
                <Row className="text-center g-0 fs-0 text-primary ">
                  <Col xs={12}>User ID : {lgdata.UserId}</Col>
                  <Col xs={12}>User Name : {lgdata.UserName}</Col>
                  <Col xs={12}>IP : {lgdata.IPDSP}</Col>
                  <Col xs={12}>
                    <Link
                      className="btn btn-outline-info btn-sm mt-4"
                      onClick={event => {
                        Logoffuser();
                        localStorage.removeItem('userData');
                        localStorage.removeItem('partnerData');
                        localStorage.removeItem('menuErp');
                        localStorage.removeItem('menuMobile');
                        localStorage.removeItem('lsMenu');
                        localStorage.removeItem('auth_ERP');
                        localStorage.removeItem('auth_MOBILE');
                        localStorage.removeItem('lsEmail');
                        navigate('/login/IsiLogin');
                        event.preventDefault();
                      }}
                    >
                      Logoff
                    </Link>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* <div className="bg-white rounded-2 py-2 dark__bg-1000">
          <Dropdown.Item className="fw-bold text-warning" href="#!">
            <FontAwesomeIcon icon="crown" className="me-1" />
            <span>Go Pro</span>
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item href="#!">Set status</Dropdown.Item>
          <Dropdown.Item as={Link} to="/user/profile">
            Profile &amp; account
          </Dropdown.Item>
          <Dropdown.Item href="#!">Feedback</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item as={Link} to="/user/settings">
            Settings
          </Dropdown.Item>
          <Dropdown.Item as={Link} to="/authentication/card/logout">
            Logout
          </Dropdown.Item>
        </div> */}
          </Dropdown.Menu>
        </>
      )}
    </Dropdown>
  );
};

export default ProfileDropdown;
