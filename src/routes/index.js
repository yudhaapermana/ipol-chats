import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AuthSimpleLayout from '../layouts/AuthSimpleLayout';
import MainLayout from '../layouts/MainLayout';
import ErrorLayout from '../layouts/ErrorLayout';
import 'assets/js/react-bootstrap-datetimepicker/css/bootstrap-datetimepicker.css';

import WizardAuth from 'components/authentication/wizard/WizardAuth';
import Landing from 'components/pages/landing/Landing';

// import Error404 from 'components/errors/Error404';
// import Error500 from 'components/errors/Error500';

import SimpleLogin from 'components/authentication/simple/Login';
import SimpleLogout from 'components/authentication/simple/Logout';
import SimpleRegistration from 'components/authentication/simple/Registration';
import SimpleForgetPassword from 'components/authentication/simple/ForgetPassword';
import SimplePasswordReset from 'components/authentication/simple/PasswordReset';
import SimpleConfirmMail from 'components/authentication/simple/ConfirmMail';
import SimpleLockScreen from 'components/authentication/simple/LockScreen';

import Logout from 'components/authentication/card/Logout';
import CardRegistration from 'components/authentication/card/Registration';

import CardConfirmMail from 'components/authentication/card/ConfirmMail';
import CardPasswordReset from 'components/authentication/card/PasswordReset';
import CardLockScreen from 'components/authentication/card/LockScreen';

import SplitLogin from 'components/authentication/split/Login';
import SplitLogout from 'components/authentication/split/Logout';
import SplitRegistration from 'components/authentication/split/Registration';
import SplitForgetPassword from 'components/authentication/split/ForgetPassword';
import SplitPasswordReset from 'components/authentication/split/PasswordReset';
import SplitConfirmMail from 'components/authentication/split/ConfirmMail';
import SplitLockScreen from 'components/authentication/split/LockScreen';

import Wizard from 'components/wizard/Wizard';

import Default from 'pages/default/Default';
import Login from 'pages/login/Login';
import LoginWithKey from 'pages/login/LoginWithKey';
import ShowMenuERP from 'pages/login/ShowMenuERP';
import Logoff from 'pages/login/logoff';
import CardLogin from 'components/authentication/card/Login';
import LoginPartner from 'components/authentication/card/LoginPartner';

// import MaretingRoutes from './routes/marketing';
// import WarehouseRoutes from './routes/warehouse';
// import PPICRoutes from './routes/ppic';
// import HRGARoutes from './routes/hrga';
// import MasterRoutes from './routes/master';
// import OpnameRoutes from './routes/opname';
// import ProductionRoutes from './routes/production';
// import ISTRoutes from './routes/ist';
// import PurchasingRoutes from './routes/purchasing';
// import QualityControlRoutes from './routes/qualitycontrol';
// import EngineeringRoutes from './routes/engineering';
// import ImesRoutes from './routes/imes';
// import FinanceRoutes from './routes/finance';
// import ExternalRoutes from './routes/external';

// import Erplayout from 'layouts/ErpLayout';
import Home from 'pages/login/Home';
import Chat from 'pages/login/Chat';
// import Example from 'pages/login/Example';
// import LoginNew from 'pages/login/LoginNew';
import SessionExpired from 'pages/login/SessionExpired';
import Error404 from 'pages/login/Error404';
import Error500 from 'pages/login/Error500';
import PopupBlocker from 'pages/login/PopupBlocker';
import IframeViewer from 'pages/login/IframeViewer';
import IsiLogin from '../pages/login/IsiLogin';
import RefreshToken from '../pages/login/RefreshToken';

const FalconRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="landing" element={<Landing />} />
        {/* <Route element={<ErrorLayout />}>
          <Route path="errors/404" element={<Error404 />} />
          <Route path="errors/500" element={<Error500 />} />
        </Route> */}

        <Route path="login/sessionExpired" element={<SessionExpired />} />
        <Route path="login/error404" element={<Error404 />} />
        <Route path="login/error500" element={<Error500 />} />
        <Route path="login/popup-blocker" element={<PopupBlocker />} />

        {/*- ------------- simple ---------------------------  */}
        <Route element={<AuthSimpleLayout />}>
          {/*Login*/}
          {/* eslint-disable */}

          {/* <Route path="login/Login" element={<Login />} /> */}
          <Route path="login/LoginWithKey/:ukeys/:uip" element={<LoginWithKey />} />
          <Route path="login/ShowMenuErp/:key/:ip/:mnid" element={<ShowMenuERP />} />
          <Route path="login/logoff" element={<Logoff />} />

          <Route path="login/ShowMenuErp/:key/:ip/:mnid/:kd" element={<ShowMenuERP />} />
          <Route path="authentication/simple/login" element={<SimpleLogin />} />
          <Route path="authentication/simple/register" element={<SimpleRegistration />} />
          <Route path="authentication/simple/logout" element={<SimpleLogout />} />
          <Route path="authentication/simple/forgot-password" element={<SimpleForgetPassword />} />
          <Route path="authentication/simple/reset-password" element={<SimplePasswordReset />} />
          <Route path="authentication/simple/confirm-mail" element={<SimpleConfirmMail />} />
          <Route path="authentication/simple/lock-screen" element={<SimpleLockScreen />} />
        </Route>

        {/*- ------------- Card ---------------------------  */}
        <Route path="authentication/card/login" element={<CardLogin />} />
        <Route path="authentication/card/register" element={<CardRegistration />} />
        <Route path="authentication/card/logout" element={<Logout />} />
        <Route path="authentication/card/login/partner" element={<LoginPartner />} />

        <Route path="authentication/card/reset-password" element={<CardPasswordReset />} />
        <Route path="authentication/card/confirm-mail" element={<CardConfirmMail />} />
        <Route path="authentication/card/lock-screen" element={<CardLockScreen />} />

        {/*- ------------- Split ---------------------------  */}

        <Route path="authentication/split/login" element={<SplitLogin />} />
        <Route path="authentication/split/logout" element={<SplitLogout />} />
        <Route path="authentication/split/register" element={<SplitRegistration />} />
        <Route path="authentication/split/forgot-password" element={<SplitForgetPassword />} />
        <Route path="authentication/split/reset-password" element={<SplitPasswordReset />} />
        <Route path="authentication/split/confirm-mail" element={<SplitConfirmMail />} />
        <Route path="authentication/split/lock-screen" element={<SplitLockScreen />} />

        <Route element={<WizardAuth />}>
          <Route path="authentication/wizard" element={<Wizard validation={true} />} />
        </Route>

        {/*- ------------- New Version ---------------------------  */}
        <Route path="login/RefreshToken" element={<RefreshToken />} />
        <Route path="login/IsiLogin" element={<IsiLogin />} />
        <Route path="/" element={<Navigate to="/login/IsiLogin" replace />} />
        <Route element={<MainLayout />}>
          <Route path="/chat" element={<Chat />} />
          {/* <Route path="/" element={<Home />} /> */}
          {/* <Route path="home" element={<Home />} /> */}
          {/* <Route path="example" element={<Example />} /> */}
          <Route path="login/iframe-viewer/:Url" element={<IframeViewer />} />
        </Route>
      </Routes>

      {/* <HRGARoutes />
      <ISTRoutes />
      <MaretingRoutes />
      <MasterRoutes />
      <OpnameRoutes />
      <PPICRoutes />
      <ProductionRoutes />
      <WarehouseRoutes />
      <PurchasingRoutes />
      <QualityControlRoutes />
      <EngineeringRoutes />
      <ImesRoutes />
      <FinanceRoutes />
      <ExternalRoutes /> */}
    </>
  );
};

export default FalconRoutes;
