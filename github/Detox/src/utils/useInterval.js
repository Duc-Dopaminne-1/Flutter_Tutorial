import {useEffect, useRef, useState} from 'react';

const useInterval = ({handler, interval}) => {
  const [intervalId, setIntervalId] = useState();
  const savedCallback = useRef();

  // Remember the latest function.
  useEffect(() => {
    savedCallback.current = handler;
  }, [handler]);

  useEffect(() => {
    return () => clearInterval(intervalId);
  }, [intervalId]);

  const callback = () => {
    savedCallback.current && savedCallback.current();
  };

  const startInterval = () => {
    const id = setInterval(callback, interval);
    setIntervalId(id);
  };

  const stopInterval = () => {
    clearInterval(intervalId);
  };

  return {startInterval, stopInterval};
};

export default useInterval;
