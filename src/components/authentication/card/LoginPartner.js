import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import LoginForm from 'components/authentication/LoginForm';
import LoginFormPartner from 'components/authentication/LoginFormPartner';
import AuthCardLayout from 'layouts/AuthCardLayout';

const LoginPartner = () => {
  const lgdata = JSON.parse(localStorage.getItem('userData'));
  const location = useLocation();

  // Cek apakah state 'from' berisi rute logsheet
  const isFromLogsheet = location.state?.from === 'imes/ims003_logSheetCW500';

  return (
    <AuthCardLayout
      leftSideContent={
        <p className="text-white">
          &nbsp;
          {/* Don't have an account?
          <br />
          <Link
            className="text-white text-decoration-underline"
            to="/authentication/card/register"
          >
            Get started!
          </Link> */}
        </p>
      }
    >
      <h3>Login Partner</h3>
      {isFromLogsheet && lgdata && <LoginFormPartner layout="card" hasLabel />}
    </AuthCardLayout>
  );
};

export default LoginPartner;
