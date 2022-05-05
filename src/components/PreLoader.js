import React from 'react';
import PropTypes from 'prop-types';

const PreLoader =  ({isLoading = false, loadingMsg = ''}) => {
  return (
    <>
      {isLoading && 
        <div id='preloader'>
          <div id='status'>
            <div className='spinner-chase'>
              <div className='chase-dot' />
              <div className='chase-dot' />
              <div className='chase-dot' />
              <div className='chase-dot' />
              <div className='chase-dot' />
              <div className='chase-dot' />
            </div>
            <p id='status-msg' className='mt-3'><i>{loadingMsg}</i></p>
          </div>
        </div>
      }
    </>
  )
}

PreLoader.propTypes = {
  isLoading: PropTypes.bool,
  loadingMsg: PropTypes.string
}
  

export default PreLoader