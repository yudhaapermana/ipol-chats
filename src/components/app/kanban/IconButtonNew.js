import React from 'react';
import { Button } from 'react-bootstrap';
import SvgIcon from './SvgIcon';

const IconButtonNew = ({ 
  iconName, 
  iconSize = 16, 
  iconPosition = 'left', 
  children, 
  onClick, 
  variant = 'primary', 
  className,
  title = '',  
  ...props 
}) => {
  return (
    <Button 
      variant={variant} 
      onClick={onClick}
      title={title}       
      className={`d-flex align-items-center justify-content-center gap-2 p-2 px-3 h-fit rounded fw-normal font-sans-serif ${className}`}
      {...props}
    >      
      {iconPosition === 'left' && iconName && (
        <SvgIcon name={iconName} size={iconSize} />
      )}
      
      {children && (
        <span className="d-none d-xxl-inline fs-10">
          {children}
        </span>
      )}
      
      {iconPosition === 'right' && iconName && (
        <SvgIcon name={iconName} size={iconSize} />
      )}
    </Button>
  );
};

export default IconButtonNew;