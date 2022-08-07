import React from 'react';
import styles from './styles';
import { View, ActivityIndicator } from 'react-native';
import { colors } from '../../vars';

const LoadingModal = () => {
  return (
    <View style={styles.modalBackground}>
      <ActivityIndicator color={colors.red_600} size="large" animating={true} />
    </View>
  );
};

export default LoadingModal;
