import { faCamera, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';

const createConfig = props => {
  let facing = props.facing; //kamera yang akan digunakan (depan / belakang)
  if (!facing) {
    facing = 'user'; // user = kamera depan
  }

  return {
    height: props.height,
    width: props.width,
    aspectRatio: props.ratio,
    facingMode:
      facing == 'user'
        ? 'user'
        : {
            exact: 'environment' // environment = kamera belakang
          }
  };
};

const IsiCam = props => {
  const webcamRef = useRef(null);
  const conf = createConfig(props);

  const capture = useCallback(() => {
    if (webcamRef.current) {
      let src = webcamRef.current.getScreenshot({
        width: props.width,
        height: props.height
      });
      //   setImg(src);
      props.handleCapture(src);
    } /*  else {
      setAct(true);
    } */
  }, [webcamRef]);

  return (
    <>
      {props.act && (
        <div className="position-relative h-100">
          {/* {img && <img src={img} />} */}
          <Webcam
            //   className="position-absolute top-0 start-0 end-0"
            ref={webcamRef}
            height={props.height}
            width={props.width}
            videoConstraints={conf}
            screenshotFormat={props.format ?? 'image/jpeg'}
            mirrored={props.mirror}
            screenshotQuality={props.quality ?? 0.7}
          />
          <button
            className="btn btn-link btn-lg pt-1 pb-0 ps-2 pe-1 position-absolute bottom-0 start-50 translate-middle"
            onClick={capture}
          >
            <div className="border border-info border-2 rounded-circle p-2 d-flex align-items-center justify-content-center">
              <FontAwesomeIcon
                icon={faCamera}
                className={`text-info fs-${props.btnSize ?? 5}`}
              />
            </div>
          </button>
        </div>
      )}
    </>
  );
};

export default IsiCam;
