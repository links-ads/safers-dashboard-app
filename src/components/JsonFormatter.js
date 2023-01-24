import React from 'react';

import highlight from 'json-format-highlight';
import PropTypes from 'prop-types';

const JsonFormatter = ({ data }) => {
  const jsonTheme = {
    keyColor: '#ffffff',
    numberColor: '#007bff',
    stringColor: '#B3B2B2',
    trueColor: '#199891',
    nullColor: '#ffffff',
  };

  return (
    <pre className="px-3">
      <code
        dangerouslySetInnerHTML={{
          __html: highlight(data, jsonTheme),
        }}
      />
    </pre>
  );
};

JsonFormatter.propTypes = {
  data: PropTypes.object,
};

export default JsonFormatter;
