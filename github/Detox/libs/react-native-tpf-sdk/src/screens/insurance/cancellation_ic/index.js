import React from 'react';
import styles from './styles';
import { ICTick } from '../../../assets/icons';
import { View } from 'react-native';
import AppText from '../../../components/app_text';

const CancellationIc = props => (
  <View style={styles.cancellationIcWrapper}>
    <ICTick />
    <AppText medium style={styles.cancelText}>
      {'cancellation_ic.canceled'}
    </AppText>
  </View>
);

CancellationIc.propTypes = {
  // bla: PropTypes.string,
};

CancellationIc.defaultProps = {
  // bla: 'test',
};

export default CancellationIc;
