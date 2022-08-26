import React, { useEffect, useRef, useState } from 'react';
import {
  useDispatch,
  useSelector
} from 'react-redux';
import { 
  getAllFireAlerts, 
  setNewAlertState, 
  getAllEventAlerts, 
  setNewEventState,
  getAllNotifications,
  setNewNotificationState,
  getAllMapRequests,
  setNewMapRequestState
} from '../store/appAction';

const MILLISECONDS = 1000;
const pollingHelper = (props) => {
  const dispatch = useDispatch();
  const timer = useRef(null)

  // Map Requests
  const {
    allMapRequests,
    params: mapRequestParams,
    isPageActive: isMapRequestPageActive
  } = useSelector(state => state.dataLayer);

  // Alerts
  const {
    allAlerts,
    params: alertParams,
    isPageActive: isAlertPageActive,
  } = useSelector(state => state.alerts);

  // Events
  const { 
    allAlerts: allEvents, 
    params: eventParams, 
    isPageActive: isEventPageActive 
  } = useSelector(state => state.eventAlerts);

  // Notifications ?? But in app there are more?
  const { 
    allNotifications, 
    params: notificationParams, 
    isPageActive: isNotificationPageActive 
  } = useSelector(state => state.notifications);

  const {config, dateRange} = useSelector(state => state.common);
  const pollingFrequency = config ? config.polling_frequency : undefined;

  const [currentAlertCount, setCurrentAlertCount] = useState(undefined);
  const [currentEventCount, setCurrentEventCount] = useState(undefined);
  const [currentNotificationCount, setCurrentNotificationCount] = useState(undefined);
  const [currentMapRequestCount, setCurrentMapRequestCount] = useState(undefined);

  let dateRangeParams = {};

  if(dateRange) {
    delete alertParams.default_date;
    delete eventParams.default_date;
    delete notificationParams.default_date;
    dateRangeParams = { start_date: dateRange[0], end_date: dateRange[1] }
  }

  const callAPIs = () => {
    dispatch(getAllFireAlerts({...alertParams, ...dateRangeParams}));
    dispatch(getAllEventAlerts({...eventParams, ...dateRangeParams}));
    dispatch(getAllNotifications({...notificationParams, ...dateRangeParams}));
    dispatch(getAllMapRequests({...notificationParams, ...mapRequestParams}));
  };

  useEffect(() => {
    if (pollingFrequency && pollingFrequency > 0) {
      timer.current = setInterval(callAPIs, pollingFrequency * MILLISECONDS);
      return () => clearInterval(timer.current);
    }
  }, []);

  useEffect(() => {
    if (pollingFrequency && pollingFrequency > 0) {
      clearInterval(timer.current);
      timer.current = setInterval(callAPIs, pollingFrequency * MILLISECONDS);
    }
  }, [alertParams, eventParams, notificationParams]);

  useEffect(() => {
    const newAlertsCount = allAlerts.length
    if (currentAlertCount && newAlertsCount > currentAlertCount) {
      let difference = newAlertsCount - currentAlertCount;
      if (!isAlertPageActive)
        dispatch(setNewAlertState(true, false, difference));
    }
    setCurrentAlertCount(newAlertsCount);
  }, [allAlerts]);
  
  useEffect(() => {
    const newEventsCount = allEvents.length
    if (currentEventCount && newEventsCount > currentEventCount) {
      let difference = newEventsCount - currentEventCount;
      if (!isEventPageActive)
        dispatch(setNewEventState(true, false, difference));
    }
    setCurrentEventCount(newEventsCount);
  }, [allEvents]);

  useEffect(() => {
    const newNotificationsCount = allNotifications.length
    if (currentNotificationCount && newNotificationsCount > currentNotificationCount) {
      let difference = newNotificationsCount - currentNotificationCount;
      if (!isNotificationPageActive)
        dispatch(setNewNotificationState(true, false, difference));
    }
    setCurrentNotificationCount(newNotificationsCount);
  }, [allNotifications]);

  useEffect(() => {
    const newMapRequestCount = allMapRequests.length
    if (currentMapRequestCount && newMapRequestCount > 
    currentMapRequestCount) {
      let difference = newMapRequestCount - currentMapRequestCount;
      if (!isMapRequestPageActive)
        dispatch(setNewMapRequestState(true, false, difference));
    }
    setCurrentMapRequestCount(newMapRequestCount);
  }, [allMapRequests]);

  return (
    <>
      {props.children}
    </>
  );
}

export default pollingHelper;
