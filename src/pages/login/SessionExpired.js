import React from 'react';
import { Button, Col, Image, Row } from 'react-bootstrap';
import logoBsr from 'assets/img/logo/logo_new.png';
import session from 'assets/img/session.svg';
import { useNavigate } from 'react-router-dom';

const SessionExpired = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="w-100 h-100 d-flex flex-column gap-3 justify-content-center align-items-center vh-100">
        <Row className="g-0 text-center w-100 d-flex justify-content-center">
          <Col className="col-12 col-lg-6 col-xl-6 col-xxl-3 d-flex flex-column gap-6 justify-content-center font-sans-serif">
            <Image src={logoBsr} fluid width={270} className="mx-auto" />
            <Image src={session} fluid width={295} className="mx-auto" />
            <h5 className="fw-semibold fs-7 m-0 mb-n1">Your Session Has Expired</h5>
            <p className="fs-10 m-0">Please login again. Don’t worry we kept all of your data.</p>
            <Button
              variant="primary"
              size="sm"
              className="px-7 font-sans-serif py-1 w-fit mx-auto fs-10 fw-normal m-0"
              onClick={() => {
                navigate('/login/IsiLogin'), localStorage.removeItem('userData'), localStorage.removeItem('menuErp');
                localStorage.removeItem('menuMobile');
                localStorage.removeItem('lsMenu');
                localStorage.removeItem('auth_ERP');
                localStorage.removeItem('auth_MOBILE');
                localStorage.removeItem('lsEmail');
              }}
            >
              Login
            </Button>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default SessionExpired;
