import React, { useEffect, useRef, useState } from 'react';
import {
  useDispatch,
  useSelector
} from 'react-redux';
import { getAllFireAlerts, setNewAlertState, getAllEventAlerts, setNewEventState } from '../store/appAction';

const pollingHelper = (props) => {
  const dispatch = useDispatch();
  const timer = useRef(null)
  const config = useSelector(state => state.common.config);
  const pollingFrequency = config ? config.polling_frequency : undefined;
  const allAlerts = useSelector(state => state.alerts.allAlerts);
  const alertParams = useSelector(state => state.alerts.params);
  const isAlertPageActive = useSelector(state => state.alerts.isPageActive);
  const [currentAlertCount, setCurrentAlertCount] = useState(undefined);

  const allEvents = useSelector(state => state.eventAlerts.allAlerts);
  const eventParams = useSelector(state => state.eventAlerts.params);
  const isEventPageActive = useSelector(state => state.eventAlerts.isPageActive);
  const [currentEventCount, setCurrentEventCount] = useState(undefined);

  const callAPIs = () => {
    dispatch(getAllFireAlerts(alertParams));
    dispatch(getAllEventAlerts(eventParams));
  };

  useEffect(() => {
    if (pollingFrequency && pollingFrequency > 0) {
      timer.current = setInterval(callAPIs, pollingFrequency);
      return () => clearInterval(timer.current);
    }
  }, []);

  useEffect(() => {
    if (pollingFrequency && pollingFrequency > 0) {
      clearInterval(timer.current);
      timer.current = setInterval(callAPIs, pollingFrequency);
    }
  }, [alertParams, eventParams]);

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

  return (
    <>
      {props.children}
    </>
  );
}

export default pollingHelper;