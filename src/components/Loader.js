import React from 'react';

import PropTypes from 'prop-types';

const Loader = ({ show, msg }) => {
  return (
    show && (
      <div className="status">
        <div className="spinner-chase">
          <div className="chase-dot" />
          <div className="chase-dot" />
          <div className="chase-dot" />
          <div className="chase-dot" />
          <div className="chase-dot" />
          <div className="chase-dot" />
        </div>
        <p className="mt-3">
          <i>{msg}</i>
        </p>
      </div>
    )
  );
};

Loader.propTypes = {
  show: PropTypes.bool,
  msg: PropTypes.string,
};

export default Loader;
