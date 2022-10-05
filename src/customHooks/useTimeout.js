import { useEffect }  from 'react';

const useTimeout = (callback, interval, dependencies=[]) => {
  useEffect(() => {
    if(interval){
      const timer = setTimeout(() => {
        callback();
      }, interval);
      return () => clearTimeout(timer);
    }
  }, dependencies);
}

export default useTimeout;