import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from 'layouts/MainLayout';
import Default from 'pages/default/Default';

import Fi012_DispossalAssetList from 'pages/finance/fi012_DispossalAssetList';
import Fi012_DispossalAssetEntry from 'pages/finance/fi012_DispossalAssetEntry';
import Fi008_InvoicePartList from 'pages/finance/Fi008_InvoicePartList';
import Fi008_InvoicePartEntry from 'pages/finance/Fi008_InvoicePartEntry';

const FinanceRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          path="finance/fi012_DispossalAssetList/:act"
          element={<Fi012_DispossalAssetList />}
        />
        <Route
          path="finance/fi012_DispossalAssetEntry/:key/:act"
          element={<Fi012_DispossalAssetEntry />}
        />
        <Route path="finance/Fi008_InvoicePartList" element={<Fi008_InvoicePartList />} />
        <Route path="finance/Fi008_InvoicePartList/:key" element={<Fi008_InvoicePartList />} />
        <Route
          path="finance/Fi008_InvoicePartEntry/:key"
          element={<Fi008_InvoicePartEntry />}
        />

      </Route>
    </Routes>
  );
};

export default FinanceRoutes;
