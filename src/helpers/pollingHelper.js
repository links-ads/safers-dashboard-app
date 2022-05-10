import React, { useEffect, useRef, useState } from 'react';
import {
  useDispatch,
  useSelector
} from 'react-redux';
import { POLLING_INTERVAL } from '../config';
import { getAllFireAlerts, setNewAlertState, getAllEventAlerts, setNewEventState } from '../store/appAction';
import { getAllNotifications, setNewNotificationState } from '../store/notifications/action';

const pollingHelper = (props) => {
  const dispatch = useDispatch();
  const timer = useRef(null)
  const allAlerts = useSelector(state => state.alerts.allAlerts);
  const alertParams = useSelector(state => state.alerts.params);
  const isAlertPageActive = useSelector(state => state.alerts.isPageActive);
  const [currentAlertCount, setCurrentAlertCount] = useState(undefined);

  const allEvents = useSelector(state => state.eventAlerts.allAlerts);
  const eventParams = useSelector(state => state.eventAlerts.params);
  const isEventPageActive = useSelector(state => state.eventAlerts.isPageActive);
  const [currentEventCount, setCurrentEventCount] = useState(undefined);

  const allNotifications = useSelector(state => state.notifications.allNotifications);
  const notificationParams = useSelector(state => state.notifications.params);
  const isNotificationPageActive = useSelector(state => state.notifications.isPageActive);
  const [currentNotificationCount, setCurrentNotificationCount] = useState(undefined);

  const callAPIs = () => {
    dispatch(getAllFireAlerts(alertParams));
    dispatch(getAllEventAlerts(eventParams));
    dispatch(getAllNotifications(notificationParams));
  };

  useEffect(() => {
    timer.current = setInterval(callAPIs, POLLING_INTERVAL);
    return () => clearInterval(timer.current);
  }, []);

  useEffect(() => {
    clearInterval(timer.current);
    timer.current = setInterval(callAPIs, POLLING_INTERVAL);
  }, [alertParams, eventParams, notificationParams]);

  useEffect(() => {
    var newAlertsCount = allAlerts.length
    if (currentAlertCount && newAlertsCount > currentAlertCount) {
      let difference = newAlertsCount - currentAlertCount;
      if (!isAlertPageActive)
        dispatch(setNewAlertState(true, false, difference));
    }
    setCurrentAlertCount(newAlertsCount);
  }, [allAlerts]);

  useEffect(() => {
    var newEventsCount = allEvents.length
    if (currentEventCount && newEventsCount > currentEventCount) {
      let difference = newEventsCount - currentEventCount;
      if (!isEventPageActive)
        dispatch(setNewEventState(true, false, difference));
    }
    setCurrentEventCount(newEventsCount);
  }, [allEvents]);

  useEffect(() => {
    var newNotificationsCount = allNotifications.length
    if (currentNotificationCount && newNotificationsCount > currentNotificationCount) {
      let difference = newNotificationsCount - currentNotificationCount;
      if (!isNotificationPageActive)
        dispatch(setNewNotificationState(true, false, difference));
    }
    setCurrentNotificationCount(newNotificationsCount);
  }, [allEvents]);

  return (
    <>
      {props.children}
    </>
  );
}

export default pollingHelper;