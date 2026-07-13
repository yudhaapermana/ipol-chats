import React, { useContext, useEffect, useReducer, useState } from 'react';
import PropTypes from 'prop-types';
import AppContext from 'context/Context';
import { settings } from './config';
import { getColor, getItemFromStore } from 'helpers/utils';
import { configReducer } from './reducers/configReducer';
import useToggleStyle from './hooks/useToggleStyle';

import { Chart as ChartJS, registerables } from 'chart.js';
import * as ISI from 'script/ISI';
import mqtt from 'mqtt';
// import logo from '../../assets/img/imes/logo.png';
import logo from 'assets/img/logo/Logo.svg';
import { Image } from 'react-bootstrap';

ChartJS.register(...registerables);

const Main = props => {
  const configState = {
    isFluid: getItemFromStore('isFluid', settings.isFluid),
    isRTL: getItemFromStore('isRTL', settings.isRTL),
    isDark: getItemFromStore('isDark', settings.isDark),
    theme: getItemFromStore('theme', settings.theme),
    navbarPosition: getItemFromStore('navbarPosition', settings.navbarPosition),
    disabledNavbarPosition: [],
    isNavbarVerticalCollapsed: getItemFromStore('isNavbarVerticalCollapsed', settings.isNavbarVerticalCollapsed),
    navbarStyle: getItemFromStore('navbarStyle', settings.navbarStyle),
    currency: settings.currency,
    showBurgerMenu: settings.showBurgerMenu,
    showSettingPanel: false,
    navbarCollapsed: false,
    openAuthModal: false,
    left: getItemFromStore('left', ISI),
    MqttClient: null,
    isUpdateMQTT: ''
  };

  const [config, configDispatch] = useReducer(configReducer, configState);

  const setConfig = (key, value) => {
    configDispatch({
      type: 'SET_CONFIG',
      payload: {
        key,
        value,
        setInStore: ['isFluid', 'isRTL', 'isDark', 'theme', 'navbarPosition', 'isNavbarVerticalCollapsed', 'navbarStyle'].includes(key)
      }
    });
  };
  const { isLoaded } = useToggleStyle(config.isRTL, config.isDark);

  useEffect(() => {
    const isDark = config.theme === 'auto' ? window.matchMedia('(prefers-color-scheme: dark)').matches : config.theme === 'dark';

    setConfig('isDark', isDark);
  }, [config.theme]);

  const changeTheme = theme => {
    const isDark = theme === 'auto' ? window.matchMedia('(prefers-color-scheme: dark)').matches : theme === 'dark';

    document.documentElement.setAttribute('data-bs-theme', isDark ? 'dark' : 'light');

    setConfig('theme', theme);
    setConfig('isDark', isDark);
  };

  if (!isLoaded) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundColor: config.isDark ? getColor('dark') : getColor('light')
        }}
      />
    );
  }

  //#region MQTT

  const getMQTT = x => {
    let connectUrl = '';
    let pr = 0;
    if (window.location.protocol == 'https:') {
      connectUrl = 'wss://mqtt.indopoly.co.id:8084/mqtt';
      pr = 8084;
    } else {
      connectUrl = 'ws://mqtt.indopoly.co.id:8083/mqtt';
      pr = 8083;
    }

    var clientoee = mqtt.connect(connectUrl, {
      keepalive: 60,
      clientId: 'GETAPP' + x.replaceAll(':', ''),
      connectTimeout: 5000,
      hostname: 'mqtt.indopoly.co.id',
      port: pr,
      path: '/mqtt'
    });

    clientoee.on('error', err => {
      // console.log('Connection error: ', err);
    });

    clientoee.on('reconnect', () => {
      // console.log('Reconnecting...');
    });

    clientoee.on('connect', () => {
      // console.log('Clientoee connected:');

      let topic = 'MQTT_UPDATEDERP';
      let qos = 0;
      clientoee.subscribe(topic, { qos }, error => {
        if (error) {
          console.log('Subscribe error:', error + ` ${topic}`);
          return;
        }
        // console.log(`Subscribe to topic ${topic}`);
      });
    });

    clientoee.on('message', (topic, payload) => {
      var data = payload.toString().replaceAll("'", '"');
      if (payload.toString() != '') {
        var dt = '';
        try {
          if (data != 'None') dt = JSON.parse(data);
        } catch (error) {}
        if (topic == 'MQTT_UPDATEDERP') {
          setConfig('isUpdateMQTT', dt);
        }
      }
    });
    setConfig('MqttClient', clientoee);
  };

  const PublishMQTT = (loc, obj) => {
    if (config.MqttClient != null) {
      if (config.MqttClient.connected == true) {
        let objx = {
          Files: loc,
          Obj: obj
        };
        config.MqttClient.publish('MQTT_UPDATEDERP', JSON.stringify(objx));
      }
    }
  };

  //#endregion
  return (
    <AppContext.Provider value={{ config, setConfig, configDispatch, changeTheme, getMQTT, PublishMQTT }}>
      {props.children}
      <div id="progressback" style={{ display: 'none' }}></div>
      {/* <div id="LoadBox" style={{ display: 'none' }}>
        <div className="sk-circle">
          <div className="sk-circle1 sk-child"></div>
          <div className="sk-circle2 sk-child"></div>
          <div className="sk-circle3 sk-child"></div>
          <div className="sk-circle4 sk-child"></div>
          <div className="sk-circle5 sk-child"></div>
          <div className="sk-circle6 sk-child"></div>
          <div className="sk-circle7 sk-child"></div>
          <div className="sk-circle8 sk-child"></div>
          <div className="sk-circle9 sk-child"></div>
          <div className="sk-circle10 sk-child"></div>
          <div className="sk-circle11 sk-child"></div>
          <div className="sk-circle12 sk-child"></div>
        </div>
      </div> */}
      <div id="LoadBox" className="backload" style={{ display: 'none' }}>
        <div className="loading-container1">
          <Image src={logo} className="img-fluid logo" />
        </div>
      </div>
      <div className="modal fade modalFront" id="mdlAlert" role="dialog" style={{ zIndex: 999999 }}></div>
    </AppContext.Provider>
  );
};

Main.propTypes = { children: PropTypes.node };

export const useAppContext = () => useContext(AppContext);
export default Main;
