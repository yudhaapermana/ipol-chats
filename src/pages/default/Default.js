// import React, { useState, useEffect } from 'react';
import bg from 'assets/img/logo/Back.JPG';

{
  /* eslint-disable */
}
{
  /*import FalconComponentCard from 'components/common/FalconComponentCard';*/
}

const Default = () => {
  //const URL = "http://localhost:55398//api/Whs201_genPSfromPO"
  //const URL = process.env.REACT_APP_URL_API_LOCAL;
  const URL = process.env.REACT_APP_URL_API;

  return (
    <>
      {/*<div class="container-fluid homepage-bgimage"></div>*/}

      <img className="me-0" src={bg} alt="Logo" width={'100%'} />
    </>
  );
};

export default Default;
