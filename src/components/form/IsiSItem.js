import React from 'react';
import Flex from 'components/common/Flex';

const IsiSItem = ({ txt, val, kd, cssval }) => {
  let warna = '';
  if (parseFloat(val) < 0) warna = 'text-danger';
  return (
    <div
      className="bg-transparent px-1 py-0 fs-10"
      style={
        kd == 'S'
          ? {
              borderBottom: '1px solid var(--falcon-input-focus-border-color)',
              borderTop: '1px solid var(--falcon-input-focus-border-color)',
              marginTop: '2px'
            }
          : kd == 'SM'
          ? { marginTop: '2px', color: '#d8e2ef' }
          : kd == 'SP'
          ? {
              marginTop: '10px',
              borderBottom: '1px solid var(--falcon-input-focus-border-color)'
            }
          : { borderBottom: '1px solid var(--falcon-input-focus-border-color)' }
      }
    >
      <Flex justifyContent="between">
        {kd == 'C' ? <p className="mb-0 ms-3">{txt}</p> : <p className="mb-0">{kd == 'SM' || kd == 'S' || kd == 'B' ? <b>{txt}</b> : txt}</p>}

        <p className={`mb-0 ${warna} ${cssval}`}>{kd == 'SM' || kd == 'S' || kd == 'B' ? <b>{val}</b> : val}</p>
      </Flex>
    </div>
  );
};
export default IsiSItem;
