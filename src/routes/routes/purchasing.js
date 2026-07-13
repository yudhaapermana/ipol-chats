import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from 'layouts/MainLayout';

import Pu018_LeadTimeAnalysis from 'pages/purchasing/Pu018_LeadTimeAnalysis';
import Pu004_PriceCompareInput from 'pages/purchasing/Pu004_PriceCompareInput';
import Pu004_PriceCompareEntry from 'pages/purchasing/Pu004_PriceCompareEntry';
import Pu004_PriceCompareList from 'pages/purchasing/Pu004_PriceCompareList';
import Pu004_konsinyasiList from 'pages/purchasing/Pu004_konsinyasiList';
import Pu004_konsinyasiRequest from 'pages/purchasing/Pu004_konsinyasiRequest';
import Pu004_konsinyasiReqList from 'pages/purchasing/Pu004_konsinyasiReqList';
import Pu020_SalesOrderPartList from 'pages/purchasing/Pu020_SalesOrderPartList';
import Pu020_SalesOrderPartEntry from 'pages/purchasing/Pu020_SalesOrderPartEntry';
import Pu010_BPPKList from 'pages/purchasing/Pu010_BPPKList';
import Pu010_BPPKEntryList from 'pages/purchasing/Pu010_BPPKEntryList';
import Pu010_BPPKEntry from 'pages/purchasing/Pu010_BPPKEntry';
import Pu004_GenP2BRKBPPBList from 'pages/purchasing/Pu004_GenP2BRKBPPBList';
import Pu010_LpbReturnList from 'pages/purchasing/pu010_LpbReturnList';
import Pu010_LpbReturnEntry from 'pages/purchasing/Pu010_LpbReturnEntry';

const PurchasingRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* <Route path="/" element={<Default />} /> */}
        <Route path="purchasing/Pu018_LeadTimeAnalysis" element={<Pu018_LeadTimeAnalysis />} />
        <Route path="purchasing/Pu004_PriceCompareInput" element={<Pu004_PriceCompareInput />} />
        <Route path="purchasing/Pu004_PriceCompareList/:act" element={<Pu004_PriceCompareList />} />
        <Route path="purchasing/Pu004_PriceCompareEntry/:key/:act" element={<Pu004_PriceCompareEntry />} />
        <Route path="purchasing/Pu004_konsinyasiReqList" element={<Pu004_konsinyasiReqList />} />
        <Route path="purchasing/Pu004_konsinyasiList" element={<Pu004_konsinyasiList />} />
        <Route path="purchasing/Pu004_konsinyasiRequest/:key/:act" element={<Pu004_konsinyasiRequest />} />
        <Route path="purchasing/Pu020_SalesOrderPartList/:act" element={<Pu020_SalesOrderPartList />} />
        <Route path="purchasing/Pu020_SalesOrderPartEntry/:key/:act" element={<Pu020_SalesOrderPartEntry />} />
        <Route path="purchasing/Pu010_BPPKList/:act" element={<Pu010_BPPKList />} />
        <Route path="purchasing/Pu010_BPPKEntryList" element={<Pu010_BPPKEntryList />} />
        <Route path="purchasing/Pu010_BPPKEntry/:key/:act" element={<Pu010_BPPKEntry />} />
        <Route path="purchasing/Pu004_GenP2BRKBPPBList" element={<Pu004_GenP2BRKBPPBList />} />
        <Route path="purchasing/pu010_LpbReturnList" element={<Pu010_LpbReturnList />} />
        <Route path="purchasing/pu010_LpbReturnEntry" element={<Pu010_LpbReturnEntry />} />
      </Route>
    </Routes>
  );
};

export default PurchasingRoutes;
