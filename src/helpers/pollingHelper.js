import React, { useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import {
  useDispatch,
  useSelector
} from 'react-redux';
import { 
  getAllFireAlerts, 
  setNewAlertState, 
  getAllEventAlerts, 
  setNewEventState, 
  setNewOnDemandState
} from '../store/appAction';
import { getAllNotifications, setNewNotificationState } from '../store/notifications/action';
import { getAllMapRequests } from '../store/datalayer/action';
 

const MILLISECONDS = 1000;
const pollingHelper = (props) => {
  const dispatch = useDispatch();
  const timer = useRef(null)
  const {config, dateRange} = useSelector(state => state.common);
  const pollingFrequency = config ? config.polling_frequency : undefined;
  const allAlerts = useSelector(state => state.alerts.allAlerts);
  const alertParams = useSelector(state => state.alerts.params);
  const isAlertPageActive = useSelector(state => state.alerts.isPageActive);
  const [currentAlertCount, setCurrentAlertCount] = useState(undefined);
  
  const allMapRequests = useSelector(state=> state?.dataLayer?.allMapRequests)

  const allEvents = useSelector(state => state.eventAlerts.allAlerts);
  const eventParams = useSelector(state => state.eventAlerts.params);
  const isEventPageActive = useSelector(state => state.eventAlerts.isPageActive);
  const [currentEventCount, setCurrentEventCount] = useState(undefined);
  const { allNotifications, params:notificationParams } = useSelector(state => state.notifications);
  const isNotificationPageActive = useSelector(state => state.notifications.isPageActive);
  const [currentNotificationCount, setCurrentNotificationCount] = useState(undefined);
  
  const [lastOnDemandResponse, setLastOnDemandResponse] = useState({});
  
  const isOnDemandPageActive = useSelector(state => state?.dataLayer?.isPageActive);


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
    dispatch(getAllMapRequests());
  };

  useEffect(() => {
    if (pollingFrequency && pollingFrequency > 0) {
      timer.current = setInterval(callAPIs, pollingFrequency * MILLISECONDS);
      return () => clearInterval(timer.current);
    }
  }, []);

  // This is intented to watch for data coming back from the allMapRequests polling
  // We compare the JSON coming back (deep equality in lodash) to the previous value,
  // held in local state, and only do the dispatch if the object has changed (we're polling
  // every few seconds and in reality status changes will happen over minutes or hours)
  // However, any use of this useEffect causes an application hang with no errors, even if it's just
  // the console.log
  useEffect(() => {
    if (pollingFrequency && pollingFrequency > 0) {
      clearInterval(timer.current);
      timer.current = setInterval(callAPIs, pollingFrequency * MILLISECONDS);
      if (!_.isEqual(lastOnDemandResponse, allMapRequests)) {
        if (!isOnDemandPageActive) {
          dispatch(setNewOnDemandState(true, true));
        }
        setLastOnDemandResponse(allMapRequests); 
      }
    }
  }, [allMapRequests]);

  useEffect(() => {
    if (pollingFrequency && pollingFrequency > 0) {
      clearInterval(timer.current);
      timer.current = setInterval(callAPIs, pollingFrequency * MILLISECONDS);
    }
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
  }, [allNotifications]);

  return (
    <>
      {props.children}
    </>
  );
}

export default pollingHelper;
