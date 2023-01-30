import { useEffect } from 'react';

const useInterval = (callback, interval, dependencies = []) => {
  useEffect(() => {
    if (interval) {
      const timer = setInterval(() => {
        callback();
      }, interval);
      return () => clearInterval(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
};

export default useInterval;
