import React from 'react';

import moment from 'moment';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

// Import menuDropdown
import {
  setDateRange,
  isDateRangeDisabledSelector,
} from 'store/common/common.slice';

import ProfileMenu from './TopbarDropdown/ProfileMenu';
import DateRangePicker from '../components/DateRangePicker/DateRange';
import LanguageDropdown from '../components/LanguageDropdown';
import { getDefaultDateRange } from '../store/utility';

const Header = () => {
  const dispatch = useDispatch();
  const defaultDate = getDefaultDateRange();

  // const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  const isDateRangeDisabled = useSelector(isDateRangeDisabledSelector);

  const clearDates = () => {
    dispatch(setDateRange(null));
  };

  const resetDates = () => {
    dispatch(setDateRange(defaultDate));
  };

  const handleDateRangePicker = dates => {
    dispatch(
      setDateRange(dates.map(date => moment(date).format('YYYY-MM-DD'))),
    );
  };

  function toggleFullscreen() {
    if (
      !document.fullscreenElement &&
      /* alternative standard method */ !document.mozFullScreenElement &&
      !document.webkitFullscreenElement
    ) {
      // current working methods
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(
          Element.ALLOW_KEYBOARD_INPUT,
        );
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  }

  function tToggle() {
    var body = document.body;
    body.classList.toggle('vertical-collpsed');
    body.classList.toggle('sidebar-enable');
  }

  return (
    <React.Fragment>
      <header id="page-topbar">
        <div className="navbar-header">
          <div className="d-flex">
            <button
              type="button"
              onClick={() => {
                tToggle();
              }}
              className="btn btn-sm px-3 font-size-16 header-item "
              aria-label="vertical-menu-btn"
              id="vertical-menu-btn"
            >
              <i className="fa fa-fw fa-bars" />
            </button>
          </div>
          <div className="d-flex align-items-center">
            <DateRangePicker
              setDates={handleDateRangePicker}
              resetDates={resetDates}
              clearDates={clearDates}
              defaultDateRange={defaultDate}
              isDateRangeDisabled={isDateRangeDisabled}
            />
            <div className="dropdown d-none d-lg-inline-block ms-1">
              <button
                type="button"
                onClick={() => {
                  toggleFullscreen();
                }}
                className="btn header-item noti-icon "
                data-toggle="fullscreen"
                aria-label="btn-header-item"
              >
                <i className="bx bx-fullscreen" />
              </button>
            </div>
            <LanguageDropdown />
            <ProfileMenu />
          </div>
        </div>
      </header>
    </React.Fragment>
  );
};

Header.propTypes = {
  changeSidebarType: PropTypes.func,
  leftMenu: PropTypes.any,
  leftSideBarType: PropTypes.any,
  showRightSidebar: PropTypes.any,
  showRightSidebarAction: PropTypes.func,
  t: PropTypes.any,
  toggleLeftmenu: PropTypes.func,
};

export default Header;
