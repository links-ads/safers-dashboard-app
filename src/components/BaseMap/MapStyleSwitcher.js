import React from 'react';

import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledTooltip,
} from 'reactstrap';

export const MapStyleSwitcher = ({ mapStyles = {}, selectMapStyle }) => {
  const { t } = useTranslation();

  return (
    <>
      <UncontrolledTooltip placement="left" target="UncontrolledDropdown">
        {t('Change Map Style', { ns: 'common' })}
      </UncontrolledTooltip>

      <UncontrolledDropdown
        id="UncontrolledDropdown"
        className="map-style-dropdown"
        direction="start"
      >
        <DropdownToggle caret size="sm" color="mapstyle">
          <span className="d-flex align-items-center">
            <i className="bx bxs-layer map-style-icon"></i>
          </span>
        </DropdownToggle>
        <DropdownMenu>
          {mapStyles.map(mapStyle => (
            <div
              className="d-flex flex-column align-items-center justify-content-center"
              key={mapStyle.label}
            >
              <DropdownItem onClick={() => selectMapStyle(mapStyle)}>
                <div className="d-flex flex-column align-items-center justify-content-center">
                  <img
                    src={mapStyle.thumbnail}
                    className="w-75 h-75"
                    alt={mapStyle.label}
                  />
                  <p>{t(mapStyle.label, { ns: 'common' })}</p>
                </div>
              </DropdownItem>
            </div>
          ))}
        </DropdownMenu>
      </UncontrolledDropdown>
    </>
  );
};

MapStyleSwitcher.propTypes = {
  mapStyles: PropTypes.arrayOf(PropTypes.object),
  selectMapStyle: PropTypes.func,
};
