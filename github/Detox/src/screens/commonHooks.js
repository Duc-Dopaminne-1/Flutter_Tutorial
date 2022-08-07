import {useEffect, useRef} from 'react';
import {InteractionManager} from 'react-native';

const useMount = func =>
  useEffect(() => {
    if (func) {
      return func();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

const useMountInteraction = func =>
  useEffect(() => {
    callAfterInteraction(func);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

function callAfterInteraction(func) {
  InteractionManager.runAfterInteractions(() => {
    func && func();
  });
}

const useConstructor = (callback = () => {}) => {
  const hasBeenCalled = useRef(false);
  if (hasBeenCalled.current) {
    return;
  }
  callback();
  hasBeenCalled.current = true;
};

export {callAfterInteraction, useConstructor, useMount, useMountInteraction};
