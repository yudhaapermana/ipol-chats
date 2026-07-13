import React from 'react';
import icons from './IconLibrary';

const SvgIcon = ({ name, size = 20, className = '', onClick, ...props }) => {
  const IconComponent = icons[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" tidak ditemukan di IconLibrary`);
    return null;
  }

  return (
    <IconComponent 
      width={size} 
      height={size}       
      className={`svg-icon ${className}`}
      onClick={onClick}           
      {...props}
    />
  );
};

export default SvgIcon;