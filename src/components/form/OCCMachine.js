import React, { useState, useEffect, useRef } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { createUseGesture, dragAction, pinchAction } from '@use-gesture/react';
import styles from '../../../src/css/OCCBigMachine.css';
import OCCBigMachine from './OCCBigMachine';

const OCCMachine = ({ className, lgdata, Mch, Obj, SetObj, parentclick, lastXY, setlastXY }) => {
  const useGesture = createUseGesture([dragAction, pinchAction]);
  useEffect(() => {
    const handler = e => e.preventDefault();
    document.addEventListener('gesturestart', handler);
    document.addEventListener('gesturechange', handler);
    document.addEventListener('gestureend', handler);
    return () => {
      document.removeEventListener('gesturestart', handler);
      document.removeEventListener('gesturechange', handler);
      document.removeEventListener('gestureend', handler);
    };
  }, []);
  const ref = React.useRef(null);

  const [posXY, setPosXY] = useState({ x: lastXY ? lastXY.x : 0, y: lastXY ? lastXY.y : 0 });
  const [Refresh, setRefresh] = useState(false);
  const [OnDraging, setOnDraging] = useState(false);

  const [style, api] = useSpring(() => ({
    x: lastXY ? lastXY.x : 0,
    y: lastXY ? lastXY.y : 0,
    scale: 1,
    rotateZ: 0
  }));
  if (lastXY) {
    // if (lastXY.x == posXY.x && lastXY.y == posXY.y) {
    //   console.log('lastXY', lastXY, posXY);
    //   let x = posXY.x;
    //   let y = posXY.y;
    //   api.start({ x, y });
    // }
    if (lastXY) console.log('celeng', OnDraging, lastXY, posXY);
    // console.log('style', lastXY ? (lastXY.x == posXY.x ? lastXY.x : 0) : 0, lastXY ? (lastXY.y == posXY.y ? lastXY.y : 0) : 0);
  }

  useEffect(() => {
    if (Refresh) {
      if (lastXY) console.log('Refresh', OnDraging, lastXY, posXY);
      setRefresh(false);
    }
    return () => {};
  }, [Refresh]);
  useEffect(() => {
    let x = posXY.x;
    let y = posXY.y;
    if (lastXY) {
      console.log('UPDATED', OnDraging, lastXY, posXY);
    }
    api.start({ x, y });
    if (setlastXY) {
      // setRefresh(true);
      // setlastXY({ x: x, y: y });
    }
    return () => {};
  }, [posXY]);

  useGesture(
    {
      // onHover: ({ active, event }) => console.log('hover', event, active),
      // onMove: ({ event }) => console.log('move', event),
      onDrag: ({ last, pinching, cancel, offset: [x, y], ...rest }) => {
        setOnDraging(true);
        if (pinching) {
          return cancel();
        }
        if (last) {
          setOnDraging(false);
          setPosXY({ x: x, y: y });
        }
        api.start({ x, y });
      },
      onPinch: ({ origin: [ox, oy], first, movement: [ms], offset: [s, a], memo }) => {
        console.log('ref', ref);
        if (first) {
          // const { width, height, x, y } = ref.current!.getBoundingClientRect()
          const tx = ox - 0; //(x + width / 2)
          const ty = oy - 0; //(y + height / 2)
          memo = [style.x.get(), style.y.get(), tx, ty];
        }

        const x = memo[0] - (ms - 1) * memo[2];
        const y = memo[1] - (ms - 1) * memo[3];
        api.start({ scale: s, rotateZ: a, x, y });
        return memo;
      }
    },
    {
      target: ref,
      drag: { from: () => [style.x.get(), style.y.get()] },
      pinch: { scaleBounds: { min: 0.5, max: 2 }, rubberband: true }
    }
  );

  const handleClick = e => {
    switch (e.detail) {
      case 2:
        parentclick(e);
        break;
    }
  };

  return (
    <>
      <div className={`flex fill center ${className}`} style={{ position: 'absolute', transition: 'visibility 0.2s ease-in-out', zIndex: 99999, marginLeft: -250 }} onClick={handleClick}>
        <animated.div className={styles.occmachine} ref={ref} style={style}>
          <OCCBigMachine className={styles.occmachine} lgdata={lgdata} Height={25} Mch={Mch} Obj={Obj} SetObj={SetObj} isfull={true} Width={500}></OCCBigMachine>
        </animated.div>
      </div>
    </>
  );
};

export default OCCMachine;
