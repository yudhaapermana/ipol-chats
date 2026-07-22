import React, { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from 'components/app/kanban/Sidebar';
import CustomNavbar from 'components/app/kanban/CustomNavbar';
import SecondarySidebar from 'components/app/kanban/SecondarySidebar';
import ProductProvider from 'components/app/e-commerce/ProductProvider';
import CourseProvider from 'components/app/e-learning/CourseProvider';
import { Outlet } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAppContext } from 'Main';
import { left } from 'script/ISI';
import * as ISI from 'script/ISI.js?2';
import mqtt from 'mqtt';
import { If } from 'three/src/nodes/tsl/TSLCore';

const MainLayout = () => {
  const navigate = useNavigate();
  const { hash, pathname } = useLocation();
  const {
    config: { isFluid, navbarPosition }
  } = useAppContext();

  const URL = process.env.REACT_APP_URL_API;
  const BYPASS_URLS = process.env.REACT_APP_URL_NO_USER?.split('|') || [];

  const [erps, setErps] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [active, setActive] = useState(false);
  const [isHold, setIsHold] = useState(false);

  const lgdata = JSON.parse(localStorage.getItem('userData'));
  const isbypas = BYPASS_URLS.find(x => pathname.toUpperCase().startsWith(x.toUpperCase()));

  const UpdateTkn = async () => {
    // try {
    await axios({
      url: `${URL}api/Utility/CekSession?tkn=${lgdata?.UserTkn}`,
      method: 'GET',
      contentType: 'application/json; charset=utf-8',
      headers: {
        Keys: lgdata?.UserTkn,        
      }
    })
      .then(response => {
        // if (!response.data) {
        //   localStorage.removeItem('userData');
        //   navigate('/Login');
        // }
      })
      .catch(err => {
        ISI.AlertException(err);
      });
    // } catch (err) {
    //   ISI.AlertException(err);
    // }
  };

  const EXP_THRESHOLD_HOURS = 1.5;
  const isUpdatingTkn = useRef(false);

  const UpdateExpTkn = async (currentLgdata) => {
    if (isUpdatingTkn.current) return;
    isUpdatingTkn.current = true;

    try {
      await axios({
        url: `${URL}api/Utility/UpdateTkn`,
        method: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: currentLgdata,
        headers: {
          Keys: currentLgdata?.UserTkn
        }
      })
        .then(response => {
          localStorage.setItem('userData', JSON.stringify(response.data));
          // if (!response.data) {
          //   localStorage.removeItem('userData');
          //   navigate('/Login');
          // }
        })
        .catch(err => {
          // ISI.AlertException(err);
        });
    } catch (err) {
      console.error('Gagal update token:', err);
      // ISI.AlertException(err);
    } finally {
      isUpdatingTkn.current = false;
    }
  };

  const handleContentClick = () => {
    const currentLgdata = JSON.parse(localStorage.getItem('userData') || 'null');

    if (currentLgdata?.LogTkn) {
      const logTknTime = new Date(currentLgdata.LogTkn).getTime();
      const now = new Date().getTime();
      const diffHours = (now - logTknTime) / (1000 * 60 * 60);

      if (diffHours > EXP_THRESHOLD_HOURS) {
        UpdateExpTkn(currentLgdata);
      }
    }
  };

  useEffect(() => {
    const isInsideIframe = window.self !== window.top;
    let erpStatus = isInsideIframe ? 'Y' : 'N';

    try {
      if (window.location.ancestorOrigins && window.location.ancestorOrigins[0] === window.location.origin) {
        erpStatus = 'N';
      }
    } catch (e) {
      erpStatus = 'Y';
    }

    setErps(erpStatus);

    if (!lgdata && !isbypas) {
      setIsOpen(false);
      navigate('/login/IsiLogin', { replace: true });
    } else {
      if (!isbypas) {
        UpdateTkn();
      }

      if (hash) {
        const id = hash.replace('#', '');
        requestAnimationFrame(() => {
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({ block: 'start', behavior: 'smooth' });
          }
        });
      }
    }
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
    } catch { }
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
      // getMQTT(lgdata.IP);
    }
  } else {
    // console.log('ClientMqtt', ClientMqtt);
  }

  const handleSubMenuClick = menu => {
    if (isExpanded || isHold) {
      setActiveSubMenu(menu);
      if ((menu && activeSubMenu?.MenuName === menu?.MenuName) || !menu) {
        setActiveSubMenu(null);
        setActive(false);
      } else {
        setActive(true);
      }
    }
  };

  const handleHamburgerClick = () => {
    setIsExpanded(true);
    setActiveSubMenu(null);
    setActive(false);
  };

  return (
    <>
      {isOpen && (
        <div className="app-container" onClick={handleContentClick}>
          {/* {erps != 'Y' && (navbarPosition === 'vertical' || navbarPosition === 'combo') && (
            <Sidebar
              isExpanded={isExpanded}
              isHold={isHold}
              activeSubMenu={activeSubMenu}
              onMouseEnter={() => {
                if (!isHold) setIsExpanded(true);                
              }}
              onMouseLeave={() => {
                if (!isHold && !activeSubMenu) setIsExpanded(false);                
              }}
              toggleSidebar={() => {
                if (!isHold) {                  
                  setIsHold(true);
                  setIsExpanded(true);                  
                } else {                  
                  setIsHold(false);
                  setIsExpanded(false);                  
                }
              }}
              active={active}
              onSubMenuClick={menu => handleSubMenuClick(menu)}
            />
          )}

          {erps != 'Y' && (navbarPosition === 'vertical' || navbarPosition === 'combo') && (
            <SecondarySidebar
              isHold={isHold}
              activeSubMenu={activeSubMenu}
              isSidebarExpanded={isExpanded}
              active={active}
              onMouseLeave={() => {
                !isHold && setIsExpanded(false);
              }}
              onClose={() => {
                setActiveSubMenu(null), setActive(false);
              }}
            />
          )} */}
          <ProductProvider>
            <CourseProvider>
              <div className={`main-wrapper d-flex flex-column ${erps == 'Y' ? 'ps-0' : ''}`}>
                {erps != 'Y' && <CustomNavbar onHamburgerClick={handleHamburgerClick} />}
                <main className="p-1 flex-grow-1">
                  <Outlet />
                  {/* {children} */}
                </main>
              </div>
            </CourseProvider>
          </ProductProvider>
        </div>
      )}
    </>
  );
};

export default MainLayout;
