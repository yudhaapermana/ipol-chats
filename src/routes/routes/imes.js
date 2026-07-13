import MainLayout from 'layouts/MainLayout';
import Ims001_RackBoard from 'pages/imes/Ims001_RackBoard';
import Ims004_PDFList from 'pages/imes/Ims004_PDFList';
import Ims004_PDFDetail from 'pages/imes/Ims004_PDFDetail';
import Ims003_logSheetCW500 from 'pages/imes/Ims003_logSheetCW500';
import Ims003_logDashCW500 from 'pages/imes/Ims003_logDashCW500';
import Ims003_RawTextPage from 'pages/imes/Ims003_RawTextPage';
import Ims003_LoginScan from 'pages/imes/Ims003_LoginScan';
import Ims003_confirmNotif from 'pages/imes/Ims003_confirmNotif';

import { Route, Routes } from 'react-router-dom';
import MesCW500Layout from 'layouts/MesCW500Layout';
const ImesRoutes = () => {
  return (
    <Routes>
      <Route path="imes/view-txt" element={<Ims003_RawTextPage />} />
      <Route element={<MainLayout />}>
        <Route path="imes/Ims001_RackBoard" element={<Ims001_RackBoard />} />
        <Route path="imes/Ims004_PDFList" element={<Ims004_PDFList />} />
        <Route path="imes/Ims004_PDFDetail" element={<Ims004_PDFDetail />} />
        <Route path="imes/Ims003_LoginScan" element={<Ims003_LoginScan />} />
        <Route path="imes/Ims003_confirmNotif" element={<Ims003_confirmNotif />} />
      </Route>
      <Route element={<MesCW500Layout />}>
        <Route path="imes/Ims003_logSheetCW500" element={<Ims003_logSheetCW500 />} />
        <Route path="imes/Ims003_logDashCW500" element={<Ims003_logDashCW500 />} />
      </Route>
    </Routes>
  );
};

export default ImesRoutes;
