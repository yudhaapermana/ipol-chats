import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import BtnMenu from 'components/navbar/headermenu/BtnMenu';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useBreakpoints } from 'hooks/useBreakpoints';
import logo from 'assets/img/logo/Logo.svg';
import { Image } from 'react-bootstrap';

const IframeViewer = () => {
  const navigate = useNavigate();
  const { Url } = useParams();
  const [searchParams] = useSearchParams();
  const lgdata = JSON.parse(localStorage.getItem('userData'));
  const EErl = process.env.REACT_APP_URL_ERP;
  const MErl = process.env.REACT_APP_URL_MOBILE;

  const type = searchParams.get('type');
  const key = lgdata?.Keys;
  const baseUrl = type === 'MOBILE' ? MErl : EErl;
  const decodedUrl = decodeURIComponent(Url);

  const isAlreadyAuthed = localStorage.getItem(`auth_${type}`) === 'true';  
  
  const [currentSrc, setCurrentSrc] = useState(null);  
  const [isLoading, setIsLoading] = useState(true);

  const handleIframeLoad = () => {
    setIsLoading(false);

    if (!isAlreadyAuthed) {
      type && localStorage.setItem(`auth_${type}`, 'true');

      if (type === 'MTH') {
        setCurrentSrc(decodedUrl);
      }

      if (type === 'MOBILE') {
        setCurrentSrc(`${baseUrl}/${decodedUrl}`);
      }
    }
  };

  const iframeRef = useRef(null);

  useEffect(() => {
    setIsLoading(true);

    if (isAlreadyAuthed) {
      const finalTarget = type === 'MTH' ? decodedUrl : `${baseUrl}/${decodedUrl}`;
      setCurrentSrc(finalTarget);
    } else if (!type) {
      setCurrentSrc(decodedUrl);
    } else {
      if (type === 'MTH' || type === 'MOBILE') {
        setCurrentSrc(`${baseUrl}/default.aspx?key=${key}`);
      } else {
        setCurrentSrc(`${baseUrl}/default.aspx?key=${key}&durl=${decodedUrl}`);
      }
    }
  }, [Url, type, key, baseUrl, isAlreadyAuthed]);

  useEffect(() => {
    const handleMessage = event => {
      const data = event.data;

      if (data && data.func === 'BackApp') {
        navigate('/');
      }
      if (data && data.func === 'Notfound') {
        navigate('/login/error404');
      }
      if (data && data.func === 'SessionTimeOut') {
        localStorage.removeItem(`auth_${type}`);

        if (type === 'MTH') {
          setCurrentSrc(`${baseUrl}/default.aspx?key=${key}`);
        } else {
          setCurrentSrc(`${baseUrl}/default.aspx?key=${key}&durl=${decodedUrl}`);
        }
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [navigate]);

  // const handleIframeLoad = () => {
  //   try {
  //     const currentIframeUrl = iframeRef.current;

  //     console.log('Iframe loaded with URL:', currentIframeUrl);

  //     if (isAuthStep) {
  //       localStorage.setItem(`auth_${type}`, 'true');
  //       setIsAuthStep(false);
  //       setCurrentSrc(decodedUrl);
  //       return;
  //     }

  //     if (currentIframeUrl.includes('Main.aspx') || currentIframeUrl.includes('tabcontent.aspx')) {
  //       navigate('/');
  //     }
  //   } catch (error) {
  //     console.error('Error accessing iframe content:', error);
  //     if (isAuthStep) {
  //       localStorage.setItem(`auth_${type}`, 'true');
  //       setIsAuthStep(false);
  //       setCurrentSrc(decodedUrl);
  //     }
  //   }
  // };

  // useEffect(() => {
  //   const isAlreadyAuthed = localStorage.getItem(`auth_${type}`) === 'true';
  //   const needsAuth = !!type && !!key && !isAlreadyAuthed;

  //   if (needsAuth) {
  //     setIsAuthStep(true);
  //     setCurrentSrc(`${baseUrl}/default.aspx?key=${key}`);
  //   } else {
  //     setIsAuthStep(false);
  //     setCurrentSrc(decodedUrl);
  //   }
  // }, [Url, type, key, baseUrl]);

  return (
    <div className="card d-flex flex-column p-2 h-100">
      {isLoading && (
        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-white" style={{ zIndex: 5, opacity: 0.8 }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
        // <div id="LoadBox" className="backload">
        //   <div className="loading-container1">
        //     <Image src={logo} className="img-fluid logo" />
        //   </div>
        // </div>
      )}
      {/* <iframe ref={iframeRef} src={currentSrc} title={`ERP ${type}`} className="w-100 h-100" onLoad={handleIframeLoad} onChange={handleIframeLoad}/> */}
      <iframe ref={iframeRef} src={currentSrc} title={`ERP ${type}`} className={`w-100 h-100 ${isLoading ? 'd-none' : 'd-block'}`} onLoad={handleIframeLoad} />
    </div>
  );
};

export default IframeViewer;
