import React from 'react';
import bg from 'assets/img/side-login.svg';
import bg2 from 'assets/img/side-login-2.svg';
import bg3 from 'assets/img/side-login-3.svg';
import bg4 from 'assets/img/side-login-4.svg';
import logo from 'assets/img/logo/logo_new.png';
import { Card, Carousel, Col, Image, Nav, Row } from 'react-bootstrap';
import IsiTxt from 'components/form/IsiTxt';
import LoginForm from 'components/authentication/LoginForm';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useBreakpoints } from 'hooks/useBreakpoints';

const IsiLogin = () => {
  let { width, height, breakpoints } = useBreakpoints();
  let htab = height - 110;
  let htabe = height - 50;

  return (
    <>
      <div className="p-4 custom-login" style={{ height: self === top ? htab + 110 : htabe + 110 }}>
        <Row className="g-0 h-100">
          <Col md={5} lg={6} xl={6} className="d-none d-md-block">
            {/* <Image src={bg} fluid className="w-100 rounded-4" style={{ objectFit: 'cover', objectPosition: 'center', height: self == top ? htab + 66 : htabe + 66 }} /> */}
            <Carousel nextIcon={<FontAwesomeIcon icon="angle-right" />} prevIcon={<FontAwesomeIcon icon="angle-left" />} className="h-100 w-100 rounded-4 overflow-hidden" style={{ width: '91%' }}>
              <Carousel.Item>
                <Image src={bg} fluid className="w-100 rounded-4" style={{ objectFit: 'cover', objectPosition: 'center', height: self == top ? htab + 69 : htabe + 69 }} />
              </Carousel.Item>
              <Carousel.Item>
                <Image src={bg2} fluid className="w-100 rounded-4" style={{ objectFit: 'cover', objectPosition: 'center', height: self == top ? htab + 69 : htabe + 69 }} />
              </Carousel.Item>
              <Carousel.Item>
                <Image src={bg3} fluid className="w-100 rounded-4" style={{ objectFit: 'cover', objectPosition: 'top', height: self == top ? htab + 69 : htabe + 69 }} />
              </Carousel.Item>
              <Carousel.Item>
                <Image src={bg4} fluid className="w-100 rounded-4" style={{ objectFit: 'cover', objectPosition: 'top', height: self == top ? htab + 69 : htabe + 69 }} />
              </Carousel.Item>
            </Carousel>
          </Col>

          <Col xs={12} md={7} lg={6} xl={6} className="d-flex align-items-center justify-content-center">
            <Row className="p-3 ps-sm-6 p-md-0 w-100 g-0">
              <Col lg={9} className="mx-auto">
                <Card className="p-4 rounded-4 h-fit">
                  <Card.Body className="p-0 d-flex flex-column gap-lg-4 gap-3">
                    <Image src={logo} fluid style={{ maxWidth: '400px' }} />
                    <h4 className="fs-5 m-0">Login</h4>
                    <LoginForm layout="card" hasLabel />
                    <Nav.Link className="fs-10 font-sans-serif fw-semibold m-0 mt-3">
                      Read our <span className="text-primary">terms</span> and <span className="text-primary">conditions</span>{' '}
                    </Nav.Link>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default IsiLogin;
