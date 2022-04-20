import React, { useEffect } from 'react';
import { useDispatch/*, useSelector*/ } from 'react-redux';
import { POLLING_INTERVAL } from '../config';
import { getAllFireAlerts } from '../store/appAction';

const pollingHelper = (props) => {
  const dispatch = useDispatch();

  const callAPIs = () => {
    dispatch(getAllFireAlerts(
      {
        sortOrder: 'desc',
        source: 'all',
      }
    ));
  };

  useEffect(() => {
    const timer = setInterval(callAPIs, POLLING_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {props.children}
    </>
  );
}

export default pollingHelper;