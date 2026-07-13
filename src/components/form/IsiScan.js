import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { useEffect } from 'react';

const qrcodeRegionId = 'scancode';

// Creates the configuration object for Html5QrcodeScanner.
const createConfig = props => {
  let config = {};
  if (props.fps) {
    config.fps = props.fps;
  }
  if (props.qrbox) {
    config.qrbox = props.qrbox;
  }
  if (props.aspectRatio) {
    config.aspectRatio = props.aspectRatio;
  }
  if (props.disableFlip !== undefined) {
    config.disableFlip = props.disableFlip;
  }
  return config;
};

const IsiScan = props => {
  let html5QrCode;
  useEffect(() => {
    // // when component mounts

    const config = createConfig(props);
    const verbose = props.verbose === true;
    // // Suceess callback is required.
    // if (!(props.qrCodeSuccessCallback)) {
    //     throw "qrCodeSuccessCallback is required callback.";
    // }
    // const html5QrcodeScanner = new Html5QrcodeScanner(qrcodeRegionId, config, verbose);
    // html5QrcodeScanner.render(props.qrCodeSuccessCallback, props.qrCodeErrorCallback);

    // // cleanup function when component will unmount
    // return () => {
    //     html5QrcodeScanner.clear().catch(error => {
    //         console.error("Failed to clear html5QrcodeScanner. ", error);
    //     });
    // };
    if (!html5QrCode?.getState()) {
      console.log('QRCodeScanner: Initializing scanner');
      html5QrCode = new Html5Qrcode(qrcodeRegionId, scnCfg);

      const scnCfg = {
        formatSupport: [
          Html5QrcodeSupportedFormats.QR_CODE,
          Html5QrcodeSupportedFormats.CODE_39,
          Html5QrcodeSupportedFormats.CODE_93,
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.DATA_MATRIX,
          Html5QrcodeSupportedFormats.ITF
        ]
      };

      if (props.act) {
        Html5Qrcode.getCameras()
          .then(devices => {
            /**
             * devices would be an array of objects of type:
             * { id: "id", label: "label" }
             */
            if (devices && devices.length) {
              var cameraId = devices[0].id;
              html5QrCode
                .start({ facingMode: 'environment' }, config, (t, r) => props?.qrCodeSuccessCallback(t, r, html5QrCode), props.qrCodeErrorCallback)
                .catch(err => {
                  // Start failed, handle it.
                });

              // set qr obj in props if any
              if (typeof props.setQr === 'function') {
                props.setQr(html5QrCode);
              }
            }
          })
          .catch(err => {
            // handle err
          });
      }
    } else {
      if (html5QrCode.isScanning) {
        html5QrCode.stop();
        html5QrCode.clear();
      }
    }

    return () => {
      // Anything in here is fired on component unmount.
    };
  }, [props.act]);

  return <div id={qrcodeRegionId} style={props.dvstyle} />;
};

export default IsiScan;
