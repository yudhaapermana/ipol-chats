import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import MainLayout from 'layouts/MainLayout';
import Default from 'pages/default/Default';

import Whs201_genPSfromPO from 'pages/warehouse/Whs201_genPSfromPO';
import Whs201_genPSfromPORM from 'pages/warehouse/Whs201_genPSfromPORM';
import Whs165_transLoc from 'pages/warehouse/Whs165_transferLocation';
import Whs165_transHist from 'pages/warehouse/Whs165_transferLocHist';
import Whs011_proyeksiLDList from 'pages/warehouse/Whs011_proyeksiLDList';
import Whs011_proyeksiLD from 'pages/warehouse/Whs011_proyeksiLD';
import Whs010_SuratJalanPartList from 'pages/warehouse/Whs010_SuratJalanPartList';
import Whs010_SuratJalanPartEntry from 'pages/warehouse/Whs010_SuratJalanPartEntry';
import Whs010_ConfirmSuratJalan from 'pages/warehouse/whs010_ConfirmSuratJalan';
const WarehouseRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* <Route path="/" element={<Default />} />   */}
        <Route path="warehouse/Whs010_ConfirmSuratJalan/:kd" element={<Whs010_ConfirmSuratJalan />} />
        <Route path="warehouse/Whs201_genPSfromPO/:kd" element={<Whs201_genPSfromPO />} />
        <Route path="warehouse/Whs165_transferLocation/:kd" element={<Whs165_transLoc />} />
        <Route path="warehouse/Whs165_transferLocHist/:kd" element={<Whs165_transHist />} />
        <Route path="warehouse/Whs011_proyeksiLDList" element={<Whs011_proyeksiLDList />} />
        <Route path="warehouse/Whs011_proyeksiLD/:key/:act" element={<Whs011_proyeksiLD />} />
        <Route path="warehouse/Whs010_SuratJalanPartList/:act" element={<Whs010_SuratJalanPartList />} />
        <Route path="warehouse/Whs010_SuratJalanPartEntry/:key/:act" element={<Whs010_SuratJalanPartEntry />} />
      </Route>
    </Routes>
  );
};

export default WarehouseRoutes;
