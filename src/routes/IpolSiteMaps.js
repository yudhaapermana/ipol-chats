import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';

const URL = process.env.REACT_APP_URL_API_LOCAL;

// export const IpolMenuRoutes = () => {

//   const updateQtyData = async () => {
//     try {
//       console.log("masuk" + temp);
//       let temp = await axios({
//         url: `${URL}api/Utility/GetMenuApp?usid=leo`,
//         method: 'GET',
//         contentType: 'application/json; charset=utf-8',
//         headers: {
//           Keys: ''
//         }
//       });
//     } catch (err) {
//       alert(err);
//     }
//   };

//   useEffect( () => {

//   });

//   return (
//     updateQtyData()

//   )

// };
const lgdata = JSON.parse(localStorage.getItem('userData'));
export const IpolMenuRoutes = async () => {
  try {
    console.table('masuk kedua');

    let temp = await axios({
      url: `${URL}api/Utility/GetMenuApp?usid=leo`,
      method: 'GET',
      contentType: 'application/json; charset=utf-8',
      headers: {
        Keys: lgdata.UserTkn
      }
    });
    console.log('masuk' + temp);
    console.table(temp.data);
    return temp.data;
  } catch (err) {
    alert(err);
  }
};

export const getTiketList = async kd => {
  try {
    let temp = await axios({
      url: `${URL}api/Whs201_genPSfromPO/GetListNoTiket?sumber=${kd}`,
      method: 'GET',
      contentType: 'application/json; charset=utf-8',
      headers: {
        Keys: lgdata.UserTkn
      }
    });
    //setTiketList(temp.data.ListTiket);
    //console.log(temp.data);
    return temp.data;
  } catch (err) {
    alert(err);
  }
};

// export default function menuadd(){
//   try {

//     let temp = axios.request({
//       url: `${URL}api/Utility/GetMenuApp?usid=leo`,
//       method: 'POST',
//       contentType: 'application/json; charset=utf-8',
//       headers: {
//         Keys: ''
//       }
//     });
//     console.log("masuk" + temp);
//     console.table(temp.data)
//     return temp;
//   } catch (err) {
//     alert(err);
//   }
// }

//export default IpolMenuRoutes;
