import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainLayout from 'layouts/MainLayout';
import Default from 'pages/default/Default';

import Mkt200_CustomerProfile from 'pages/marketing/Mkt200_CustomerProfile';
import Mkt200_CustComplaintList from 'pages/marketing/Mkt200_CustComplaintList';
import Mkt200_CustComplaintEntry from 'pages/marketing/Mkt200_CustComplaintEntry';
import Mkt200_CustComplaintDashboard from 'pages/marketing/Mkt200_CustComplaintDashboard';
import Mkt201_SalesActivityList from 'pages/marketing/MKt201_SalesActivityList';
import Mkt201_SalesActivityEvent from 'pages/marketing/Mkt201_SalesActivityEvent';
import Mkt020_AlokasiSchedule from 'pages/marketing/Mkt020_AlokasiSchedule';
import Mkt020_AlokasiMarketing from 'pages/marketing/Mkt020_AlokasiMarketing';

const MaretingRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* <Route path="/" element={<Default />} /> */}
        <Route path="marketing/Mkt200_CustomerProfile" element={<Mkt200_CustomerProfile />} />
        <Route path="marketing/Mkt200_CustComplaintList" element={<Mkt200_CustComplaintList />} />
        <Route path="marketing/Mkt200_CustComplaintEntry/:key/:act" element={<Mkt200_CustComplaintEntry />} />
        <Route path="marketing/Mkt200_CustComplaintDashboard" element={<Mkt200_CustComplaintDashboard />} />
        <Route path="marketing/Mkt201_SalesActivityList" element={<Mkt201_SalesActivityList />}></Route>
        <Route path="marketing/Mkt201_SalesActivity/:ActType" element={<Mkt201_SalesActivityEvent />}></Route>
        <Route path="marketing/Mkt201_SalesActivity/:ActType/:Act" element={<Mkt201_SalesActivityEvent />}></Route>
        <Route path="marketing/Mkt020_AlokasiSchedule" element={<Mkt020_AlokasiSchedule />}></Route>
        <Route path="marketing/Mkt020_AlokasiMarketing" element={<Mkt020_AlokasiMarketing />}></Route>
      </Route>
    </Routes>
  );
};

export default MaretingRoutes;
