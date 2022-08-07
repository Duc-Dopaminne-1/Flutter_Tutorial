import React from 'react';
import styles from './styles';
import { View, Text, ActivityIndicator } from 'react-native';

const LoadingModalTenant = () => {

  return (
    <View style={[styles.modalBackground]}>
      <View style={styles.activityIndicatorWrapper}>
        <ActivityIndicator size="large" animating={true} />
        <Text allowFontScaling={false} style={styles.text} numberOfLines={1}>Loading...</Text>
      </View>
    </View>
  );
};

export default LoadingModalTenant;
