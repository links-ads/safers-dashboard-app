import React, { useEffect, useRef, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { configSelector, dateRangeSelector } from 'store/common/common.slice';
import {
  fetchAlerts,
  setNewAlertState,
  allAlertsSelector,
  filteredAlertsSelector,
  alertParamsSelector,
  isAlertPageActiveSelector,
} from 'store/alerts/alerts.slice';
import {
  fetchMapRequests,
  setNewMapRequestState,
  dataLayerParamsSelector,
  dataLayerMapRequestsSelector,
  dataLayerIsPageActiveSelector,
} from 'store/datalayer/datalayer.slice';
import {
  fetchEvents,
  setNewEventState,
  allEventsSelector,
  filteredEventsSelector,
  eventParamsSelector,
  isEventPageActiveSelector,
} from 'store/events/events.slice';
import {
  fetchNotifications,
  setNewNotificationState,
  allNotificationsSelector,
  notificationParamsSelector,
  notificationIsPageActiveSelector,
} from 'store/notifications/notifications.slice';

import useSetNewAlerts from '../customHooks/useSetNewAlerts';

const MILLISECONDS = 1000;
const PollingHelper = props => {
  const dispatch = useDispatch();
  const timer = useRef(null);

  // Map Requests
  const allMapRequests = useSelector(dataLayerMapRequestsSelector);
  const mapRequestParams = useSelector(dataLayerParamsSelector);
  const isMapRequestPageActive = useSelector(dataLayerIsPageActiveSelector);

  // Alerts
  const allAlerts = useSelector(allAlertsSelector);
  const filteredAlerts = useSelector(filteredAlertsSelector);
  const alertParams = useSelector(alertParamsSelector);
  const isAlertPageActive = useSelector(isAlertPageActiveSelector);

  // Events
  const allEvents = useSelector(allEventsSelector);
  const filteredEvents = useSelector(filteredEventsSelector);
  const eventParams = useSelector(eventParamsSelector);
  const isEventPageActive = useSelector(isEventPageActiveSelector);

  // Notifications
  const allNotifications = useSelector(allNotificationsSelector);
  const notificationParams = useSelector(notificationParamsSelector);
  const isNotificationPageActive = useSelector(
    notificationIsPageActiveSelector,
  );

  const config = useSelector(configSelector);
  const dateRange = useSelector(dateRangeSelector);
  const pollingFrequency = config ? config.polling_frequency : undefined;

  const [currentNotificationCount, setCurrentNotificationCount] =
    useState(undefined);
  const [currentMapRequestCount, setCurrentMapRequestCount] =
    useState(undefined);

  let dateRangeParams = {};

  if (dateRange) {
    dateRangeParams = dateRange
      ? { start_date: dateRange[0], end_date: dateRange[1] }
      : {};
  }

  const callAPIs = () => {
    let alParams = null;
    let evParams = null;
    let ntParams = null;
    if (dateRange) {
      const { default_date: alertDate, ...restAlerts } = alertParams;
      alParams = { ...restAlerts };
      const { default_date: eventDate, ...restEvents } = eventParams;
      evParams = { ...restEvents };
      const { default_date: notificationDate, ...restNotifications } =
        notificationParams;
      ntParams = { ...restNotifications };
    }

    dispatch(fetchAlerts({ options: { ...alParams, ...dateRangeParams } }));
    dispatch(fetchEvents({ options: { ...evParams, ...dateRangeParams } }));
    dispatch(fetchNotifications({ ...ntParams, ...dateRangeParams }));
    dispatch(fetchMapRequests({ ...mapRequestParams, ...dateRangeParams }));
  };

  useEffect(() => {
    if (pollingFrequency && pollingFrequency > 0) {
      timer.current = setInterval(callAPIs, pollingFrequency * MILLISECONDS);
      return () => clearInterval(timer.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (pollingFrequency && pollingFrequency > 0) {
      clearInterval(timer.current);
      timer.current = setInterval(callAPIs, pollingFrequency * MILLISECONDS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alertParams, eventParams, notificationParams]);

  useSetNewAlerts(
    noOfMessages => {
      if (!isAlertPageActive) {
        dispatch(
          setNewAlertState({
            isNewAlert: true,
            isPageActive: false,
            newItemsCount: noOfMessages,
          }),
        );
      }
    },
    allAlerts,
    filteredAlerts,
    [allAlerts],
  );

  useSetNewAlerts(
    noOfMessages => {
      if (!isEventPageActive) {
        dispatch(
          setNewEventState({
            isNewEvent: true,
            isPageActive: false,
            newItemsCount: noOfMessages,
          }),
        );
      }
    },
    allEvents,
    filteredEvents,
    [allEvents],
  );

  useEffect(() => {
    const newNotificationsCount = allNotifications.length;
    if (
      currentNotificationCount &&
      newNotificationsCount > currentNotificationCount
    ) {
      let difference = newNotificationsCount - currentNotificationCount;
      if (!isNotificationPageActive)
        dispatch(
          setNewNotificationState({
            isNewNotification: true,
            isPageActive: false,
            newItemsCount: difference,
          }),
        );
    }
    setCurrentNotificationCount(newNotificationsCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allNotifications]);

  useEffect(() => {
    const newMapRequestCount = allMapRequests.length;

    const count = newMapRequestCount > currentMapRequestCount;

    if (currentMapRequestCount && count) {
      let difference = newMapRequestCount - currentMapRequestCount;
      dispatch(
        setNewMapRequestState({
          isNewAlert: true,
          isPageActive: isMapRequestPageActive,
          newItemsCount: difference,
        }),
      );
    }
    setCurrentMapRequestCount(newMapRequestCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allMapRequests]);

  return <>{props.children}</>;
};

export default PollingHelper;
