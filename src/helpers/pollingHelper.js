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
  const [currentAlertCount, setCurrentAlertCount] = useState(allAlerts.count);

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
    var randomBoolean = Math.random() < 0.5;//to simulate new alerts
    if (allAlerts.count > currentAlertCount || randomBoolean) {
      if (!isAlertPageActive)
        dispatch(setNewAlertState(true));
    }
    setCurrentAlertCount(allAlerts.count);
  }, [allAlerts]);

  return (
    <>
      {props.children}
    </>
  );
}

export default pollingHelper;