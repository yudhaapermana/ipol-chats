import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Flex from 'components/common/Flex';

const getIcon = type => {
  const icon = ['far'];
  if (
    type.includes('png') ||
    type.includes('jpg') ||
    type.includes('jpeg') ||
    type.includes('BMP')
  ) {
    icon.push('file-image');
  }
  if (type.includes('video')) {
    icon.push('file-video');
  }
  if (type.includes('audio')) {
    icon.push('file-audio');
  }
  if (type.includes('zip')) {
    icon.push('file-archive');
  }
  if (type.includes('pdf')) {
    icon.push('file-pdf');
  }
  if (
    type.includes('html') ||
    type.includes('css') ||
    type.includes('json') ||
    type.includes('javascript')
  ) {
    icon.push('file-code');
  }
  if (icon.length === 1) {
    icon.push('file');
  }
  return icon;
};

const getName = name => {
  const [fileName, extension] = name.split('.');
  return `${fileName.slice(0, 24)}.${extension}`;
};

const IsiAttach = ({
  id,
  name,
  handleDelete,
  type,
  path,
  folder,
  url,
  mode,
  handleShow,
  col
}) => (
  <div className={`col-6 col-lg-${col ?? '3'}`}>
    <Flex
      alignItems="center"
      className="border px-2 rounded-3 bg-white dark__bg-1000 my-1 fs-10"
    >
      <FontAwesomeIcon icon={getIcon(type)} className="fs-8" />
      <span className="mx-2 flex-1">
        {type == '.png' ||
        type == '.bmp' ||
        type == '.jpg' ||
        type == '.gif' ||
        type == '.jpeg' ? (
          <a href="#" onClick={() => handleShow(url)}>
            {getName(name)}
          </a>
        ) : (
          <a href={url} target="_blank">
            {getName(name)}
          </a>
        )}
      </span>
      <span
        className={`p-1 ml-auto cursor-pointer text-danger ${
          mode == 'L' ? 'invisible' : ''
        }`}
        id={`${id}`}
        onClick={() => handleDelete(id, name, path, folder)}
      >
        <FontAwesomeIcon icon="times" />
      </span>
    </Flex>
  </div>
);

IsiAttach.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  name: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  handleDelete: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired
};

export default IsiAttach;
