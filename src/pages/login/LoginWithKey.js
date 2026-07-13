import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import * as ISI from 'script/ISI.js';

const URL = process.env.REACT_APP_URL_API;
const LoginWithKeys = () => {
  let { ukeys, uip } = useParams();

  const [userData, setUser] = useState([]);

  const redirectToSessionExpired = () => {
    localStorage.removeItem('userData');
    window.location.href = '/login/IsiLogin';
  };

  const getUser = async () => {
    if (!ukeys || !uip) {
      redirectToSessionExpired();
      return;
    }

    try {
      let temp = await axios({
        url: `${URL}api/Utility/GetLoginWithKey?key=${ukeys}&ip=${uip}`,
        method: 'GET',
        contentType: 'application/json;'
      });
      console.log('TEMP.DATA : ');
      console.log(temp.data);
      setUser(temp.data);
      console.log(userData);
      setLocalStorage(temp.data);
    } catch (err) {
      console.error('Gagal ambil data LoginWithKey:', err);
      redirectToSessionExpired();
      // alert(err);
    } finally {
      //StopProgress(); //to turn off loading
    }
  };

  const setLocalStorage = dt => {
    let tipe = 'Danger';
    let hdr = 'ERROR !!';
    let msg = 'User tidak ditemukan';

    console.log(`User data user name : ${dt.UserName}`);
    console.log(`User data user id : ${dt.UserId}`);
    if (dt.UserName != null) {
      localStorage.setItem('userData', JSON.stringify(dt));
      window.location.href = '/chat';
    } else {
      // ISI.PopAlertFalcon(tipe, hdr, msg, '');
      redirectToSessionExpired();
    }
  };

  useEffect(() => {
    //console.log('useEffect berjalan');
    getUser();
  }, []);

  return <></>;
};

export default LoginWithKeys;
