import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import * as ISI from 'script/ISI.js';

const URL = process.env.REACT_APP_URL_API;
const Logoff = () => {
  const navigate = useNavigate();
  const lgdata = JSON.parse(localStorage.getItem('userData'));

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

  useEffect(() => {
    if (lgdata.UserId) Logoffuser();
    localStorage.removeItem('userData');
    //navigate('/Login');
  }, []);
};

export default Logoff;
