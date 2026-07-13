import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Lightbox from 'react-18-image-lightbox';
import 'react-18-image-lightbox/style.css';
import { shoppingCartItems } from 'data/dashboard/ecom';

const IsiShowImg = ({ image, Show, handleHide }) => {
  //const [isOpen, setIsOpen] = useState(Show);
  return (
    <>
      {Show && (
        <Lightbox
          mainSrc={image}
          onCloseRequest={() => handleHide}
          reactModalStyle={{ overlay: { zIndex: 999999 } }}
          onImageLoad={() => {
            window.dispatchEvent(new Event('resize'));
          }}
        />
      )}
    </>
  );
};
IsiShowImg.propTypes = {
  image: PropTypes.string.isRequired,
  Show: PropTypes.node.isRequired,
  handleHide: PropTypes.func.isRequired
};
export default IsiShowImg;
