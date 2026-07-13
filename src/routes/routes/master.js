import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from 'layouts/MainLayout';
//import Default from 'pages/default/Default';

import Mst001_masterReject from 'pages/master/mst001_masterReject';
import Mst001_MasterHoliday from 'pages/master/Mst001_MasterHoliday';
import Mst061_formPAIList from 'pages/master/mst061_formPAIList';
import Mst061_formPAIEntry from 'pages/master/mst061_formPAIEntry';
import Mst001_FormITSREntry from 'pages/master/mst001_formITSREntry';
import Mst001_FormITSRList from 'pages/master/mst001_formITSRList';
import Mst061_StdAcsMenuList from 'pages/master/mst061_StdAcsMenuList';
import Mst061_StdAcsMenuListHeader from 'pages/master/mst061_StdAcsMenuListHeader';
import Mst061_StdAcsMenuEntry from 'pages/master/mst061_StdAcsMenuEntry';
import Mst062_MaintenanceWa from 'pages/master/Mst062_MaintenanceWa';
import Mst061_FormITOAList from 'pages/master/mst061_formITOAList';
import Mst061_formITOAEntry from 'pages/master/mst061_formITOAEntry';
import Mst061_formITOAEntryDetail from 'pages/master/mst061_formITOAEntryDetail';
import Mst007_MasterBPPBLimit from 'pages/master/mst007_MasterBPPBLimit';

const MasterRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="master/mst001_masterReject" element={<Mst001_masterReject />} />
        <Route path="master/mst001_masterHoliday" element={<Mst001_MasterHoliday />} />
        <Route path="master/mst061_formPAIList/:act" element={<Mst061_formPAIList />} />
        <Route path="master/mst061_formPAIEntry/:key/:act" element={<Mst061_formPAIEntry />} />
        <Route path="master/mst001_FormITSRList" element={<Mst001_FormITSRList />} />
        <Route path="master/mst001_FormITSREntry/:key/:act" element={<Mst001_FormITSREntry />} />
        <Route path="master/mst061_StdAcsMenuList/:act" element={<Mst061_StdAcsMenuList />} />
        <Route path="master/mst061_StdAcsMenuListHeader/:act" element={<Mst061_StdAcsMenuListHeader />} />
        <Route path="master/mst061_StdAcsMenuEntry/:key/:act" element={<Mst061_StdAcsMenuEntry />} />
        <Route path="master/Mst062_MaintenanceWa" element={<Mst062_MaintenanceWa />} />
        <Route path="master/mst061_formITOAList/:act" element={<Mst061_FormITOAList />} />
        <Route path="master/mst061_formITOAEntry/:key/:act" element={<Mst061_formITOAEntry />} />
        <Route path="master/mst061_formITOAEntryDetail/:key/:kdus/:act" element={<Mst061_formITOAEntryDetail />} />
        <Route path="master/mst007_MasterBPPBLimit" element={<Mst007_MasterBPPBLimit />} />

      </Route>
    </Routes>
  );
};

export default MasterRoutes;
