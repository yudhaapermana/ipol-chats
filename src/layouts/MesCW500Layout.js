import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import MesCW500NavbarTop from 'components/navbar/top/MesCW500NavbarTop';
import MesCW500NavbarVertical from 'components/navbar/vertical/MesCW500NavbarVertical';
import Footer from 'components/footer/Footer';
import ProductProvider from 'components/app/e-commerce/ProductProvider';
import CourseProvider from 'components/app/e-learning/CourseProvider';
import ModalAuth from 'components/authentication/modal/ModalAuth';

import { useAppContext } from 'Main';
import { left } from 'script/ISI';
import * as ISI from 'script/ISI.js?2';
import mqtt from 'mqtt';
import axios from 'axios';

const MesCW500Layout = () => {
  const navigate = useNavigate();
  const URL = process.env.REACT_APP_URL_API;
  const urlnoroot = process.env.REACT_APP_URL_NO_USER;
  const { hash, pathname } = useLocation();
  const isKanban = pathname.includes('kanban');
  // const isChat = pathname.includes('chat');
  const lgdata = JSON.parse(localStorage.getItem('userData'));
  const erpmenu = localStorage.getItem('ERPMenu');

  let burl = urlnoroot.split('|');
  let isbypas = burl.find(x => x.toUpperCase() == left(pathname.toUpperCase(), x.length));

  //alert(`${isbypas} ,${pathname} `);
  //let types = 'N';
  const [erps, Seterps] = useState('');
  const [isopen, setisopen] = useState(true);
  const {
    config: { isFluid, navbarPosition, isNavbarVerticalCollapsed }
  } = useAppContext();

  useEffect(() => {
    if (isNavbarVerticalCollapsed == false) {
      setConfig('isNavbarVerticalCollapsed', true);
    }
  }, [isNavbarVerticalCollapsed]);

  const UpdateTkn = async () => {
    // try {
    await axios({
      url: `${URL}api/Utility/CekSession?tkn=${lgdata.UserTkn}`,
      method: 'GET',
      contentType: 'application/json; charset=utf-8',
      headers: {
        Keys: lgdata.UserTkn
      }
    })
      .then(response => {
        // if (!response.data) {
        //   localStorage.removeItem('userData');
        //   navigate('/authentication/card/login');
        // }
      })
      .catch(err => {
        ISI.AlertException(err);
      });
    // } catch (err) {
    //   ISI.AlertException(err);
    // }
  };

  useEffect(() => {
    //alert(lgdata.iserp);
    if (self == top) {
      Seterps('N');
    } else Seterps('Y');

    try {
      if (self.location.ancestorOrigins[0] == self.location.origin) Seterps('N');
    } catch {}

    // alert(isbypas);

    if (!lgdata && !isbypas) {
      setisopen(false);
      navigate('/authentication/card/login');
    } else {
      if (!isbypas) UpdateTkn();
      //else setisopen(false);
      setTimeout(() => {
        if (hash) {
          const id = hash.replace('#', '');
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({ block: 'start', behavior: 'smooth' });
          }
        }
      }, 0);
    }
    // console.log('MASUK KE USEEFFECT');
  }, []);

  const prosesInputBox = () => {
    //add X for deleted input box
    try {
      function setNativeValue(element, value) {
        let lastValue = element.value;
        element.value = value;
        let event = new Event('input', { target: element, bubbles: true });
        event.simulated = true;

        let eventChange = new Event('change', { target: element, bubbles: true });
        eventChange.simulated = true;
        // React 15
        // React 16
        let tracker = element._valueTracker;
        if (tracker) {
          tracker.setValue(lastValue);
        }
        element.dispatchEvent(event);
        element.dispatchEvent(eventChange);
      }
      const clickOnX = event => {
        event.target.removeEventListener('click', clickOnX);
        event.target.removeEventListener('mousemove', mouseX);
        setNativeValue(event.target, '');
      };
      const mouseX = event => {
        let iev = event.target.offsetWidth - 18 < event.clientX - event.target.getBoundingClientRect().left + 10;
        if (iev) {
          event.target.classList.add('onX');
          event.target.addEventListener('click', clickOnX);
        } else {
          event.target.classList.remove('onX');
          event.target.removeEventListener('click', clickOnX);
        }
      };
      const blurable = event => {
        event.target.classList.remove('clearForm');
        event.target.classList.remove('onX');
        event.target.removeEventListener('mousemove', mouseX);
      };
      const clearable = event => {
        if (event.target.value !== '') {
          event.target.classList.add('clearForm');
          event.target.removeEventListener('mousemove', mouseX);
          event.target.addEventListener('mousemove', mouseX);
        } else {
          event.target.classList.remove('clearForm');
          event.target.classList.remove('onX');
          event.target.removeEventListener('mousemove', mouseX);
        }
      };
      const inputs = document.getElementsByClassName('form-control');
      for (let i = 0; i < inputs.length; i++) {
        if (!inputs[i].readOnly) {
          if (inputs[i].type.substr(0, 6) == 'select') {
            inputs[i].addEventListener('change', clearable);
          } else {
            inputs[i].addEventListener('input', clearable);
          }
          inputs[i].addEventListener('blur', blurable);
          inputs[i].addEventListener('focus', clearable);
        }
      }

      return () => {
        for (let i = 0; i < inputs.length; i++) {
          if (inputs[i].type.substr(0, 6) == 'select') inputs[i].removeEventListener('change', clearable);
          else inputs[i].removeEventListener('input', clearable);

          inputs[i].removeEventListener('blur', blurable);
          inputs[i].removeEventListener('focus', clearable);
          inputs[i].removeEventListener('mousemove', mouseX);
        }
      };
    } catch {}
  };

  const {
    config: { isUpdateMQTT },
    setConfig,
    getMQTT
  } = useAppContext();

  useEffect(() => {
    prosesInputBox();
    window.scrollTo(0, 0);
    setConfig(isUpdateMQTT, '');
  }, [pathname]);

  const [ClientMqtt, setClientMqtt] = useState(null);

  if (lgdata && ClientMqtt == null) {
    if (lgdata.IP) {
      setClientMqtt('X');
      getMQTT(lgdata.IP);
    }
  } else {
    // console.log('ClientMqtt', ClientMqtt);
  }
  return (
    <>
      {isopen && (
        <div className={erps == 'Y' ? '' : isFluid ? 'container-fluid' : 'container'}>
          {erps != 'Y' && !isbypas && (navbarPosition === 'vertical' || navbarPosition === 'combo') && <MesCW500NavbarVertical />}
          <ProductProvider>
            <CourseProvider>
              <div className={classNames('content', { 'pb-0': isKanban })}>
                {erps != 'Y' && <MesCW500NavbarTop />}
                {/*------ Main Routes ------*/}
                <Outlet />
                {/** !isKanban && <Footer /> */}
              </div>
            </CourseProvider>
          </ProductProvider>
          <ModalAuth />
        </div>
      )}
    </>
  );
};

export default MesCW500Layout;
