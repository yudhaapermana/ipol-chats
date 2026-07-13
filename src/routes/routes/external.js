import MainLayout from 'layouts/MainLayout';
import Ext001_sparepartMapping from 'pages/external/Ext001_sparepartMapping';
import { Route, Routes } from 'react-router-dom';

const ExternalRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="external/Ext001_sparepartMapping" element={<Ext001_sparepartMapping />} />
      </Route>
    </Routes>
  );
};

export default ExternalRoutes;
