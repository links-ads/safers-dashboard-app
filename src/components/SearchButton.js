import React from 'react';
import { Button } from 'reactstrap'
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

const SearchButton = ({ index, getInfoByArea }) => {
  const { t } = useTranslation();
  return (
    <Button
      key={index}
      className="btn-rounded alert-search-area"
      style={{
        position: 'absolute',
        top: 10,
        textAlign: 'center',
        marginLeft: '41%'
      }}
      onClick={getInfoByArea}
    >
      <i className="bx bx-revision"></i>{' '}
      {t('Search This Area', { ns: 'common' })}
    </Button >
  )
}

SearchButton.propTypes = {
  index: PropTypes.number,
  getInfoByArea: PropTypes.func,
}

export default SearchButton