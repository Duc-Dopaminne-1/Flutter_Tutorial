import React from 'react';
import styles from './styles';
import { CustomText } from '../CustomText';

interface Props {
  errorValue: any;
}

const ErrorMessage = (props: Props) => {
  const { errorValue } = props;

  return errorValue ? <CustomText style={styles.errorText} text={errorValue} /> : null;
};

export default ErrorMessage;
