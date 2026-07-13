import React from "react";
import { Button, Col, Image, Row } from "react-bootstrap";
import logoBsr from 'assets/img/logo/logo_new.png';
import svg404 from 'assets/img/404.svg'
import { useNavigate } from "react-router-dom";

const Error404 = () => {
    const navigate = useNavigate();
    return (
        <>
            <div className="w-100 h-100 d-flex flex-column gap-3 justify-content-center align-items-center vh-100">
                <Row className="g-0 text-center w-100 d-flex justify-content-center">
                    <Col className="col-8 col-lg-9 col-xl-9 col-xxl-5 d-flex flex-column gap-6 justify-content-center font-sans-serif">
                        <Image src={logoBsr} fluid width={270} className="mx-auto"/>
                        <Image src={svg404} fluid width={295} className="mx-auto"/>
                        <h5 className="fw-semibold fs-7 m-0 mb-n1">404 - File or directory not found.</h5>
                        <p className="fs-10 m-0">The resource you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
                        <Button variant="primary" size="sm" className="px-7 font-sans-serif py-1 w-fit mx-auto fs-10 fw-normal m-0" onClick={() => navigate('/')}>Home</Button>
                    </Col>
                </Row>                
            </div>
        </>
    )
}

export default Error404