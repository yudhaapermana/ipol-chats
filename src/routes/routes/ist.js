import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from 'layouts/MainLayout';
import Default from 'pages/default/Default';

import It002_ServerAccessLog from 'pages/ist/It002_ServerAccessLog';

const ISTRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* <Route path="/" element={<Default />} /> */}
        <Route path="ist/ServerAccessLog" element={<It002_ServerAccessLog />} />
      </Route>
    </Routes>
  );
};

export default ISTRoutes;
