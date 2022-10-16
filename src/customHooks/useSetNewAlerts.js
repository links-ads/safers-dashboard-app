import { useEffect }  from 'react';

// Used for setting the global store value with number of new alerts
const useSetNewAlerts= (callback, soureArr, targetArr, dependencies=[]) => {
  useEffect(() => {
    /*
      soureArr - one fetched by polling - latest data set
      targetArr - one user viewed
      Compare two arrays with each object and see if any difference which becomes new alerts
    */
    const comparedArr = soureArr.filter(sourceObj => !targetArr.find((targetObj) => targetObj.id === sourceObj.id));
    callback(comparedArr.length);
  }, dependencies);
}

export default useSetNewAlerts;