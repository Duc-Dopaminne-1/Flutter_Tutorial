import React, {useEffect, useState} from 'react';
import {TextInput} from 'react-native';

import {useMount} from '../screens/commonHooks';
import useDebounce from '../utils/UseDebounce';

const DebounceInput = ({onChangeText, value, delayTimeout = 500, ...otherProps}) => {
  const [term, setTerm] = useState(value);
  const [isFirstRun, setFirstRun] = useState(true);
  const debouncedTerm = useDebounce(term, delayTimeout);

  useMount(() => {
    if (isFirstRun) {
      setFirstRun(false);
    }
  });

  useEffect(() => {
    if (!isFirstRun) {
      onChangeText(debouncedTerm);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTerm]);

  useEffect(() => {
    setTerm(value);
  }, [value]);

  const onChangeTextIput = text => {
    setTerm(text);
  };

  return <TextInput onChangeText={onChangeTextIput} value={term} {...otherProps} />;
};

export default DebounceInput;
