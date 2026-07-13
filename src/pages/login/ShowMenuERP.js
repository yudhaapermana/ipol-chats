import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import * as ISI from 'script/ISI.js';

const URL = process.env.REACT_APP_URL_API;
const ShowMenuERP = () => {
  const navigate = useNavigate();
  const isrunn = useRef(false);
  let { key, ip, mnid, kd } = useParams();
  const [userData, setUser] = useState([]);
  const [mnlink, SetMenu] = useState('');
  const [unq, setunq] = useState(new Date().getTime().toLocaleString());
  const lgdata = JSON.parse(localStorage.getItem('userData'));

  const getUser = async () => {
    //alert(`${URL}api/Utility/GetLoginWithKey?key=${key}&ip=${ip}`);
    try {
      let temp = await axios({
        url: `${URL}api/Utility/GetLoginWithKey?key=${key}&ip=${ip}`,
        method: 'GET',
        contentType: 'application/json;'
      });

      setUser(temp.data);
      temp.data.iserp = 'Y';
      setLocalStorage(temp.data);
    } catch (err) {
      alert(err);
    } finally {
      //StopProgress(); //to turn off loading
    }
  };

  const GetTkn = async () => {
    try {
      await axios({
        url: `${URL}api/Utility/UpdateTkn`,
        method: 'POST',
        data: lgdata,
        contentType: 'application/json;'
      })
        .then(response => {
          localStorage.removeItem('userData');
          //localStorage.setItem('userData', JSON.stringify(response.data));
          setLocalStorage(response.data);
        })
        .catch(err => {
          ISI.PopAlertFalcon('error', 'error', err.response.data.Message, '');
        });
    } catch (err) {
      alert(err);
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
      if (kd != null) {
        let mn = mnid.replace(/~/g, '/').replace('%3F', '?');

        ISI.resetReq();
        navigate(`../../${mn}`);
      } else {
        GetLinkMenu(dt);
      }
    } else {
      ISI.PopAlertFalcon(tipe, hdr, msg, '');
    }
  };

  const GetLinkMenu = async dt => {
    try {
      let ConstData = dt;
      ConstData = ConstData ?? lgdata;

      console.log('ConstData : ', dt);
      console.log('lgdata : ', lgdata);

      if (ConstData) {
        let a = unq.replace(/,/g, '');
        let temp = await axios({
          url: `${URL}api/Utility/GetMenuDetail?id=${mnid}`,
          method: 'GET',
          contentType: 'application/json;',
          headers: {
            Keys: ConstData.UserTkn
          }
        });
        SetMenu(temp.data.TargetURL);
        localStorage.setItem('ERPMenu', 'Y');
        //alert(temp.data.TargetURL);
        ISI.resetReq();
        if (temp.data.TargetURL.includes('?')) navigate(`../../${temp.data.TargetURL}&ts=${a}`);
        else navigate(`../../${temp.data.TargetURL}?${a}`);
      }
    } catch (err) {
      console.log('err', err);
      ISI.resetReq();
      ISI.PopAlertFalcon('error', 'error', err.response.data.Message, '');
    }
  };

  useEffect(() => {
    //alert(kd);
    if (isrunn.current === false) {
      ISI.setReq();
      //console.log(lgdata);

      if (!lgdata || lgdata.Keys != key) {
        // alert('login ulang');
        getUser();
      } else {
        GetTkn();
      }

      // if (kd != null) {
      //   let mn = mnid.replace(/~/g, '/');

      //   ISI.resetReq();
      //   navigate(`../../${mn}`);
      // }
      // else {
      //   GetLinkMenu();
      // }
      return () => {
        isrunn.current = true;
      };
    }
  }, []);

  return <></>;
};

export default ShowMenuERP;
