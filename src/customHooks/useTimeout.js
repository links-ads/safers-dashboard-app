import { useEffect } from 'react';

const useTimeout = (callback, interval, dependencies = []) => {
  useEffect(() => {
    if (interval) {
      const timer = setTimeout(() => {
        callback();
      }, interval);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
};

export default useTimeout;
