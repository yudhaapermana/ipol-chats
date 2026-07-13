import React, { useContext } from 'react';
import SvgIcon from './SvgIcon'; // Menggunakan sistem ikon Figma Anda
import { useAppContext } from 'Main';
import AppContext from 'context/Context';

const ThemeToggle = () => {
  const {
    config: { isDark, isRTL },
    setConfig
  } = useContext(AppContext);
  
  const {
    config: { theme },
    changeTheme
  } = useAppContext(); 

  return (
    <div 
      className={`theme-switch-container d-flex align-items-center p-2 cursor-pointer position-relative rounded-pill ${isDark ? 'active-dark' : 'active-light'}`}
      onClick={() => changeTheme(isDark ? 'light' : 'dark')}
    >
      <div className="switch-circle shadow-sm d-flex align-items-center justify-content-center rounded-circle bg-light-subtle">
        <SvgIcon 
          name={isDark ? 'moon' : 'sun'}
          size={12}           
        />
      </div>
    </div>
  );
};

export default ThemeToggle;