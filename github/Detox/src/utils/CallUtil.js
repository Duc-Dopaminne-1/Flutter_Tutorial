import {Platform} from 'react-native';

const callUrl = (number, promp = true) => {
  const url = `${Platform.OS === 'ios' && promp ? 'telprompt:' : 'tel:'}${number}`;
  return url;
};

export default {callUrl};
