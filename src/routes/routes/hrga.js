import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from 'layouts/MainLayout';
//import Default from 'pages/default/Default';

import Hrd015_EmployeeEngagementSurvey from 'pages/hrga/Hrd015_EmployeeEngagementSurvey';
import Hrd013_EcardAccess from 'pages/hrga/Hrd013_EcardAccess';
import Hrd013_ScanEcard from 'pages/hrga/Hrd013_ScanEcard';
import Hrd013_Visitor from 'pages/hrga/Hrd013_visitor';
import Hrd013_guestinvitation from 'pages/hrga/Hrd013_guestinvitation';
import Hrd013_guestInvitationEntry from 'pages/hrga/Hrd013_guestInvitationEntry';
import Hrd013_guestinvitationAct from 'pages/hrga/Hrd013_guestinvitationAct';
import Hrd013_EmployeeAccessEntry from 'pages/hrga/Hrd013_employeeAccessEntry';
import Hrd013_EcardInquiry from 'pages/hrga/Hrd013_ecardInquiry';
import Hrd014_formExitClearanceList from 'pages/hrga/Hrd014_formExitClearanceList';
import Hrd014_formExitClearanceEntry from 'pages/hrga/Hrd014_formExitClearanceEntry';

const HRGARoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* <Route path="/" element={<Default />} /> */}
        <Route
          path="hrga/hrd013_EcardAccess"
          element={<Hrd013_EcardAccess />}
        />
        <Route path="hrga/hrd013_ScanEcard" element={<Hrd013_ScanEcard />} />
        <Route path="hrga/hrd013_visitor/:id" element={<Hrd013_Visitor />} />
        <Route
          path="hrga/Hrd015_EmployeeEngagementSurvey"
          element={<Hrd015_EmployeeEngagementSurvey />}
        />
        <Route
          path="hrga/hrd013_guestinvitation"
          element={<Hrd013_guestinvitation />}
        />
        <Route
          path="hrga/Hrd013_guestInvitationEntry/:id"
          element={<Hrd013_guestInvitationEntry />}
        />
        <Route
          path="hrga/Hrd013_guestInvitationAct/:id"
          element={<Hrd013_guestinvitationAct />}
        />
        <Route
          path="hrga/hrd013_employeeAccessEntry"
          element={<Hrd013_EmployeeAccessEntry />}
        />
        <Route
          path="hrga/hrd013_ecardInquiry"
          element={<Hrd013_EcardInquiry />}
        />
        <Route
          path="hrga/hrd014_formExitClearanceList"
          element={<Hrd014_formExitClearanceList />}
        />
        <Route
          path="hrga/hrd014_formExitClearanceEntry/:key/:act"
          element={<Hrd014_formExitClearanceEntry />}
        />
      </Route>
    </Routes>
  );
};

export default HRGARoutes;
