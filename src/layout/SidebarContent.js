import React, { useEffect, useRef } from 'react';

import Menu from 'metismenujs';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useLocation, Link } from 'react-router-dom';
import SimpleBar from 'simplebar-react';

import {
  dataLayerNewItemsCountSelector,
  dataLayerIsNewAlertSelector,
  dataLayerIsPageActiveSelector,
} from 'store/datalayer/datalayer.slice';
import { newEventCountSelector } from 'store/events/events.slice';
import {
  isNewNotificationSelector,
  newItemsCountNotificationSelector,
} from 'store/notifications/notifications.slice';

import { SIGNIN_REDIRECT } from '../config';

//i18n

// Import Scrollbar

// MetisMenu
// import { withRouter } from 'react-router-dom'

const SidebarContent = props => {
  const newAlertsCount = useSelector(state => state.alerts.newItemsCount);
  const newEventsCount = useSelector(newEventCountSelector);
  const isNewNotification = useSelector(isNewNotificationSelector);
  const newNotificationsCount = useSelector(newItemsCountNotificationSelector);
  const isNewMapRequestAlert = useSelector(dataLayerIsNewAlertSelector);
  const newMapRequestCount = useSelector(dataLayerNewItemsCountSelector);
  const isMapRequestPageActive = useSelector(dataLayerIsPageActiveSelector);

  const ref = useRef();
  const location = useLocation();
  // Use ComponentDidMount and ComponentDidUpdate method symultaniously
  useEffect(() => {
    const initMenu = () => {
      new Menu('#side-menu');
    };
    initMenu();
  }, []);

  useEffect(() => {
    ref.current.recalculate();
  });

  useEffect(() => {
    let matchingMenuItem = null;
    const ul = document.getElementById('side-menu');
    const items = ul.getElementsByTagName('a');
    for (let i = 0; i < items.length; ++i) {
      const currentURL =
        location.pathname === '/' ? SIGNIN_REDIRECT : location.pathname;
      if (currentURL === items[i].pathname) {
        matchingMenuItem = items[i];
      }
      ctrlParentDropdown(false, items[i]);
    }
    if (matchingMenuItem) {
      ctrlParentDropdown(true, matchingMenuItem);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop;
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300;
      }
    }
  }

  function classCtrl(add = true, instance, clsName) {
    add ? instance.classList.add(clsName) : instance.classList.remove(clsName);
  }

  function getDashboardNotificationCount() {
    const newEvents = newEventsCount ?? 0;
    const newAlerts = newAlertsCount ?? 0;
    const newMapRequests = newMapRequestCount ?? 0;
    return newEvents + newAlerts + newMapRequests;
  }

  function ctrlParentDropdown(activate = true, item) {
    classCtrl(activate, item, 'active');
    const parent = item.parentElement;
    const parent2El = parent.childNodes[1];
    if (parent2El && parent2El.id !== 'side-menu') {
      classCtrl(activate, parent2El, 'mm-show');
    }

    if (parent) {
      classCtrl(activate, parent, 'mm-active');
      const parent2 = parent.parentElement;

      if (parent2) {
        classCtrl(activate, parent2, 'mm-show');

        const parent3 = parent2.parentElement; // li tag

        if (parent3) {
          classCtrl(activate, parent3, 'mm-active');
          classCtrl(activate, parent3.childNodes[0], 'mm-active');
          const parent4 = parent3.parentElement; // ul
          if (parent4) {
            classCtrl(activate, parent4, 'mm-show');
            const parent5 = parent4.parentElement;
            if (parent5) {
              classCtrl(activate, parent5, 'mm-show');
              classCtrl(activate, parent5.childNodes[0], 'mm-active');
            }
          }
        }
      }
      scrollElement(item);
      return false;
    }
    scrollElement(item);
    return false;
  }

  return (
    <React.Fragment>
      <SimpleBar style={{ maxHeight: '100%' }} ref={ref}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            <li>
              <Link to="/dashboard">
                <i className="bx bxs-home"></i>
                <span className="text-capitalize">{props.t('Dashboard')}</span>
                {getDashboardNotificationCount() > 0 && (
                  <span className="new-info-indicator float-end">
                    {getDashboardNotificationCount()}
                  </span>
                )}
              </Link>
            </li>
            <li>
              <Link to="/fire-alerts">
                <i className="bx bx-error-circle"></i>
                <span className="text-capitalize">
                  {props.t('fire-alerts')}
                </span>
                {newAlertsCount > 0 && (
                  <span className="new-info-indicator float-end">
                    {newAlertsCount}
                  </span>
                )}
              </Link>
            </li>
            <li>
              <Link to="/event-alerts">
                <i className="bx bxs-hot"></i>
                <span className="text-capitalize">{props.t('Events')}</span>
                {newEventsCount > 0 && (
                  <span className="new-info-indicator float-end">
                    {newEventsCount}
                  </span>
                )}
              </Link>
            </li>
            <li>
              <Link to="/data-layer">
                <i className="bx bx-copy"></i>
                <span className="text-capitalize">
                  {props.t('Data Layers')}
                </span>
                {isNewMapRequestAlert && !isMapRequestPageActive ? (
                  <span className="new-info-indicator float-end">
                    {newMapRequestCount}
                  </span>
                ) : null}
              </Link>
            </li>
            <li>
              <Link to="/insitu-alerts">
                <i className="bx bx-image"></i>
                <span className="text-capitalize">
                  {props.t('In Situ Cameras', { ns: 'inSitu' })}
                </span>
              </Link>
            </li>
            <li>
              <Link to="/chatbot">
                <i className="bx bx-bot"></i>
                <span className="text-capitalize">
                  {props.t('chatbot-module')}
                </span>
              </Link>
            </li>
            <li>
              <Link to="/notifications">
                <i className="bx bx-bell"></i>
                <span className="text-capitalize">
                  {props.t('Notifications')}
                </span>
                {isNewNotification && (
                  <span className="new-info-indicator float-end">
                    {newNotificationsCount}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </div>
      </SimpleBar>
    </React.Fragment>
  );
};

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withTranslation(['common'])(SidebarContent);
