import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from 'layouts/MainLayout';
import Default from 'pages/default/Default';

import Whm390_Loc_JB from 'pages/opname/whm390_Loc_JB';

const OpnameRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* <Route path="/" element={<Default />} /> */}
        <Route path="opname/whm390_Loc_JB" element={<Whm390_Loc_JB />} />
      </Route>
    </Routes>
  );
};

export default OpnameRoutes;
