import React, { useEffect, useRef } from 'react';
import {
  useDispatch,/*, useSelector*/
  useSelector
} from 'react-redux';
import { POLLING_INTERVAL } from '../config';
import { getAllFireAlerts } from '../store/appAction';

const pollingHelper = (props) => {
  const dispatch = useDispatch();
  const timer = useRef(null)
  const alertParams = useSelector(state => state.alerts.params);

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

  return (
    <>
      {props.children}
    </>
  );
}

export default pollingHelper;