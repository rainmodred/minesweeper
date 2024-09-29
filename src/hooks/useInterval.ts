import { useEffect, useRef } from 'react';

//fix accuracy
function intervalTimer(callback: () => void, interval = 500) {
  let counter = 1;
  let timeoutId: number;
  const startTime = Date.now();

  function main() {
    const nowTime = Date.now();
    const nextTime = startTime + counter * interval;
    timeoutId = window.setTimeout(main, interval - (nowTime - nextTime));
    counter += 1;
    callback();
  }
  timeoutId = window.setTimeout(main, interval);
  return () => {
    clearTimeout(timeoutId);
  };
}
let value = 10;
const cancelTimer = intervalTimer(() => {
  if (value > 0) {
    value -= 1;
  } else {
    cancelTimer();
  }
}, 1000);

// https://overreacted.io/making-setinterval-declarative-with-react-hooks/
const useInterval = (callback: () => void, delay: number | null) => {
  const savedCallback = useRef<(() => void) | null>(null);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      if (savedCallback.current) {
        savedCallback.current();
      }
    }
    if (delay !== null) {
      const cancelTimer = intervalTimer(tick, delay);
      return () => cancelTimer();
    }
  }, [delay]);
};

export default useInterval;
