import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import logo from 'assets/img/imes/logo.png';

const MesCW500Logo = ({ at, width, className, textClass, ...rest }) => {
  return (
    <Link to="/" className={classNames('text-decoration-none', { 'navbar-brand text-left': at === 'navbar-vertical' }, { 'navbar-brand text-left': at === 'navbar-top' })} {...rest}>
      <div
        className={classNames(
          'd-flex',
          {
            'align-items-center py-1 pb-1': at === 'navbar-vertical',
            'align-items-center': at === 'navbar-top',
            'flex-center fw-bolder fs-5 mb-4': at === 'auth'
          },
          className
        )}
      >
        <img className="me-2 py-2 pt-3 ms-3 " src={logo} alt="Logo" width={width} id="Dlogo" />{' '}
        <div className="d-flex flex-column align-items-start ps-2 py-2 pt-3">
          <h6 className="fw-bold text-primary fs-8 m-0">i-MES</h6>
          <small className="fw-light text-dark m-0 fs-11">Manufacturing Execution System</small>
        </div>
        {/*width={width}*/}
        {/* <span className={classNames('font-sans-serif', textClass)}>&nbsp;</span> */}
      </div>
    </Link>
  );
};

MesCW500Logo.propTypes = {
  at: PropTypes.oneOf(['navbar-vertical', 'navbar-top', 'auth']),
  width: PropTypes.number,
  className: PropTypes.string,
  textClass: PropTypes.string
};
MesCW500Logo.defaultProps = { at: 'auth', width: '100%' };

export default MesCW500Logo;
