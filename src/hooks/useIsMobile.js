import { useEffect, useState } from 'react';
import * as detect from 'react-device-detect';

const useIsMobile = (breakpoint = 768) => {
  const checkMinWidth = () => {
    let checkMinWidth = window.innerWidth;
    if (window.innerHeight <= checkMinWidth) checkMinWidth = window.innerHeight;
    return checkMinWidth;
  };
  const checkRotate = () => {
    let minHeightorWidth = checkMinWidth();
    return minHeightorWidth != window.innerWidth;
  };
  const checkForDevice = () => {
    let minHeightorWidth = window.innerWidth;
    // console.log(detect);
    return minHeightorWidth <= breakpoint;
    // return detect.isMobile;
  };

  const [isMobile, setIsMobile] = useState(checkForDevice());
  const [minWidth, setMinWidth] = useState(checkMinWidth());
  const [isRotate, setIsRotate] = useState(checkRotate());

  useEffect(() => {
    const handlePageResized = () => {
      setIsMobile(checkForDevice());
      setMinWidth(checkMinWidth());
      setIsRotate(checkRotate());
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handlePageResized);
      window.addEventListener('orientationchange', handlePageResized);
      window.addEventListener('load', handlePageResized);
      window.addEventListener('reload', handlePageResized);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handlePageResized);
        window.removeEventListener('orientationchange', handlePageResized);
        window.removeEventListener('load', handlePageResized);
        window.removeEventListener('reload', handlePageResized);
      }
    };
  }, []);

  return {
    isMobile,
    minWidth,
    isRotate
  };
};

export default useIsMobile;
