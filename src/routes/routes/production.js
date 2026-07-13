import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from 'layouts/MainLayout';
import Default from 'pages/default/Default';

import Prd001_LKHindex from 'pages/production/Prd001_LKHindex';
import Prd001_LKHform from 'pages/production/Prd001_LKHform';
import Pd620_QAInstructionList from 'pages/production/Pd620_QAInstructionList';
import Pd620_QAInstructionEntry from 'pages/production/Pd620_QAInstructionEntry';


const ProductionRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* <Route path="/" element={<Default />} /> */}
        <Route path="production/Prd001_LKHindex" element={<Prd001_LKHindex />} />
        <Route path="production/Prd001_LKHindex/:key" element={<Prd001_LKHindex />} />
        <Route path="production/Prd001_LKHform/:key/:id/:action" element={<Prd001_LKHform />} />
        <Route path="production/Prd001_LKHform/:key/:id/:action/:keyid" element={<Prd001_LKHform />} />
        <Route path="production/Pd620_QAInstructionList" element={<Pd620_QAInstructionList />} />
        <Route path="production/Pd620_QAInstructionEntry/:action/:id" element={<Pd620_QAInstructionEntry />} />

      </Route>
    </Routes>
  );
};

export default ProductionRoutes;
