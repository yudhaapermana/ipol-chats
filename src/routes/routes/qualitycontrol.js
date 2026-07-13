import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from 'layouts/MainLayout';

import Qc018_TrendDataQC from 'pages/qualitycontrol/Qc018_TrendDataQC';
import Qc019_ChecklistCutsheetList from 'pages/qualitycontrol/Qc019_ChecklistCutsheetList';
import Qc019_ChecklistCutsheetDetail from 'pages/qualitycontrol/Qc019_ChecklistCutsheetDetail';
import Qc019_ChecklistCutsheetListSN from 'pages/qualitycontrol/Qc019_ChecklistCutsheetListSN';
import Qc018_MxPlanList from 'pages/qualitycontrol/Qc018_MxPlanList';
import Qc018_MxPlanEntry from 'pages/qualitycontrol/Qc018_MxPlanEntry';
import Qc018_mxuselist from 'pages/qualitycontrol/Qc018_MxUseList';
import Qc018_MxUseEntry from 'pages/qualitycontrol/Qc018_MxUseEntry';
import Qc018_SlTranList from 'pages/qualitycontrol/Qc018_SlTranList';
import Qc018_SlTranListEntry from 'pages/qualitycontrol/Qc018_SlTranListEntry';
import Qc018_MXMonitorTrolley from 'pages/qualitycontrol/Qc018_MXMonitorTrolley';
import Qc018_MxRtnList from 'pages/qualitycontrol/Qc018_MxRtnList';
import Qc018_MxRtnEntry from 'pages/qualitycontrol/Qc018_MxRtnEntry';

const QualityControlRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* <Route path="/" element={<Default />} />  */}
        <Route path="qualitycontrol/Qc018_TrendDataQC" element={<Qc018_TrendDataQC />} />
        <Route path="qualitycontrol/Qc019_ChecklistCutsheetList/:sqn/:act" element={<Qc019_ChecklistCutsheetList />} />
        <Route path="qualitycontrol/Qc019_ChecklistCutsheetList/:act" element={<Qc019_ChecklistCutsheetList />} />
        <Route path="qualitycontrol/Qc019_ChecklistCutsheetDetail/:key/:act" element={<Qc019_ChecklistCutsheetDetail />} />
        <Route path="qualitycontrol/Qc019_ChecklistCutsheetListSN/:act" element={<Qc019_ChecklistCutsheetListSN />} />
        <Route path="qualitycontrol/Qc018_MxPlanList" element={<Qc018_MxPlanList />} />
        <Route path="qualitycontrol/Qc018_MxPlanEntry/:id" element={<Qc018_MxPlanEntry />} />
        <Route path="qualitycontrol/Qc018_MxPlanEntry" element={<Qc018_MxPlanEntry />} />
        <Route path="qualitycontrol/Qc018_mxuselist" element={<Qc018_mxuselist />} />
        <Route path="qualitycontrol/Qc018_MxUseEntry" element={<Qc018_MxUseEntry />} />
        <Route path="qualitycontrol/Qc018_MxUseEntry/:id" element={<Qc018_MxUseEntry />} />
        <Route path="qualitycontrol/Qc018_SlTranList" element={<Qc018_SlTranList />} />
        <Route path="qualitycontrol/Qc018_SlTranListEntry" element={<Qc018_SlTranListEntry />} />
        <Route path="qualitycontrol/Qc018_MXMonitorTrolley" element={<Qc018_MXMonitorTrolley />} />
        <Route path="qualitycontrol/Qc018_MXMonitorTrolley/:action" element={<Qc018_MXMonitorTrolley />} />
        <Route path="qualitycontrol/Qc018_MxRtnList" element={<Qc018_MxRtnList />} />
        <Route path="qualitycontrol/Qc018_MxRtnEntry" element={<Qc018_MxRtnEntry />} />
        <Route path="qualitycontrol/Qc018_MxRtnEntry/:id" element={<Qc018_MxRtnEntry />} />

      </Route>
    </Routes>
  );
};

export default QualityControlRoutes;
