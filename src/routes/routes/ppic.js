import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import MainLayout from 'layouts/MainLayout';
import Default from 'pages/default/Default';

import Ppc002_bahanvsDO from 'pages/ppic/Ppc002_bahanvsDO';
import Ppc002_bhvsdov2 from 'pages/ppic/Ppc002_bhvsdov2';
import Ppc002_bhvsdov2Pet from 'pages/ppic/Ppc002_bhvsdov2Pet';
import Ppc002_bahanvsDOPet from 'pages/ppic/Ppc002_bahanvsDOPet';
import Ppc002_deliveryplan from 'pages/ppic/Ppc002_deliveryplan';
import Ppc002_capacityPlan from 'pages/ppic/Ppc002_capacityPlan';
import Ppc002_rencProduct from 'pages/ppic/Ppc002_rencProduct';
import Ppc002_proyeksiHomo from 'pages/ppic/Ppc002_proyeksiHomo';
import Ppc002_gantiProg from 'pages/ppic/Ppc002_gantiProg';
import Ppc002_mpsv2 from 'pages/ppic/Ppc002_mpsv2';
import Ppc003_PMMonitoring from 'pages/ppic/Ppc003_PMMonitoring';
import Ppc002_rencPotList from 'pages/ppic/ppc002_rencPotList-m';
import Ppc002_rencPotEntry from 'pages/ppic/ppc002_rencPotEntry-m';
import Ppc002_rencPotBEntry from 'pages/ppic/Ppc002_rencPotBEntry';
import Ppc002_rencPotSch from 'pages/ppic/ppc002_rencPotSch';
import Ppc002_inquiryWo from 'pages/ppic/Ppc002_inquiryWo';
import Ppc002_donMatEff from 'pages/ppic/Ppc002_donMatEff';

const PPICRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* <Route path="/" element={<Default />} /> */}
        <Route path="ppic/Ppc002_bahanvsDO" element={<Ppc002_bahanvsDO />} />
        <Route path="ppic/Ppc002_bhvsdov2" element={<Ppc002_bhvsdov2 />} />
        <Route path="ppic/Ppc002_bhvsdov2Pet" element={<Ppc002_bhvsdov2Pet />} />
        <Route path="ppic/Ppc002_bahanvsDOPet" element={<Ppc002_bahanvsDOPet />} />
        <Route path="ppic/Ppc002_deliveryplan" element={<Ppc002_deliveryplan />} />
        <Route path="ppic/Ppc002_rencProduct" element={<Ppc002_rencProduct />} />
        <Route path="ppic/Ppc002_proyeksiHomo" element={<Ppc002_proyeksiHomo />}></Route>
        <Route path="ppic/Ppc002_capacityPlan" element={<Ppc002_capacityPlan />}></Route>
        <Route path="ppic/Ppc002_capacityPlan/:kd" element={<Ppc002_capacityPlan />}></Route>
        <Route path="ppic/Ppc002_gantiProg" element={<Ppc002_gantiProg />} />
        <Route path="ppic/Ppc002_mpsv2" element={<Ppc002_mpsv2 />} />
        <Route path="ppic/Ppc003_PMMonitoring" element={<Ppc003_PMMonitoring />} />
        <Route path="ppic/Ppc002_inquiryWo" element={<Ppc002_inquiryWo />} />
        <Route path="ppic/ppc002_rencPotList" element={<Ppc002_rencPotList />} />
        <Route path="ppic/ppc002_rencPotList/:type" element={<Ppc002_rencPotList />} />
        <Route path="ppic/ppc002_rencPotEntry" element={<Ppc002_rencPotEntry />} />
        <Route path="ppic/ppc002_rencPotBEntry" element={<Ppc002_rencPotBEntry />} />
        <Route path="ppic/ppc002_rencPotEntry/:id" element={<Ppc002_rencPotEntry />} />
        <Route path="ppic/ppc002_rencPotSch" element={<Ppc002_rencPotSch />} />

        <Route path="ppic/Ppc002_donMatEff" element={<Ppc002_donMatEff />} />
      </Route>
    </Routes>
  );
};

export default PPICRoutes;
