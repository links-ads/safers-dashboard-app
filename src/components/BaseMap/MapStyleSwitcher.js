import React from 'react';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

export const MapStyleSwitcher = ({
  mapStyles = {},
  selectMapStyle,
}) => {
  const { t } = useTranslation();

  return (
    <UncontrolledDropdown
      className="me-2"
      direction="down"
    >
      <DropdownToggle
        caret
        color="primary"
      >
        <span className="d-flex align-items-center">
          <i className="bx bxs-map-alt p-2 map-style-icon"></i>
          {t('Change Map Style', { ns: 'common' })}
        </span>
      </DropdownToggle>
      <DropdownMenu>
        {mapStyles.map(mapStyle => (
          <div className="d-flex flex-column align-items-center justify-content-center" key={mapStyle.label}>
            <DropdownItem onClick={() => selectMapStyle(mapStyle)}>
              <div className="d-flex flex-column align-items-center justify-content-center">
                <img src={mapStyle.thumbnail} className="w-75 h-75" alt={mapStyle.label} />
                <p>{mapStyle.label}</p>
              </div>
            </DropdownItem>
          </div>
        ))}
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

MapStyleSwitcher.propTypes = {
  mapStyles: PropTypes.arrayOf(PropTypes.object),
  selectMapStyle: PropTypes.func,
}
