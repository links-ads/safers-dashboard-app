import React, { useEffect, useRef, useState } from 'react';
import {
  useDispatch,/*, useSelector*/
  useSelector
} from 'react-redux';
import { POLLING_INTERVAL } from '../config';
import { getAllFireAlerts, setNewAlertState } from '../store/appAction';

const pollingHelper = (props) => {
  const dispatch = useDispatch();
  const timer = useRef(null)
  const allAlerts = useSelector(state => state.alerts.allAlerts);
  const alertParams = useSelector(state => state.alerts.params);
  const isAlertPageActive = useSelector(state => state.alerts.isPageActive);
  const [currentAlertCount, setCurrentAlertCount] = useState(undefined);

  const callAPIs = () => {
    dispatch(getAllFireAlerts(alertParams));
  };

  useEffect(() => {
    timer.current = setInterval(callAPIs, POLLING_INTERVAL);
    return () => clearInterval(timer.current);
  }, []);

  useEffect(() => {
    clearInterval(timer.current);
    timer.current = setInterval(callAPIs, POLLING_INTERVAL);
  }, [alertParams]);

  useEffect(() => {
    var newAlertsCount = /*allAlerts.length*/ Math.floor(Math.random() * 90 + 10);//to simulate new alerts
    if (currentAlertCount && newAlertsCount > currentAlertCount) {
      let difference = newAlertsCount - currentAlertCount;
      if (!isAlertPageActive)
        dispatch(setNewAlertState(true, false, difference));
    }
    setCurrentAlertCount(newAlertsCount);
  }, [allAlerts]);

  return (
    <>
      {props.children}
    </>
  );
}

export default pollingHelper;